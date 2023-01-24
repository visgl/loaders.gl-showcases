import { validateTile, isTileGeometryInsideBoundingVolume } from "./tile-debug";
import { isAllVerticesInsideBoundingVolume } from "./bounding-volume-vertices";
import { getTileDataForValidation } from "./validation-utils/tile-validation/tile-validation-data";
import { getTile3d } from "../../test/tile-stub";

jest.mock(
  "./validation-utils/tile-validation/bounding-volume-validation",
  () => ({
    checkBoundingVolumes: jest
      .fn()
      .mockImplementation((_, tileWarnings) =>
        tileWarnings.push("checkBoundingVolumes warning")
      ),
  })
);

jest.mock("./validation-utils/tile-validation/lod-validation", () => ({
  checkLOD: jest
    .fn()
    .mockImplementation((_, tileWarnings) =>
      tileWarnings.push("checkLOD warning")
    ),
}));

jest.mock("./bounding-volume-vertices", () => ({
  isAllVerticesInsideBoundingVolume: jest.fn().mockImplementation(() => true),
}));

jest.mock("./bounding-volume", () => ({
  getBoundingType: jest
    .fn()
    .mockImplementationOnce(() => "Oriented Bounding Box")
    .mockImplementationOnce(() => "Minimum Bounding Sphere"),
  createBoundingVolumeFromTile: jest
    .fn()
    .mockImplementation(() => "Bounding Volume is created"),
}));

jest.mock("./validation-utils/tile-validation/tile-validation-data", () => ({
  getTileDataForValidation: jest.fn().mockImplementation(() => ({
    positions: new Float32Array([1, 2, 3]),
    boundingVolume: "Bounding Volume",
  })),
}));

describe("Tile Debug - validateTile", () => {
  let tile;
  beforeEach(() => {
    tile = getTile3d();
  });
  test("Should return empty tile if no tile parent", () => {
    tile.parent = null;
    const result = validateTile(tile);
    expect(result).toStrictEqual([]);
  });

  test("Should return tile warnings", () => {
    tile.parent = {};
    const expectedResult = ["checkBoundingVolumes warning", "checkLOD warning"];

    const result = validateTile(tile);
    expect(result).toStrictEqual(expectedResult);
  });
});

describe("Tile Debug - isTileGeometryInsideBoundingVolume", () => {
  test("Should return true", () => {
    const tile = getTile3d();
    const result = isTileGeometryInsideBoundingVolume(tile);

    expect(getTileDataForValidation).toHaveBeenCalledWith(tile);
    expect(isAllVerticesInsideBoundingVolume).toHaveBeenCalledWith(
      "Bounding Volume",
      new Float32Array([1, 2, 3])
    );
    expect(result).toBeTruthy();
  });
});
