import type { ObbData } from './types';
import { Tile3D } from "@loaders.gl/tiles";
import { OrientedBoundingBox, BoundingSphere } from "@math.gl/culling";
import { OBB, MBS } from "../constants/bounding-volumes";

/**
 * Generates needed bounding volume from tile bounding volume
 * @param tile
 * @param boundingType
 */
export const createBoundingVolumeFromTile = (tile: Tile3D, boundingType: string): BoundingSphere | OrientedBoundingBox => {
  switch (boundingType) {
    case OBB: {
      return createBoundingBoxFromTileObb(tile.header.obb);
    }
    case MBS: {
      return createBoundingSphereFromTileMbs(tile.header.mbs);
    }
    default:
      throw new Error("Validator - Not supported Bounding Volume Type");
  }
};

/**
 * Generates BoundingSphere from tile mbs data
 * @param mbs
 */
const createBoundingSphereFromTileMbs = (mbs: number[]): BoundingSphere => new BoundingSphere([mbs[0], mbs[1], mbs[2]], mbs[3]);
/**
* Generates OrientedBoundingBox from tile obb data
* @param obb
*/
const createBoundingBoxFromTileObb = (obb: ObbData): OrientedBoundingBox => {
  const { center, halfSize, quaternion } = obb;
  return new OrientedBoundingBox().fromCenterHalfSizeQuaternion(
    center,
    halfSize,
    quaternion
  );
};
