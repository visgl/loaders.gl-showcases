import { getTriangleVertices, getTriangleArea } from './triangles-calculation';
import { Vector3 } from "@math.gl/core";

jest.mock('@math.gl/core', () => ({
  Vector3: jest.fn()
}));

describe("Triangles Calculation - getTriangleVertices", () => {
  test("Should return geometry vertices", () => {
    Vector3.mockReturnValue({
      test: 1,
      set: jest.fn()
    })

    const attribute = {
      value: {
        subarray: jest.fn(),
        constructor: jest.fn().mockReturnValue({
          set: jest.fn()
        })
      },
      size: 5
    };
    const offset = 10;

    const result = getTriangleVertices(attribute, offset);
    expect(result[0].test).toStrictEqual(1);
    expect(result[1].test).toStrictEqual(1);
    expect(result[2].test).toStrictEqual(1);
  });

});

describe("Triangles Calculation - getTriangleArea", () => {
  test("Should return area", () => {
    const vertices = [
      { x: 1, y: 1, z: 1 },
      { x: 2, y: 2, z: 2 }
    ];

    Vector3.mockReturnValue({
      set: jest.fn().mockReturnValue({
        subtract: jest.fn().mockReturnValue({
          angle: jest.fn().mockReturnValue(120),
          magnitude: jest.fn().mockReturnValue(5)
        })
      })
    });
    const result = getTriangleArea(vertices);
    expect(result).toStrictEqual(7.257639802653928);
  });
});
