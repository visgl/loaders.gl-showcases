import { Vector3 } from "@math.gl/core";

const scratchVector = new Vector3();
/**
 * Create array of posisitons where each vertex is vector
 * @param positions
 */
export const convertPositionsToVectors = (positions: Float32Array): Vector3[] => {
  const result: Vector3[] = [];

  for (let i = 0; i < positions.length; i += 3) {
    scratchVector.set(
      positions[i],
      positions[i + 1],
      positions[i + 2]
    )
    result.push(scratchVector);
  }

  return result;
};
