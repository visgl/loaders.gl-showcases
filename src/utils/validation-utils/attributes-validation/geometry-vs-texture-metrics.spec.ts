import { getTriangleVertices, getTriangleArea } from './triangles-calculation';
import { getGeometryVsTextureMetrics } from './geometry-vs-texture-metrics';

jest.mock('./triangles-calculation', () => ({
  getTriangleVertices: jest.fn(),
  getTriangleArea: jest.fn()
}));

describe("Geometry vs texture metrics", () => {
  test("Should return null if no tile", () => {
    const tile = null;
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no tile content", () => {
    const tile = {
      content: null
    };
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no tile content attributes", () => {
    const tile = {
      content: {
        attributes: null
      }
    };
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no positions", () => {
    const tile = {
      content: {
        attributes: {
          positions: null,
          texCoords: [1, 2, 3]
        }
      }
    };
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no texCoords", () => {
    const tile = {
      content: {
        attributes: {
          positions: [1, 2, 3],
          texCoords: null
        }
      }
    };
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no tile content material ", () => {
    const tile = {
      content: {
        attributes: {
          positions: [1, 2, 3],
          texCoords: [1, 2, 3]
        },
        material: null
      }
    };
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no tile content material pbrMetallicRoughness", () => {
    const tile = {
      content: {
        attributes: {
          positions: [1, 2, 3],
          texCoords: [1, 2, 3]
        },
        material: {
          pbrMetallicRoughness: null
        }
      }
    };
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no tile content material pbrMetallicRoughness baseColorTexture", () => {
    const tile = {
      content: {
        attributes: {
          positions: [1, 2, 3],
          texCoords: [1, 2, 3]
        },
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: null
          }
        }
      }
    };
    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if no tile content material pbrMetallicRoughness baseColorTexture texture source image", () => {
    const tile = {
      content: {
        attributes: {
          positions: [1, 2, 3],
          texCoords: [1, 2, 3]
        },
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: {
              texture: {
                source: {
                  image: null
                }
              }
            }
          }
        }
      }
    };

    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return null if texture height and width are 0", () => {
    const tile = {
      content: {
        attributes: {
          positions: [1, 2, 3],
          texCoords: [1, 2, 3]
        },
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: {
              texture: {
                source: {
                  image: {
                    height: 0,
                    width: 0
                  }
                }
              }
            }
          }
        }
      }
    };

    const result = getGeometryVsTextureMetrics(tile);
    expect(result).toStrictEqual(null);
  });

  test("Should return metrics with triangle area 0", () => {
    getTriangleArea
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
    const tile = {
      content: {
        attributes: {
          positions: {
            value: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            size: 3
          },
          texCoords: [1, 2, 3]
        },
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: {
              texture: {
                source: {
                  image: {
                    height: 10,
                    width: 10
                  }
                }
              }
            }
          }
        }
      }
    };
    const expectedResult = {
      "geometryNullTriangleCount": 1,
      "geometrySmallTriangleCount": 1,
      "minGeometryArea": 1.7976931348623157e+308,
      "minTexCoordArea": 1.7976931348623157e+308,
      "pixelArea": 0.01,
      "texCoordNullTriangleCount": 1,
      "texCoordSmallTriangleCount": 1,
      "triangles": 1,
    };

    const result = getGeometryVsTextureMetrics(tile);

    expect(getTriangleArea).toBeCalled();
    expect(getTriangleVertices).toBeCalled();
    expect(result).toStrictEqual(expectedResult);
  });

  test("Should return metrics with triangle area more then 0", () => {

    getTriangleArea
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(1)
    const tile = {
      content: {
        attributes: {
          positions: {
            value: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            size: 3
          },
          texCoords: [1, 2, 3]
        },
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: {
              texture: {
                source: {
                  image: {
                    height: 10,
                    width: 10
                  }
                }
              }
            }
          }
        }
      }
    };
    const expectedResult = {
      "geometryNullTriangleCount": 0,
      "geometrySmallTriangleCount": 0,
      "minGeometryArea": 1,
      "minTexCoordArea": 1,
      "pixelArea": 0.01,
      "texCoordNullTriangleCount": 0,
      "texCoordSmallTriangleCount": 0,
      "triangles": 1,
    };

    const result = getGeometryVsTextureMetrics(tile);

    expect(getTriangleArea).toBeCalled();
    expect(getTriangleVertices).toBeCalled();
    expect(result).toStrictEqual(expectedResult);
  });
});
