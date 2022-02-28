import { generateBinaryNormalsDebugData, getNormalSourcePosition, getNormalTargetPosition } from './normals-utils';

jest.mock('@math.gl/core', () => ({
  Vector3: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockImplementation(() => 1),
    test: 'success',
    set: jest.fn(),
    transform: jest.fn().mockImplementation(() => ({ add: jest.fn() })),
    multiplyByScalar: jest.fn().mockImplementation(() => 1),
  }))
}));

jest.mock('@math.gl/geospatial', () => ({
  Ellipsoid: {
    WGS84: {
      cartographicToCartesian: jest.fn()
    }
  }
}));

describe("generateBinaryNormalsDebugData", () => {
  test("Should return empty object if no tile content", () => {
    const tile = {};
    const result = generateBinaryNormalsDebugData(tile);
    expect(result).toStrictEqual({});
  });

  test("Should return empty object if no attributes in tile content", () => {
    const tile = { content: {} };
    const result = generateBinaryNormalsDebugData(tile);
    expect(result).toStrictEqual({});
  });

  test("Should return empty object if no normals or positions in attributes in tile content", () => {
    const tile = { content: { attributes: {} } };
    const result = generateBinaryNormalsDebugData(tile);
    expect(result).toStrictEqual({});
  });

  test("Should return empty object if no positions in attributes in tile content", () => {
    const tile = { content: { attributes: { normals: null } } };
    const result = generateBinaryNormalsDebugData(tile);
    expect(result).toStrictEqual({});
  });

  test("Should return empty object if no normals or positions in attributes in tile content", () => {
    const tile = { content: { attributes: { positions: null } } };
    const result = generateBinaryNormalsDebugData(tile);
    expect(result).toStrictEqual({});
  });

  test("Should return empty object if no normals or positions in attributes in tile content", () => {
    const positionsValue = new Float32Array([1, 2, 3, 4, 5]);
    const normalsValue = new Float32Array([6, 7, 8, 9, 10]);

    const tile = {
      content: {
        attributes: {
          positions: { value: positionsValue },
          normals: { value: normalsValue }
        },
        cartographicModelMatrix: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
        cartographicOrigin: [1, 2, 3],
        modelMatrix: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
      }
    };

    const expectedDebugData = {
      "cartographicModelMatrix": [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
      "cartographicOrigin": [
        1,
        2,
        3,
      ],
      "length": 5,
      "modelMatrix": [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
      "src": {
        "normals": new Float32Array([6, 7, 8, 9, 10]),
        "positions": new Float32Array([0, 0, 0, 0, 0]),
      },
    }
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
        normals: new Float32Array([])
      }
    }

    const trianglesPercentage = 100;

    const result = getNormalSourcePosition(index, data, trianglesPercentage);
    expect(result).toStrictEqual({});
  });

  test("Should return normal source position", () => {
    const index = 0;
    const data = {
      src: {
        positions: new Float32Array([1, 2, 3]),
        normals: new Float32Array([])
      }
    }

    const trianglesPercentage = 100;

    const result = getNormalSourcePosition(index, data, trianglesPercentage);
    expect(result.set).toBeDefined();
    expect(result.transform).toBeDefined();
    expect(result.test).toBe('success');
  });

});

describe("getNormalTargetPosition", () => {
  test("Should return empty object if no positions and normals", () => {
    const index = 0;
    const data = {
      src: {
        positions: new Float32Array([]),
        normals: new Float32Array([])
      }
    }

    const trianglesPercentage = 100;
    const normalsLength = 10;

    const result = getNormalTargetPosition(index, data, trianglesPercentage, normalsLength);
    expect(result).toStrictEqual({});
  });

  test("Should return normal target position", () => {
    const index = 0;
    const data = {
      src: {
        positions: new Float32Array([1, 2, 3]),
        normals: new Float32Array([1, 2, 3])
      }
    }

    const trianglesPercentage = 100;
    const normalsLength = 10;

    const result = getNormalTargetPosition(index, data, trianglesPercentage, normalsLength);
    expect(result).toStrictEqual(1);
  });
});
