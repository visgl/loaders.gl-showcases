import { OrientedBoundingBox, BoundingSphere } from "@math.gl/culling";
import { OBB, MBS } from "../constants/bounding-volumes";

/**
 * Generates needed bounding volume from tile bounding volume
 * @param {object} tile
 * @param {string} boundingType
 * @returns {BoundingSphere | OrientedBoundingBox}
 */
export const createBoundingVolumeFromTile = (tile, boundingType): BoundingSphere | OrientedBoundingBox | Error => {
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
 * @param {array} mbs
 * @returns {BoundingSphere}
 */
const createBoundingSphereFromTileMbs = (mbs): BoundingSphere => new BoundingSphere([mbs[0], mbs[1], mbs[2]], mbs[3]);
/**
* Generates OrientedBoundingBox from tile obb data
* @param {array} obb
* @returns {OrientedBoundingBox}
*/
const createBoundingBoxFromTileObb = (obb): OrientedBoundingBox => {
  const { center, halfSize, quaternion } = obb;
  return new OrientedBoundingBox().fromCenterHalfSizeQuaternion(
    center,
    halfSize,
    quaternion
  );
};
