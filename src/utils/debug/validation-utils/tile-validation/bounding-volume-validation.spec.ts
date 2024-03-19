import {
  OrientedBoundingBox,
  BoundingSphere,
  makeOrientedBoundingBoxFromPoints,
  makeBoundingSphereFromPoints,
} from "@math.gl/culling";
import {
  createBoundingVolumeFromTile,
  getBoundingType,
} from "../../bounding-volume";
import {
  getTileObbVertices,
  isAllVerticesInsideBoundingVolume,
} from "../../bounding-volume-vertices";
import { getTileDataForValidation } from "./tile-validation-data";
import { convertPositionsToVectors } from "../../convert-positions-to-vectors";

import {
  checkBoundingVolumes,
  isGeometryBoundingVolumeMoreSuitable,
} from "./bounding-volume-validation";

// @ts-expect-error globel object mock
global.console = { warn: jest.fn(), log: console.log };

jest.mock("@math.gl/culling", () => {
  return {
    ...jest.requireActual("@math.gl/culling"),
    makeOrientedBoundingBoxFromPoints: jest.fn().mockReturnValue({
      halfSize: [1, 2, 3],
    }),
    makeBoundingSphereFromPoints: jest.fn(),
  };
});

jest.mock("../../bounding-volume", () => ({
  getBoundingType: jest.fn(),
  createBoundingVolumeFromTile: jest.fn(),
}));

jest.mock("../../bounding-volume-vertices", () => ({
  getTileObbVertices: jest.fn(),
  isAllVerticesInsideBoundingVolume: jest.fn(),
}));

jest.mock("./tile-validation-data", () => ({
  getTileDataForValidation: jest.fn(),
}));

jest.mock("../../convert-positions-to-vectors", () => ({
  convertPositionsToVectors: jest.fn(),
}));

jest.mock("../../../../constants/bounding-volumes", () => ({
  OBB: "OBB",
  MBS: "MBS",
}));

jest.mock("../../../../constants/map-styles", () => ({
  BOUNDING_VOLUME_WARNING_TYPE: "BOUNDING_VOLUME_WARNING_TYPE",
}));

describe("Bounding Volume Validation - checkBoundingVolumes OBB", () => {
  test("Shouldn't do a validation because of unsupported bounding volume type", () => {
    (getBoundingType as any).mockReturnValue("NOT_SUPPORTED_BOUNDING_VOLUME");
    const tile = {};
    const tileWarnings = [];

    // @ts-expect-error test data doesn't fit the type expected
    checkBoundingVolumes(tile, tileWarnings);
    expect(getBoundingType).toHaveBeenCalled();
    expect(createBoundingVolumeFromTile).toHaveBeenCalledTimes(0);
  });

  test("Should validate OBB but don't add a warning because tile obb inside parent obb", () => {
    (getBoundingType as any).mockReturnValue("OBB");
    (isAllVerticesInsideBoundingVolume as any).mockReturnValue(true);

    const tile = {
      parent: "parent",
    };
    const tileWarnings = [];

    // @ts-expect-error test data doesn't fit the type expected
    checkBoundingVolumes(tile, tileWarnings);
    expect(getBoundingType).toHaveBeenCalled();
    expect(createBoundingVolumeFromTile).toHaveBeenCalledWith("parent");
    expect(getTileObbVertices).toHaveBeenCalled();
    expect(isAllVerticesInsideBoundingVolume).toHaveBeenCalled();
    expect(tileWarnings).toStrictEqual([]);
  });

  test("Should add to tileWarnings  - 'OBB of Tile doesn't fit into Parent tile OBB'", () => {
    (getBoundingType as any).mockReturnValue("OBB");
    (isAllVerticesInsideBoundingVolume as any).mockReturnValue(false);
    const tile = {
      id: "tileId",
      parent: {
        id: "parentId",
      },
    };
    const tileWarnings = [];

    // @ts-expect-error test data doesn't fit the type expected
    checkBoundingVolumes(tile, tileWarnings);
    expect(getBoundingType).toHaveBeenCalled();
    expect(createBoundingVolumeFromTile).toHaveBeenCalledWith(tile.parent);
    expect(getTileObbVertices).toHaveBeenCalled();
    expect(isAllVerticesInsideBoundingVolume).toHaveBeenCalled();
    expect(tileWarnings).toStrictEqual([
      {
        type: "BOUNDING_VOLUME_WARNING_TYPE",
        title:
          "OBB of Tile (tileId) doesn't fit into Parent (parentId) tile OBB",
      },
    ]);
  });

  test("Shouldn't and new warnings if tile MBS and parent MBS are not instances of BoundingSphere", () => {
    (getBoundingType as any).mockReturnValue("MBS");
    (createBoundingVolumeFromTile as any).mockImplementation(() => [1, 2, 3]);
    const tile = {
      id: "tileId",
      parent: {
        id: "parentId",
      },
    };
    const tileWarnings = [];

    // @ts-expect-error test data doesn't fit the type expected
    checkBoundingVolumes(tile, tileWarnings);
    expect(getBoundingType).toHaveBeenCalled();
    expect(createBoundingVolumeFromTile).toHaveBeenCalledTimes(2);
    expect(tileWarnings).toStrictEqual([]);
  });

  test("Shouldn't and new warnings if tile MBS fit into parent MBS", () => {
    (getBoundingType as any).mockReturnValue("MBS");
    (createBoundingVolumeFromTile as any).mockImplementation(
      () => new BoundingSphere([1, 2, 3], 10)
    );

    const tile = {
      id: "tileId",
      parent: {
        id: "parentId",
      },
    };
    const tileWarnings = [];

    // @ts-expect-error test data doesn't fit the type expected
    checkBoundingVolumes(tile, tileWarnings);
    expect(getBoundingType).toHaveBeenCalled();
    expect(createBoundingVolumeFromTile).toHaveBeenCalledTimes(2);
    expect(tileWarnings).toStrictEqual([]);
  });

  test("Should and new warnings if tile MBS doesn't fit into parent MBS", () => {
    (getBoundingType as any).mockReturnValue("MBS");
    (createBoundingVolumeFromTile as any).mockReturnValueOnce(
      new BoundingSphere([1, 2, 3], 100)
    );
    (createBoundingVolumeFromTile as any).mockReturnValueOnce(
      new BoundingSphere([1, 2, 3], 10)
    );

    const tile = {
      id: "tileId",
      parent: {
        id: "parentId",
      },
    };
    const tileWarnings = [];

    // @ts-expect-error test data doesn't fit the type expected
    checkBoundingVolumes(tile, tileWarnings);
    expect(getBoundingType).toHaveBeenCalled();
    expect(createBoundingVolumeFromTile).toHaveBeenCalledTimes(2);
    expect(tileWarnings).toStrictEqual([
      {
        title:
          "MBS of Tile (tileId) doesn't fit into Parent (parentId) tile MBS",
        type: "BOUNDING_VOLUME_WARNING_TYPE",
      },
    ]);
  });
});

describe("Bounding Volume Validation - isGeometryBoundingVolumeMoreSuitable", () => {
  test("Should return true if geometry OBB is more suitable then tile OBB", () => {
    (getTileDataForValidation as any).mockReturnValue({
      positions: {
        value: new Float32Array([1, 1, 1]),
      },
      boundingVolume: new OrientedBoundingBox(
        [1, 2, 3],
        [1, 2, 3, 4, 5, 6, 7, 8, 9]
      ),
    });
    const tile = {};

    // @ts-expect-error test data doesn't fit the type expected
    const result = isGeometryBoundingVolumeMoreSuitable(tile);

    expect(getTileDataForValidation).toBeCalled();
    expect(convertPositionsToVectors).toBeCalled();
    expect(makeOrientedBoundingBoxFromPoints).toHaveBeenCalled();
    expect(createBoundingVolumeFromTile).toHaveBeenCalledTimes(0);
    expect(result).toBeTruthy();
  });

  test("Should return false if geometry OBB is not more sutable then tile OBB", () => {
    (getTileDataForValidation as any).mockReturnValue({
      positions: {
        value: new Float32Array([1, 1, 1]),
      },
      boundingVolume: new OrientedBoundingBox(
        [1, 2, 3],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
      ),
    });
    const tile = {};

    // @ts-expect-error test data doesn't fit the type expected
    const result = isGeometryBoundingVolumeMoreSuitable(tile);

    expect(getTileDataForValidation).toBeCalled();
    expect(convertPositionsToVectors).toBeCalled();
    expect(makeOrientedBoundingBoxFromPoints).toHaveBeenCalled();
    expect(createBoundingVolumeFromTile).toHaveBeenCalledTimes(0);
    expect(result).toBeFalsy();
  });

  test("Should return true if geometry MBS is more sutable then tile MBS", () => {
    (makeBoundingSphereFromPoints as any).mockReturnValue({
      radius: 10,
    });
    (getTileDataForValidation as any).mockReturnValue({
      boundingVolume: new BoundingSphere([1, 1, 1], 100),
    });
    const tile = {};

    // @ts-expect-error test data doesn't fit the type expected
    const result = isGeometryBoundingVolumeMoreSuitable(tile);

    expect(getTileDataForValidation).toBeCalled();
    expect(convertPositionsToVectors).toBeCalled();
    expect(makeBoundingSphereFromPoints).toBeCalled();
    expect(result).toBeTruthy();
  });

  test("Should return false if geometry MBS is not more sutable then tile MBS", () => {
    (makeBoundingSphereFromPoints as any).mockReturnValue({
      radius: 100,
    });
    (getTileDataForValidation as any).mockReturnValue({
      boundingVolume: new BoundingSphere([1, 1, 1], 10),
    });
    const tile = {};

    // @ts-expect-error test data doesn't fit the type expected
    const result = isGeometryBoundingVolumeMoreSuitable(tile);

    expect(getTileDataForValidation).toBeCalled();
    expect(convertPositionsToVectors).toBeCalled();
    expect(makeBoundingSphereFromPoints).toBeCalled();
    expect(result).toBeFalsy();
  });

  test("Should throw an error with unsupported bounding volume type", () => {
    (makeBoundingSphereFromPoints as any).mockReturnValue({
      radius: 100,
    });
    (getTileDataForValidation as any).mockReturnValue({
      boundingVolume: "string",
    });
    const tile = {};

    try {
      // @ts-expect-error test data doesn't fit the type expected
      isGeometryBoundingVolumeMoreSuitable(tile);
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        "Unsupported bounding volume type"
      );
    }
  });
});
