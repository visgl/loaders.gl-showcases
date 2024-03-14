import type { Tile3D } from "@loaders.gl/tiles";

import { Vector3 } from "@math.gl/core";
import { Ellipsoid } from "@math.gl/geospatial";
import type { NormalsDebugData, PositionsData } from "../../types";
import type { Position } from "@deck.gl/core/typed";

const VALUES_PER_VERTEX = 3;

const scratchVector = new Vector3();

/**
 * Generates data for display normals by Line layer.
 * @param tile
 * @returns returs object with typed normals and positions array and length
 */
export function generateBinaryNormalsDebugData(
  tile: Tile3D
): NormalsDebugData | null {
  if (
    !tile?.content?.attributes?.normals ||
    !tile?.content?.attributes?.positions
  ) {
    return null;
  }

  const normals = tile.content.attributes.normals.value;
  const positions = tile.content.attributes.positions.value;
  const modelMatrix = tile.content.modelMatrix;
  const cartographicModelMatrix = tile.content.cartographicModelMatrix;
  const cartographicOrigin = tile.content.cartographicOrigin;

  const cartesianPositions = new positions.constructor(positions.length);
  for (let i = 0; i < cartesianPositions.length; i += 3) {
    const position = positions.subarray(i, i + 3);
    scratchVector.set(position[0], position[1], position[2]);
    scratchVector.transform(modelMatrix).add(cartographicOrigin);
    Ellipsoid.WGS84.cartographicToCartesian(scratchVector, scratchVector);
    cartesianPositions.set(scratchVector, i);
  }

  return {
    src: { normals, positions: cartesianPositions },
    length: positions.length,
    modelMatrix,
    cartographicModelMatrix,
    cartographicOrigin,
  };
}

/**
 * @param index
 * @param data
 * @param trianglesPercentage - percent of triangles to show normals
 * @returns source position in cartographic coordinates
 */
export function getNormalSourcePosition(
  index: number,
  data: PositionsData,
  trianglesPercentage: number
): Position {
  const positions = data.src.positions;
  const normalsGap = getNormalsGap(positions, trianglesPercentage);
  const sourcePosition = new Vector3();

  if (index % normalsGap === 0 || normalsGap === 0) {
    sourcePosition.set(
      positions[index * 3],
      positions[index * 3 + 1],
      positions[index * 3 + 2]
    );
  }

  return [sourcePosition.x, sourcePosition.y, sourcePosition.z];
}

/**
 * @param index
 * @param data
 * @param trianglesPercentage - percent of triangles to show normals
 * @param normalsLength - allows change visible normals length
 * @returns target position in cartographic coordinates
 */
export function getNormalTargetPosition(
  index: number,
  data: PositionsData,
  trianglesPercentage: number,
  normalsLength: number
): Position {
  const positions = data.src.positions;
  const normalsGap = getNormalsGap(positions, trianglesPercentage);
  let targetPosition: Vector3 = new Vector3();

  if (index % normalsGap === 0 || normalsGap === 0) {
    const normals = data.src.normals;

    const position = new Vector3([
      positions[index * 3],
      positions[index * 3 + 1],
      positions[index * 3 + 2],
    ]);
    const normal = new Vector3([
      normals[index * 3],
      normals[index * 3 + 1],
      normals[index * 3 + 2],
    ]).multiplyByScalar(normalsLength);
    targetPosition = position.add(normal);
  }

  return [targetPosition.x, targetPosition.y, targetPosition.z];
}

/**
 * Calculates normals gap based on showing normals percentage
 * @param positions
 * @param trianglesPercentage
 */
function getNormalsGap(
  positions: Float32Array,
  trianglesPercentage: number
): number {
  const triangleCount = positions.length / VALUES_PER_VERTEX;
  const trianglesToShow = Math.floor(
    triangleCount * (trianglesPercentage / 100)
  );
  const trianglesGap = Math.floor(triangleCount / trianglesToShow);
  return trianglesGap === 1 ? trianglesGap : trianglesGap * VALUES_PER_VERTEX;
}
