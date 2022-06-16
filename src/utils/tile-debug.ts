import type { Tile3D } from "@loaders.gl/tiles";
import type { TileWarning } from '../types';

import { checkBoundingVolumes } from "./validation-utils/tile-validation/bounding-volume-validation";
import { isAllVerticesInsideBoundingVolume } from "./bounding-volume-vertices";
import { checkLOD } from "./validation-utils/tile-validation/lod-validation";
import { getTileDataForValidation } from "./validation-utils/tile-validation/tile-validation-data";

/**
 * Generates list of tile warnings
 * @param tile
 * @returns List of warnings
 */
export const validateTile = (tile: Tile3D): TileWarning[] => {
  const tileWarnings: TileWarning[] = [];

  if (tile.parent) {
    checkBoundingVolumes(tile, tileWarnings);
    checkLOD(tile, tileWarnings);
  }

  return tileWarnings;
};

/**
 * Get tile's children info (count, ids)
 * @param children
 * @returns children data
 */
export const getChildrenInfo = (
  children: Tile3D[]
): { count: number; ids: string } => {
  if (!children?.length) {
    return {
      count: NaN,
      ids: "",
    };
  }

  return {
    count: children.length,
    ids: children.map((children: Tile3D) => children.id).join(", "),
  };
};

/**
 * Check if geometry of tile inside bounding volume
 * @param tile
 */
export const isTileGeometryInsideBoundingVolume = (tile: Tile3D): boolean => {
  const tileData = getTileDataForValidation(tile);
  const { positions, boundingVolume } = tileData;

  return isAllVerticesInsideBoundingVolume(boundingVolume, positions);
};
