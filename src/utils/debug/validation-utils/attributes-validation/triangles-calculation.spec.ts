import { Vector3 } from "@math.gl/core";
import { getTriangleVertices, getTriangleArea } from "./triangles-calculation";

describe("Triangles Calculation - getTriangleVertices", () => {
  test("Should return geometry vertices", () => {
    const attribute = {
      value: new Float32Array([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
      ]),
      size: 3,
    };
    const offset = 10;

    const result = getTriangleVertices(attribute, offset);
    expect(result[0]).toEqual([10, 11, 12]);
    expect(result[1]).toEqual([13, 14, 15]);
    expect(result[2]).toEqual([16, 17, 18]);
  });
});

describe("Triangles Calculation - getTriangleArea", () => {
  test("Should return area", () => {
    const vertices = [
      new Vector3(1, 1, 1),
      new Vector3(2, 2, 2),
      new Vector3(0, 3, 3),
    ];

    const result = getTriangleArea(vertices);
    expect(result).toStrictEqual(2.1213203435596424);
  });
});
