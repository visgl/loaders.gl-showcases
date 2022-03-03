import { getBoundingType } from './get-volume-type';
import { OrientedBoundingBox } from "@math.gl/culling";

jest.mock('@math.gl/culling', () => ({
  OrientedBoundingBox: jest.fn()
}));

jest.mock('../constants/bounding-volumes', () => ({
  OBB: 'Oriented Bounding Box',
  MBS: 'Minimum Bounding Sphere'
}));

describe("Get bounding volume type", () => {
  test("Should return OBB bounding type if tile header has obb", () => {
    const tile = {
      header: {
        obb: 'obb'
      }
    };
    const result = getBoundingType(tile);
    expect(result).toStrictEqual('Oriented Bounding Box');
  });

  test("Should return OBB bounding type if tile boundingVolume instance of OrientedBoundingBox", () => {
    const tile = {
      header: {
        obb: null
      },
      boundingVolume: new OrientedBoundingBox()
    };
    const result = getBoundingType(tile);
    expect(result).toStrictEqual('Oriented Bounding Box');
  });

  test("Should return MBS bounding type", () => {
    const tile = {
      header: {
        obb: null
      },
      boundingVolume: null
    };
    const result = getBoundingType(tile);
    expect(result).toStrictEqual('Minimum Bounding Sphere');
  });
});
