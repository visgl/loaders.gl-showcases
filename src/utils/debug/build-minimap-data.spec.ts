import { buildMinimapData } from "./build-minimap-data";
import { Vector3 } from "@math.gl/core";

describe("Build Minimap Data", () => {
  test("Should return empty array if no tiles prodived", () => {
    const result = buildMinimapData([]);
    expect(result).toStrictEqual([]);
  });

  test("Should return empty array if no selected tiles", () => {
    const tiles = [
      {
        selected: false,
      },
    ];
    const result = buildMinimapData(tiles);
    expect(result).toStrictEqual([]);
  });

  test("Should return empty array if no tiles with 'main' vieport in viewportIds", () => {
    const tiles = [
      {
        selected: true,
        viewportIds: [],
      },
    ];
    const result = buildMinimapData(tiles);
    expect(result).toStrictEqual([]);
  });

  test("Should return minimap data if radius is presented in bounding volume", () => {
    const tiles = [
      {
        selected: true,
        viewportIds: ["main"],
        boundingVolume: {
          center: [1, 2, 3],
          radius: 10,
        },
      },
    ];

    const expectedResult = [
      {
        coordinates: new Vector3([
          63.43494882292201, 53.48500010847735, -6364361.246505878,
        ]),
        radius: 10,
      },
    ];
    const result = buildMinimapData(tiles);
    expect(result).toStrictEqual(expectedResult);
  });

  test("Should return minimap data if halfAxes are presented in bounding volume", () => {
    const tiles = [
      {
        selected: true,
        viewportIds: ["main"],
        boundingVolume: {
          center: [1, 2, 3],
          halfAxes: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          getBoundingSphere: () => ({
            radius: 10,
          }),
        },
      },
    ];

    const expectedResult = [
      {
        coordinates: new Vector3([
          63.43494882292201, 53.48500010847735, -6364361.246505878,
        ]),
        radius: 10,
      },
    ];
    const result = buildMinimapData(tiles);
    expect(result).toStrictEqual(expectedResult);
  });
});
