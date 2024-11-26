import { getTriangleVertices, getTriangleArea } from "./triangles-calculation";
import { getGeometryVsTextureMetrics } from "./geometry-vs-texture-metrics";

jest.mock("./triangles-calculation", () => ({
  getTriangleVertices: jest.fn(),
  getTriangleArea: jest.fn(),
}));

describe("Geometry vs texture metrics", () => {
  test("Should return null if no tile", () => {
    const tile = null;
    // @ts-expect-error tile is not a full match to the type expected
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no tile content", () => {
    const tile = {
      content: null,
    };
    // @ts-expect-error tile is not a full match to the type expected
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no tile content attributes", () => {
    const tile = {
      content: {
        attributes: null,
      },
    };
    // @ts-expect-error tile is not a full match to the type expected
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no positions", () => {
    const tile = {
      content: {
        attributes: {
          positions: null,
          texCoords: [1, 2, 3],
        },
      },
    };
    // @ts-expect-error tile is not a full match to the type expected
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no texCoords", () => {
    const tile = {
      content: {
        attributes: {
          positions: [1, 2, 3],
          texCoords: null,
        },
      },
    };
    // @ts-expect-error tile is not a full match to the type expected
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no tile content material ", () => {
    const tile = {
      content: {
        attributes: {
          positions: [1, 2, 3],
          texCoords: [1, 2, 3],
        },
        material: null,
      },
    };
    // @ts-expect-error tile is not a full match to the type expected
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no tile content material pbrMetallicRoughness", () => {
    const tile = {
      content: {
        attributes: {
          positions: [1, 2, 3],
          texCoords: [1, 2, 3],
        },
        material: {
          pbrMetallicRoughness: null,
        },
      },
    };
    // @ts-expect-error tile is not a full match to the type expected
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no tile content material pbrMetallicRoughness baseColorTexture", () => {
    const tile = {
      content: {
        attributes: {
          positions: [1, 2, 3],
          texCoords: [1, 2, 3],
        },
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: null,
          },
        },
      },
    };
    // @ts-expect-error tile is not a full match to the type expected
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no tile content material pbrMetallicRoughness baseColorTexture texture source image", () => {
    const tile = {
      content: {
        attributes: {
          positions: [1, 2, 3],
          texCoords: [1, 2, 3],
        },
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: {
              texture: {
                source: {
                  image: null,
                },
              },
            },
          },
        },
      },
    };

    // @ts-expect-error tile is not a full match to the type expected
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if texture height and width are 0", () => {
    const tile = {
      content: {
        attributes: {
          positions: [1, 2, 3],
          texCoords: [1, 2, 3],
        },
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: {
              texture: {
                source: {
                  image: {
                    height: 0,
                    width: 0,
                  },
                },
              },
            },
          },
        },
      },
    };

    // @ts-expect-error test data doesn't fit to the type expected
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return metrics with triangle area 0", () => {
    (getTriangleArea as any).mockReturnValueOnce(0).mockReturnValueOnce(0);
    const tile = {
      content: {
        attributes: {
          positions: {
            value: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            size: 3,
          },
          texCoords: [1, 2, 3],
        },
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: {
              texture: {
                source: {
                  image: {
                    height: 10,
                    width: 10,
                  },
                },
              },
            },
          },
        },
      },
    };
    const expectedResult = {
      geometryNullTriangleCount: 1,
      geometrySmallTriangleCount: 1,
      minGeometryArea: 1.7976931348623157e308,
      minTexCoordArea: 1.7976931348623157e308,
      pixelArea: 0.01,
      texCoordNullTriangleCount: 1,
      texCoordSmallTriangleCount: 1,
      triangles: 1,
    };

    // @ts-expect-error tile is not a full match to the type expected
    const result = getGeometryVsTextureMetrics(tile);

    expect(getTriangleArea).toBeCalled();
    expect(getTriangleVertices).toBeCalled();
    expect(result).toStrictEqual(expectedResult);
  });

  test("Should return metrics with triangle area more then 0", () => {
    (getTriangleArea as any).mockReturnValueOnce(1).mockReturnValueOnce(1);
    const tile = {
      content: {
        attributes: {
          positions: {
            value: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            size: 3,
          },
          texCoords: [1, 2, 3],
        },
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: {
              texture: {
                source: {
                  image: {
                    height: 10,
                    width: 10,
                  },
                },
              },
            },
          },
        },
      },
    };
    const expectedResult = {
      geometryNullTriangleCount: 0,
      geometrySmallTriangleCount: 0,
      minGeometryArea: 1,
      minTexCoordArea: 1,
      pixelArea: 0.01,
      texCoordNullTriangleCount: 0,
      texCoordSmallTriangleCount: 0,
      triangles: 1,
    };

    // @ts-expect-error tile is not a full match to the type expected
    const result = getGeometryVsTextureMetrics(tile);

    expect(getTriangleArea).toBeCalled();
    expect(getTriangleVertices).toBeCalled();
    expect(result).toStrictEqual(expectedResult);
  });
});
