import { BoundingVolumeType } from "../../types";
import BoundingVolumeLayer from "./bounding-volume-layer";

jest.mock("@math.gl/core", () => ({
  Vector3: jest.fn().mockImplementation(() => ({
    x: 0,
    y: 0,
    z: 0,
    add: jest.fn(),
    transformByQuaternion: jest.fn(),
  })),
}));

jest.mock("@math.gl/geospatial", () => ({
  Ellipsoid: {
    WGS84: {
      cartographicToCartesian: jest.fn(),
    },
  },
}));

jest.mock("@luma.gl/engine", () => ({
  CubeGeometry: jest.fn().mockImplementation(() => ({
    attributes: {
      POSITION: {
        value: new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]),
      },
    },
  })),
  SphereGeometry: jest.fn().mockImplementation(() => ({
    attributes: {
      POSITION: {
        value: new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]),
      },
    },
  })),
}));

jest.mock("@deck.gl/core", function () {
  return {
    CompositeLayer: jest.fn().mockImplementation(function (props) {
      const {
        id,
        visible,
        tiles,
        getBoundingVolumeColor,
        boundingVolumeType,
        onTileLoadFail,
      } = props;
      // @ts-expect-error this is not typed
      this.props = props;
      // @ts-expect-error this is not typed
      this.if = id;
      // @ts-expect-error this is not typed
      this.visible = visible;
      // @ts-expect-error this is not typed
      this.tiles = tiles;
      // @ts-expect-error this is not typed
      this.getBoundingVolumeColor = getBoundingVolumeColor;
      // @ts-expect-error this is not typed
      this.boundingVolumeType = boundingVolumeType;
      // @ts-expect-error this is not typed
      this.onTileLoadFail = onTileLoadFail;
      // @ts-expect-error this is not typed
      return this;
    }),
    COORDINATE_SYSTEM: {
      METER_OFFSETS: 1,
    },
    log: {
      removed: jest.fn().mockImplementation(() => () => null),
    },
  };
});

jest.mock("@deck.gl/mesh-layers", () => ({
  SimpleMeshLayer: jest.fn().mockImplementation(() => ({
    test: true,
  })),
}));

const getBoundingVolumeColorMock = jest.fn();
const onTileLoadFailMock = jest.fn();

const generateBoundingVolumeLayer = (props = {}) =>
  // @ts-expect-error - Expected arguments issue
  new BoundingVolumeLayer({
    id: "bounding-volume-layer",
    visible: true,
    tiles: [],
    getBoundingVolumeColor: getBoundingVolumeColorMock,
    boundingVolumeType: BoundingVolumeType.obb,
    onTileLoadFail: onTileLoadFailMock,
    ...props,
  });

describe("Bounding Volume Layer", () => {
  const boundingVolumeLayer = generateBoundingVolumeLayer();

  it("Should be able to initialize state", () => {
    boundingVolumeLayer.initializeState();
    expect(boundingVolumeLayer).not.toBeNull();
  });

  it("Should be able to update state", () => {
    boundingVolumeLayer.initializeState();
    boundingVolumeLayer.updateState({
      changeFlags: {
        propsChanged: true,
      },
    });
    expect(boundingVolumeLayer).not.toBeNull();
  });

  it("Should be able to generate cube mesh", () => {
    const boundingVolumeLayer = generateBoundingVolumeLayer();
    const tile = {
      header: {
        obb: {
          center: [-122.4221455608589, 37.77030288270862, 34.55862785037607],
          halfSize: [864.1947631835938, 381.7113342285156, 37.28173828125],
          quaternion: [
            0.6413831114768982, 0.6328917145729065, 0.41309797763824463,
            -0.13200709223747253,
          ],
        },
        mbs: null,
      },
      userData: {
        boundingMeshes: {
          [BoundingVolumeType.mbs]: null,
          [BoundingVolumeType.obb]: null,
        },
      },
    };

    const meshType = "cubeMesh";
    const mesh = boundingVolumeLayer._generateMesh(tile, meshType);

    expect(mesh).toStrictEqual({
      attributes: {
        POSITION: {
          value: new Float32Array([
            0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
          ]),
        },
      },
    });
  });

  it("Should be able to generate sphere mesh", () => {
    const boundingVolumeLayer = generateBoundingVolumeLayer();
    const tile = {
      header: {
        obb: null,
        mbs: [
          -122.4221455608589, 37.77030288270862, 34.55862785037607,
          945.4766445909988,
        ],
      },
      userData: {
        boundingMeshes: {
          [BoundingVolumeType.mbs]: null,
          [BoundingVolumeType.obb]: null,
        },
      },
    };

    const meshType = "sphereMesh";
    const mesh = boundingVolumeLayer._generateMesh(tile, meshType);

    expect(mesh).toStrictEqual({
      attributes: {
        POSITION: {
          value: new Float32Array([
            0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
          ]),
        },
      },
    });
  });

  it("Should return null in render method if layer is not visible", () => {
    const boundingVolumeLayer = generateBoundingVolumeLayer({ visible: false });
    const result = boundingVolumeLayer.renderLayers();

    expect(result).toBeNull();
  });

  it("Should return empty layers array if visible true and no any selected tile", () => {
    const tile = {
      header: {
        obb: {
          center: [-122.4221455608589, 37.77030288270862, 34.55862785037607],
          halfSize: [864.1947631835938, 381.7113342285156, 37.28173828125],
          quaternion: [
            0.6413831114768982, 0.6328917145729065, 0.41309797763824463,
            -0.13200709223747253,
          ],
        },
        mbs: null,
      },
      userData: {
        boundingMeshes: {
          [BoundingVolumeType.mbs]: null,
          [BoundingVolumeType.obb]: null,
        },
      },
      selected: false,
    };

    const boundingVolumeLayer = generateBoundingVolumeLayer({
      visible: true,
      boundingVolumeType: BoundingVolumeType.obb,
      tiles: [tile],
    });
    boundingVolumeLayer.initializeState();
    const result = boundingVolumeLayer.renderLayers();

    expect(result).toStrictEqual([]);
  });

  it("Should create new layer if no any layers", () => {
    const tile = {
      header: {
        obb: {
          center: [-122.4221455608589, 37.77030288270862, 34.55862785037607],
          halfSize: [864.1947631835938, 381.7113342285156, 37.28173828125],
          quaternion: [
            0.6413831114768982, 0.6328917145729065, 0.41309797763824463,
            -0.13200709223747253,
          ],
        },
        mbs: null,
      },
      userData: {
        boundingMeshes: {
          [BoundingVolumeType.mbs]: null,
          [BoundingVolumeType.obb]: null,
        },
      },
      selected: true,
      content: {
        cartographicOrigin: [1, 2, 3],
        cartographicModelMatrix: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        ],
      },
      viewportIds: ["main"],
    };

    const boundingVolumeLayer = generateBoundingVolumeLayer({
      visible: true,
      boundingVolumeType: BoundingVolumeType.obb,
      tiles: [tile],
    });
    boundingVolumeLayer.initializeState();
    const result = boundingVolumeLayer.renderLayers();

    expect(result).toStrictEqual([
      {
        test: true,
      },
    ]);
  });
});
