import { createBoundingVolumeFromTile } from "./bounding-volume";

jest.mock("@math.gl/culling", () => ({
  OrientedBoundingBox: jest.fn().mockImplementation(() => ({
    fromCenterHalfSizeQuaternion: jest
      .fn()
      .mockImplementation(() => ({ result: "OBB is created" })),
  })),
  BoundingSphere: jest
    .fn()
    .mockImplementation(() => ({ result: "MBS is created" })),
}));

jest.mock("../../constants/bounding-volumes", () => ({
  OBB: "Oriented Bounding Box",
  MBS: "Minimum Bounding Sphere",
}));

describe("Bounding Volume From Tile", () => {
  test("Should throw an error for not supported bounding volume type", () => {
    const tile = {
      header: {},
    };
    try {
      // @ts-expect-error test data doesn't to the expected type
      createBoundingVolumeFromTile(tile);
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        "Validator - Not supported Bounding Volume Type"
      );
    }
  });

  test("Should create bounding box from tile obb", () => {
    const tile = {
      header: {
        obb: {
          center: [1, 2, 3],
          halfSize: [4, 5, 6],
          quaternion: [7, 8, 9],
        },
      },
    };
    // @ts-expect-error test data doesn't to the expected type
    const result = createBoundingVolumeFromTile(tile);
    expect(result).toStrictEqual({ result: "OBB is created" });
  });

  test("Should create minimum bounding sphere from tile mbs", () => {
    const tile = {
      header: {
        mbs: [1, 2, 3, 4],
      },
    };
    // @ts-expect-error test data doesn't to the expected type
    const result = createBoundingVolumeFromTile(tile);
    expect(result).toStrictEqual({ result: "MBS is created" });
  });
});
