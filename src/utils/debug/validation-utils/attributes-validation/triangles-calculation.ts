import type { MeshAttribute } from "@loaders.gl/schema";

import { Vector3 } from "@math.gl/core";

const scratchVector = new Vector3();
const scratchVector2 = new Vector3();

/**
 * Calculate triangle vertices of tile
 * @param attribute
 * @param offset
 */
export const getTriangleVertices = (
  attribute: MeshAttribute,
  offset: number
): Vector3[] => {
  const geometryVertices: Vector3[] = [];
  for (let i = 0; i < 3; i++) {
    // @ts-expect-error - This expression is not constructable. Type 'Function' has no construct signatures.
    const typedArray = new attribute.value.constructor(3);
    const subarray = attribute.value.subarray(
      offset + i * attribute.size,
      offset + i * attribute.size + attribute.size
    );

    typedArray.set(subarray);

    geometryVertices.push(
      new Vector3(typedArray[0], typedArray[1], typedArray[2])
    );
  }
  return geometryVertices;
};

/**
 * Calculates triangles area based on vertices
 * @param vertices
 */
export const getTriangleArea = (vertices: Vector3[]): number => {
  const edge1 = scratchVector
    .set(vertices[0].x, vertices[0].y, vertices[0].z)
    .subtract(vertices[1]);

  const edge2 = scratchVector2
    .set(vertices[1].x, vertices[1].y, vertices[1].z)
    .subtract(vertices[2]);

  const angle = edge1.angle(edge2);
  const area = 0.5 * edge1.magnitude() * edge2.magnitude() * Math.sin(angle);

  return area;
};
