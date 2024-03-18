import { getTileDataForValidation } from "./tile-validation-data";
import {
  createBoundingVolumeFromTile,
  getBoundingType,
} from "../../bounding-volume";

jest.mock("../../bounding-volume", () => ({
  getBoundingType: jest.fn().mockReturnValue("OBB"),
  createBoundingVolumeFromTile: jest.fn().mockReturnValue("OBB"),
}));

describe("Tile Validation data", () => {
  test("Should throw an error if tile has no positions", () => {
    const tile = {
      content: {
        attributes: {
          positions: {
            value: null,
          },
        },
      },
    };

    try {
      // @ts-expect-error test data doesn't fit to the type expected
      getTileDataForValidation(tile);
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        "Validator - There are no positions in tile"
      );
    }
  });

  test("Should throw an error if tile has no positions", () => {
    const tile = {
      content: {
        attributes: {
          positions: {
            value: new Float32Array([1, 2, 3]),
          },
        },
      },
    };

    // @ts-expect-error test data doesn't fit to the type expected
    const result = getTileDataForValidation(tile);

    expect(getBoundingType).toHaveBeenCalledWith(tile);
    expect(createBoundingVolumeFromTile).toHaveBeenCalledWith(tile);
    expect(result).toStrictEqual({
      positions: new Float32Array([1, 2, 3]),
      boundingType: "OBB",
      boundingVolume: "OBB",
    });
  });
});
