import { getTileObbVertices, isAllVerticesInsideBoundingVolume } from "./bounding-volume-vertices";

import { CubeGeometry } from "@luma.gl/engine";
import { Ellipsoid } from "@math.gl/geospatial";


jest.mock('@luma.gl/engine', () => ({
  CubeGeometry: jest.fn()
}))

jest.mock('@math.gl/geospatial', () => ({
  Ellipsoid: {
    WGS84: {
      cartographicToCartesian: jest.fn(),
      cartesianToCartographic: jest.fn()
    }
  }
}));

jest.mock('@math.gl/core', () => ({
  Vector3: jest.fn().mockReturnValue({
    transformByQuaternion: jest.fn().mockReturnValue({
      add: jest.fn().mockReturnValue([1, 2, 3]),
    })
  })
}));

jest.mock('@math.gl/culling', () => ({
  BoundingSphere: jest.fn(),
  OrientedBoundingBox: jest.fn()
}));

describe("Bounding Volume Vertices - getTileObbVertices", () => {
  test("Should return empty list of vertices if no positions in bounding volume", () => {
    CubeGeometry.mockReturnValue({
      getAttributes: jest.fn().mockReturnValue({
        POSITION: {
          value: []
        }
      })
    });

    const tile = {
      header: {
        obb: {
          center: [1, 2, 3]
        }
      }
    }
    const result = getTileObbVertices(tile)
    expect(CubeGeometry).toHaveBeenCalled();
    expect(Ellipsoid.WGS84.cartographicToCartesian).toBeCalled();
    expect(result).toStrictEqual(new Float32Array([]));
  });

  test("Should return list of vertices", () => {
    CubeGeometry.mockReturnValue({
      getAttributes: jest.fn().mockReturnValue({
        POSITION: {
          value: new Float32Array([1, 2, 3, 4, 5, 6])
        }
      })
    });

    const tile = {
      header: {
        obb: {
          center: [1, 2, 3],
          halfSize: [1, 2, 3, 5, 6, 7, 8, 9]
        }
      }
    }
    const result = getTileObbVertices(tile)
    expect(CubeGeometry).toHaveBeenCalled();
    expect(Ellipsoid.WGS84.cartographicToCartesian).toBeCalled();
    expect(result).toStrictEqual(new Float32Array([1, 2, 3, 1, 2, 3]));
  });
});

describe("Bounding Volume Vertices - isAllVerticesInsideBoundingVolume", () => {
  test("Should return true if no positions", () => {
    const positions = [];
    const boundingVolume = {
      distanceTo: jest.fn().mockReturnValue(100)
    };

    const result = isAllVerticesInsideBoundingVolume(boundingVolume, positions);
    expect(result).toBeTruthy()
  });

  test("Should return true if no distance < 0", () => {
    const positions = new Float32Array([1, 2, 3]);
    const boundingVolume = {
      distanceTo: jest.fn().mockReturnValue(-10)
    };

    const result = isAllVerticesInsideBoundingVolume(boundingVolume, positions);
    expect(result).toBeTruthy()
  });

  test("Should return false if no distance > 0", () => {
    const positions = new Float32Array([1, 2, 3]);
    const boundingVolume = {
      distanceTo: jest.fn().mockReturnValue(10)
    };

    const result = isAllVerticesInsideBoundingVolume(boundingVolume, positions);
    expect(result).toBeFalsy()
  });

});
