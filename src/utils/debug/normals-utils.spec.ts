import {
  generateBinaryNormalsDebugData,
  getNormalSourcePosition,
  getNormalTargetPosition,
} from "./normals-utils";
import { getTile3d } from "../../test/tile-stub";

jest.mock("@math.gl/geospatial", () => ({
  Ellipsoid: {
    WGS84: {
      cartographicToCartesian: jest.fn(),
    },
  },
}));

describe("generateBinaryNormalsDebugData", () => {
  test("Should return empty object if no tile content", () => {
    const tile = getTile3d();
    tile.unloadContent();
    const result = generateBinaryNormalsDebugData(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return empty object if no attributes in tile content", () => {
    const tile = getTile3d();
    const result = generateBinaryNormalsDebugData(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return empty object if no normals or positions in attributes in tile content", () => {
    const tile = getTile3d();
    tile.content = { attributes: {} };
    const result = generateBinaryNormalsDebugData(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return empty object if normals are nul in tile content", () => {
    const tile = getTile3d();
    tile.content = { attributes: { normals: null } };
    const result = generateBinaryNormalsDebugData(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return empty object if positions are null in attributes in tile content", () => {
    const tile = getTile3d();
    tile.content = { attributes: { positions: null } };
    const result = generateBinaryNormalsDebugData(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return correct normals data", () => {
    const tile = getTile3d();
    const positionsValue = new Float32Array([1, 2, 3, 4, 5, 6]);
    const normalsValue = new Float32Array([6, 7, 8, 9, 10, 11]);

    tile.content = {
      attributes: {
        positions: { value: positionsValue },
        normals: { value: normalsValue },
      },
      cartographicModelMatrix: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ],
      cartographicOrigin: [1, 2, 3],
      modelMatrix: [11, 22, 33, 44, 55, 66, 77, 88, 99, 12, 21, 31, 41, 51, 61],
    };

    const expectedDebugData = {
      cartographicModelMatrix: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ],
      cartographicOrigin: [1, 2, 3],
      length: 6,
      modelMatrix: [11, 22, 33, 44, 55, 66, 77, 88, 99, 12, 21, 31, 41, 51, 61],
      src: {
        normals: new Float32Array([6, 7, 8, 9, 10, 11]),
        positions: new Float32Array([460, 243, 314, 955, 543, 707]),
      },
    };
    const result = generateBinaryNormalsDebugData(tile);
    expect(result).toStrictEqual(expectedDebugData);
  });
});

describe("getNormalSourcePosition", () => {
  test("Should return empty object if no positions and normals", () => {
    const index = 0;
    const data = {
      src: {
        positions: new Float32Array([]),
        normals: new Float32Array([]),
      },
    };

    const trianglesPercentage = 100;

    const result = getNormalSourcePosition(index, data, trianglesPercentage);
    expect(result).toStrictEqual([0, 0, 0]);
  });

  test("Should return normal source position", () => {
    const index = 0;
    const data = {
      src: {
        positions: new Float32Array([1, 2, 3]),
        normals: new Float32Array([]),
      },
    };

    const trianglesPercentage = 100;

    const result = getNormalSourcePosition(index, data, trianglesPercentage);
    expect(result).toStrictEqual([1, 2, 3]);
  });
});

describe("getNormalTargetPosition", () => {
  test("Should return empty object if no positions and normals", () => {
    const index = 0;
    const data = {
      src: {
        positions: new Float32Array([]),
        normals: new Float32Array([]),
      },
    };

    const trianglesPercentage = 100;
    const normalsLength = 10;

    const result = getNormalTargetPosition(
      index,
      data,
      trianglesPercentage,
      normalsLength
    );
    expect(result).toStrictEqual([0, 0, 0]);
  });

  test("Should return normal target position", () => {
    const index = 0;
    const data = {
      src: {
        positions: new Float32Array([1, 2, 3]),
        normals: new Float32Array([1, 2, 3]),
      },
    };

    const trianglesPercentage = 100;
    const normalsLength = 10;

    const result = getNormalTargetPosition(
      index,
      data,
      trianglesPercentage,
      normalsLength
    );
    expect(result).toEqual([11, 22, 33]);
  });
});
