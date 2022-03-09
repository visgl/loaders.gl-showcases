import { getTileDataForValidation } from './tile-validation-data';
import { createBoundingVolumeFromTile, getBoundingType } from "../../bounding-volume";

jest.mock('../../bounding-volume', () => ({
  getBoundingType: jest.fn().mockReturnValue('OBB'),
  createBoundingVolumeFromTile: jest.fn().mockReturnValue('OBB')
}));

describe("Tile Validation data", () => {
  test("Should throw an error if tile has no positions", () => {
    const tile = {
      content: {
        attributes: {
          positions: {
            value: null
          }
        }
      }
    };

    try {
      getTileDataForValidation(tile);
    } catch (error) {
      expect(error.message).toStrictEqual("Validator - There are no positions in tile");
    }
  });

  test("Should throw an error if tile has no positions", () => {
    const tile = {
      content: {
        attributes: {
          positions: {
            value: new Float32Array([1, 2, 3])
          }
        }
      }
    };

    const result = getTileDataForValidation(tile);

    expect(getBoundingType).toHaveBeenCalledWith(tile);
    expect(createBoundingVolumeFromTile).toHaveBeenCalledWith(tile);
    expect(result).toStrictEqual({
      positions: new Float32Array([1, 2, 3]),
      boundingType: 'OBB',
      boundingVolume: 'OBB'
    });
  });

});
