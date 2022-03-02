import { OrientedBoundingBox } from "@math.gl/culling";
import { MBS, OBB } from "../constants/bounding-volumes";

/**
 * Defines the Bounding Box type
 * @param {number} tile
 * @returns {string} - defined Bounding box type
 */
export const getBoundingType = (tile) => {
  if (tile.header.obb || tile.boundingVolume instanceof OrientedBoundingBox) {
    return OBB;
  }
  return MBS;
};
