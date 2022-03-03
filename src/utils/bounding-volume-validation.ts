import type { Tile3D } from "@loaders.gl/tiles";
import type { TileWarning } from "./types";

import {
  OrientedBoundingBox,
  BoundingSphere,
  makeOrientedBoundingBoxFromPoints,
  makeBoundingSphereFromPoints,
} from "@math.gl/culling";
import { getBoundingType } from "./get-volume-type";
import { createBoundingVolumeFromTile } from "./bounding-volume-from-tile";
import { getTileObbVertices, isAllVerticesInsideBoundingVolume } from "./bounding-volume-vertices";
import { getTileDataForValidation } from "./tile-validation-data";
import { convertPositionsToVectors } from "./convert-positions-to-vectors";
import { OBB, MBS } from '../constants/bounding-volumes';
import { BOUNDING_VOLUME_WARNING_TYPE } from "../constants/map-styles";

/**
* Do validation of tile's Bounding Volumes
* @param tile
* @param tileWarnings
*/
export const checkBoundingVolumes = (tile: Tile3D, tileWarnings: TileWarning[]): void => {
  const boundingType = getBoundingType(tile);

  switch (boundingType) {
    case OBB: {
      validateObb(tile, tileWarnings);
      break;
    }
    case MBS: {
      validateMbs(tile, tileWarnings);
      break;
    }
    default:
      console.warn("Validator - Not supported Bounding Volume Type");
  }
};

/**
 * Check if bounding volume made of geometry is more suitable than tile bounding volume
 * @param tile
 */
export const isGeometryBoundingVolumeMoreSuitable = (tile: Tile3D): boolean => {
  const tileData = getTileDataForValidation(tile);
  const { positions, boundingVolume } = tileData;
  const cartographicPositions = convertPositionsToVectors(positions);

  if (boundingVolume instanceof OrientedBoundingBox) {
    const geometryObb = makeOrientedBoundingBoxFromPoints(
      cartographicPositions,
      new OrientedBoundingBox()
    );
    const geometryObbVolume = geometryObb.halfSize.reduce(
      (result, halfSize) => result * halfSize
    );
    const tileObbVolume = boundingVolume.halfSize.reduce(
      (result, halfSize) => result * halfSize
    );
    return geometryObbVolume < tileObbVolume;
  }

  if (boundingVolume instanceof BoundingSphere) {
    const geometrySphere = makeBoundingSphereFromPoints(
      cartographicPositions,
      new BoundingSphere()
    );
    return geometrySphere.radius < boundingVolume.radius;
  }

  throw new Error("Unsupported bounding volume type")
};

/**
 * Do validation of tile OBB
 * @param tile
 * @param tileWarnings
 * Check if child OBB inside parent OBB
 */
const validateObb = (tile: Tile3D, tileWarnings: TileWarning[]): void => {
  const parentObb = createBoundingVolumeFromTile(tile.parent, OBB);
  const tileVertices = getTileObbVertices(tile);
  const isTileObbInsideParentObb = isAllVerticesInsideBoundingVolume(
    parentObb,
    tileVertices
  );

  if (isTileObbInsideParentObb) {
    return;
  }

  const title = `OBB of Tile (${tile.id}) doesn't fit into Parent (${tile.parent.id}) tile OBB`;
  tileWarnings.push({ type: BOUNDING_VOLUME_WARNING_TYPE, title });
};

/**
 * Do validation of tile MBS
 * @param tile
 * @param tileWarnings
 * Check if child MBS inside parent MBS
 */
const validateMbs = (tile: Tile3D, tileWarnings: TileWarning[]): void => {
  const tileMbs = createBoundingVolumeFromTile(tile, MBS);
  const parentMbs = createBoundingVolumeFromTile(tile.parent, MBS);

  if (tileMbs instanceof BoundingSphere && parentMbs instanceof BoundingSphere) {
    const distanceBetweenCenters = tileMbs.center.distanceTo(parentMbs.center);

    if (distanceBetweenCenters + tileMbs.radius > parentMbs.radius) {
      const title = `MBS of Tile (${tile.id}) doesn't fit into Parent (${tile.parent.id}) tile MBS`;
      tileWarnings.push({ type: BOUNDING_VOLUME_WARNING_TYPE, title });
    }
  }
};
