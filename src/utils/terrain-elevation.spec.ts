import { getElevationByCentralTile } from "./terrain-elevation";

describe("Terrain Elevation", () => {
  test("Should return null elevation if no terrain tiles provided", () => {
    const latitude = 37.7608732848;
    const longitude = -122.427411;
    const result = getElevationByCentralTile(longitude, latitude, {});
    expect(result).toStrictEqual(null);
  });

  test("Should return null elevation if no center tile was founded", () => {
    const latitude = 37.7608732848;
    const longitude = -122.427411;

    const terrainTiles = {
      1: {
        bbox: {
          east: -122.34375,
          north: 37.71859032558813,
          south: 37.64903402157865,
          west: -122.431640625,
        },
      },
    };
    const result = getElevationByCentralTile(longitude, latitude, terrainTiles);
    expect(result).toStrictEqual(null);
  });

  test("Should return current elevation", () => {
    const latitude = 38;
    const longitude = 122;

    const terrainTiles = {
      1: {
        bbox: {
          east: 130,
          north: 39,
          south: 37,
          west: 110,
        },
        content: [
          {
            attributes: {
              POSITION: {
                value: new Float32Array([1, 2, 3, 4, 5, 6]),
              },
            },
          },
        ],
      },
    };
    const result = getElevationByCentralTile(longitude, latitude, terrainTiles);
    expect(result).toStrictEqual(6);
  });
});
