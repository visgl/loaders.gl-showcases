import type { Tile3D } from "@loaders.gl/tiles";
import { OrientedBoundingBox } from "@math.gl/culling";
import { MBS, OBB } from "../constants/bounding-volumes";

/**
 * Defines the Bounding Box type
 * @param tile
 */
export const getBoundingType = (tile: Tile3D): string => {
  if (tile.header.obb || tile.boundingVolume instanceof OrientedBoundingBox) {
    return OBB;
  }
  return MBS;
};
