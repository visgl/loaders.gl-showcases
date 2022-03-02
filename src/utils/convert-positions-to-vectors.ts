import { Vector3 } from "@math.gl/core";
/**
 * Create array of posisitons where each vertex is vector
 * @param {array} positions
 * @returns {Vector3[]}
 */
export const convertPositionsToVectors = (positions) => {
  const result: Vector3[] = [];

  for (let i = 0; i < positions.length; i += 3) {
    const positionVector = new Vector3(
      positions[i],
      positions[i + 1],
      positions[i + 2]
    );

    result.push(positionVector);
  }

  return result;
};
