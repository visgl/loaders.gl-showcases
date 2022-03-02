import { CubeGeometry } from "@luma.gl/engine";
import { Ellipsoid } from "@math.gl/geospatial";
import { Vector3 } from "@math.gl/core";

/**
 * Calculates  obb vertices of tile
 * @param {object} tile
 * @returns {number[]}
 */
export const getTileObbVertices = (tile) => {
  const geometry = new CubeGeometry();
  const halfSize = tile.header.obb.halfSize;

  const attributes = geometry.getAttributes();
  const positions = new Float32Array(attributes.POSITION.value);
  const obbCenterCartesian = Ellipsoid.WGS84.cartographicToCartesian(
    tile.header.obb.center
  );

  let vertices: Vector3[] = [];

  for (let i = 0; i < positions.length; i += 3) {
    const positionsVector = new Vector3(
      (positions[i] *= halfSize[0]),
      (positions[i + 1] *= halfSize[1]),
      (positions[i + 2] *= halfSize[2])
    );
    const rotatedPositions = positionsVector
      .transformByQuaternion(tile.header.obb.quaternion)
      .add(obbCenterCartesian);

    vertices = vertices.concat(rotatedPositions);
  }

  return vertices;
};

/**
 * Check if provided vertices are inside bounding volume
 * @param {OrientedBoundingBox | BoundingSphere} boundingVolume
 * @param {array} positions
 * @returns {boolean}
 */
export const isAllVerticesInsideBoundingVolume = (boundingVolume, positions) => {
  let isVerticesInsideObb = true;

  for (let index = 0; index < positions.length / 3; index += 3) {
    const point = [
      positions[index],
      positions[index + 1],
      positions[index + 2],
    ];
    const cartographicPoint = Ellipsoid.WGS84.cartesianToCartographic(point);
    // If point inside sphere then distance is NaN because of sqrt of negative value.
    // If point inside box then distance is 0.
    const distance = boundingVolume.distanceTo(cartographicPoint);

    if (distance > 0) {
      isVerticesInsideObb = false;
      break;
    }
  }

  return isVerticesInsideObb;
};
