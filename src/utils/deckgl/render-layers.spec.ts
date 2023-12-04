// Get tileset stub before Mocks. The order is important
import { getTileset3d } from "../../test/tile-stub";
import {
  renderFrustum,
  renderMainOnMinimap,
  renderNormals,
  renderBoundingVolumeLayer,
  renderLayers,
} from "./render-layers";

jest.mock("@deck.gl/layers", () => {
  return {
    LineLayer: jest.fn(),
    ScatterplotLayer: jest.fn(),
  };
});
jest.mock("@deck.gl/geo-layers", () => {
  return {
    Tile3DLayer: jest.fn(),
    TerrainLayer: jest.fn(),
  };
});
jest.mock("@deck.gl/core");
jest.mock("@deck.gl/core/typed");
jest.mock("@loaders.gl/i3s");
jest.mock("@loaders.gl/3d-tiles");
jest.mock("../debug/frustum-utils");
jest.mock("../debug/build-minimap-data");
jest.mock("../debug/normals-utils");
jest.mock("../../layers");

import { COORDINATE_SYSTEM, WebMercatorViewport } from "@deck.gl/core/typed";
import { LineLayer, ScatterplotLayer } from "@deck.gl/layers";
import { I3SLoader } from "@loaders.gl/i3s";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import { CesiumIonLoader, Tiles3DLoader } from "@loaders.gl/3d-tiles";
import { getFrustumBounds } from "../debug/frustum-utils";
import ColorMap from "../../utils/debug/colors-map";
import { buildMinimapData } from "../debug/build-minimap-data";
import {
  getNormalSourcePosition,
  getNormalTargetPosition,
} from "../debug/normals-utils";
import { BoundingVolumeLayer, CustomTile3DLayer } from "../../layers";
import {
  BoundingVolumeColoredBy,
  BoundingVolumeType,
  TileColoredBy,
  TilesetType,
} from "../../types";

const tilesetUrl =
  "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0";
const cesiumUrl = "https://assets.cesium.com/687891/tileset.json";
const tiles3DUrl = "https://path.to.tileset/tileset.json";
const getBoundingVolumeColorMock = jest
  .spyOn(ColorMap.prototype, "getBoundingVolumeColor")
  .mockImplementation(() => [100, 150, 200]);

const callRenderLayers = (props = {}) => {
  const result = renderLayers({
    useDracoGeometry: true,
    useCompressedTextures: true,
    showTerrain: false,
    loadNumber: 0,
    colorsByAttribute: null,
    pickable: true,
    autoHighlight: true,
    wireframe: true,
    tileColorMode: TileColoredBy.original,
    showMinimap: false,
    viewState: "main",
    boundingVolume: false,
    boundingVolumeType: BoundingVolumeType.mbs,
    normalsTrianglesPercentage: 5,
    normalsLength: 25,
    createIndependentMinimapViewport: false,
    boundingVolumeColorMode: BoundingVolumeColoredBy.original,
    ...props,
  });
  return result;
};

describe("Render minimap", () => {
  it("Should render minimap", () => {
    const result1 = renderFrustum(
      false,
      { main: {}, minimap: {} },
      { main: {}, minimap: {} }
    );
    expect(result1).toEqual(false);
    expect(getFrustumBounds).not.toHaveBeenCalled();
    expect(WebMercatorViewport).not.toHaveBeenCalled();
    const result2 = renderFrustum(
      true,
      { main: {}, minimap: {} },
      { main: {}, minimap: {} }
    );
    expect(getFrustumBounds).toHaveBeenCalledTimes(1);
    expect(WebMercatorViewport).toHaveBeenCalledTimes(1);
    expect(result2).not.toEqual(false);
    const { id, data, getWidth } = LineLayer.mock.lastCall[0];
    expect(id).toBe("frustum");
    expect(data).toBe(undefined);
    expect(getWidth).toBe(2);
  });

  it("Should call frustum callbacks", () => {
    const result = renderFrustum(
      true,
      { main: {}, minimap: {} },
      { main: {}, minimap: {} }
    );
    expect(getFrustumBounds).toHaveBeenCalledTimes(1);
    expect(WebMercatorViewport).toHaveBeenCalledTimes(1);
    expect(result).not.toEqual(false);
    const { getSourcePosition, getTargetPosition, getColor } =
      LineLayer.mock.lastCall[0];
    const line = {
      source: [1, 2, 3],
      target: [11, 12, 13],
      color: [55, 155, 255],
    };
    expect(getSourcePosition(line)).toEqual([1, 2, 3]);
    expect(getTargetPosition(line)).toEqual([11, 12, 13]);
    expect(getColor(line)).toEqual([55, 155, 255]);
  });
});

describe("Render main viewport tiles on minimap", () => {
  it("Should render independent viewport for the minimap", async () => {
    const result1 = renderMainOnMinimap(false, [getTileset3d()]);
    expect(buildMinimapData).not.toHaveBeenCalled();
    expect(ScatterplotLayer).not.toHaveBeenCalled();
    expect(result1).toEqual(null);

    const result2 = renderMainOnMinimap(true, []);
    expect(buildMinimapData).not.toHaveBeenCalled();
    expect(ScatterplotLayer).toHaveBeenCalled();
    expect(result2).not.toEqual(null);

    const result3 = renderMainOnMinimap(true, [getTileset3d()]);
    expect(buildMinimapData).toHaveBeenCalled();
    expect(ScatterplotLayer).toHaveBeenCalled();
    expect(result3).not.toEqual(null);
  });

  it("Should render main viewport as Scatterplot", () => {
    const result = renderMainOnMinimap(true, [getTileset3d()]);
    expect(buildMinimapData).toHaveBeenCalled();
    expect(ScatterplotLayer).toHaveBeenCalled();
    expect(result).not.toEqual(null);
    const {
      id,
      data,
      opacity,
      stroked,
      filled,
      radiusScale,
      radiusMinPixels,
      radiusMaxPixels,
      lineWidthMinPixels,
      getPosition,
      getRadius,
      getFillColor,
      getLineColor,
    } = ScatterplotLayer.mock.lastCall[0];
    const circle = { coordinates: [44, 55, 66], radius: 15 };
    expect(id).toBe("main-on-minimap");
    expect(data).toBe(undefined);
    expect(opacity).toBe(0.8);
    expect(stroked).toBe(true);
    expect(filled).toBe(true);
    expect(radiusScale).toBe(1);
    expect(radiusMinPixels).toBe(1);
    expect(radiusMaxPixels).toBe(100);
    expect(lineWidthMinPixels).toBe(1);
    expect(getPosition(circle)).toEqual([44, 55, 66]);
    expect(getRadius(circle)).toBe(15);
    expect(getFillColor()).toEqual([255, 140, 0, 100]);
    expect(getLineColor()).toEqual([0, 0, 0, 120]);
  });
});

describe("Render normals", () => {
  it("Should render normals", () => {
    renderNormals(5, 25, null);
    expect(LineLayer).not.toBeCalled();

    const normalsDebugData = {
      src: {
        normals: 1,
        positions: [2, 3],
      },
      length: 4,
    };
    renderNormals(5, 25, normalsDebugData);
    expect(LineLayer).toBeCalled();
    const {
      id,
      data,
      modelMatrix,
      coordinateOrigin,
      coordinateSystem,
      getWidth,
    } = LineLayer.mock.lastCall[0];
    expect(id).toBe("normals-debug");
    expect(data).toEqual(normalsDebugData);
    expect(modelMatrix).toBe(undefined);
    expect(coordinateOrigin).toBe(undefined);
    expect(coordinateSystem).toBe(COORDINATE_SYSTEM.METER_OFFSETS);
    expect(getWidth).toBe(1);
  });

  it("Should call callbacks", () => {
    const normalsDebugData = {
      src: {
        normals: 1,
        positions: [2, 3],
      },
      length: 4,
    };
    renderNormals(5, 25, normalsDebugData);
    expect(LineLayer).toBeCalled();

    const { getSourcePosition, getTargetPosition, getColor } =
      LineLayer.mock.lastCall[0];
    getSourcePosition(undefined, { index: "id", data: "data" });
    expect(getNormalSourcePosition).toHaveBeenCalledWith("id", "data", 5);
    getTargetPosition(undefined, { index: "id", data: "data" });
    expect(getNormalTargetPosition).toHaveBeenCalledWith("id", "data", 5, 25);
    expect(getColor()).toEqual([255, 0, 0]);
  });
});

describe("Render BoundingVolumeLayer", () => {
  it("Should render bounding volume", () => {
    const result1 = renderBoundingVolumeLayer(
      false,
      BoundingVolumeType.obb,
      BoundingVolumeColoredBy.original,
      []
    );
    expect(BoundingVolumeLayer).not.toHaveBeenCalled();
    expect(result1).toEqual(null);

    const result2 = renderBoundingVolumeLayer(
      true,
      BoundingVolumeType.obb,
      BoundingVolumeColoredBy.original,
      []
    );
    expect(BoundingVolumeLayer).toHaveBeenCalled();
    expect(result2).not.toEqual(null);
  });

  it("Should call getBoundingVolumeColor", () => {
    const result = renderBoundingVolumeLayer(
      true,
      BoundingVolumeType.obb,
      BoundingVolumeColoredBy.tile,
      []
    );
    expect(BoundingVolumeLayer).toHaveBeenCalled();
    expect(result).not.toEqual(null);
    const { getBoundingVolumeColor } = (
      BoundingVolumeLayer as unknown as jest.Mock<BoundingVolumeLayer>
    ).mock.calls[0][0];
    getBoundingVolumeColor({ id: "custom-tile" });
    expect(getBoundingVolumeColorMock).toHaveBeenCalledWith(
      {
        id: "custom-tile",
      },
      { coloredBy: "By tile" }
    );
  });
});

describe("Render Tile3DLayer", () => {
  it("Should render Tile3DLayer", () => {
    callRenderLayers({
      layers3d: [
        {
          url: tilesetUrl,
          type: TilesetType.I3S,
        },
      ],
    });
    expect(CustomTile3DLayer).toHaveBeenCalled();
    const {
      id,
      data,
      loader,
      loadOptions,
      autoHighlight,
      highlightedObjectIndex,
    } = CustomTile3DLayer.mock.lastCall[0];
    expect(id).toBe(
      "tile-layer-undefined-draco-true-compressed-textures-true--0"
    );
    expect(data).toBe(tilesetUrl);
    expect(loader).toBe(I3SLoader);
    expect(loadOptions).toEqual({
      i3s: {
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
        useCompressedTextures: true,
        useDracoGeometry: true,
      },
    });
    expect(autoHighlight).toBe(true);
    expect(highlightedObjectIndex).toBe(undefined);
  });

  it("Should render Tile3DLayer with CesiumIon tileset", () => {
    callRenderLayers({
      layers3d: [
        {
          url: cesiumUrl,
          type: TilesetType.CesiumIon,
          token: "<asdfasdffffd>",
        },
      ],
    });
    expect(Tile3DLayer).toHaveBeenCalled();
    const { id, data, loader, loadOptions } = Tile3DLayer.mock.lastCall[0];
    expect(id).toBe("tile-layer-undefined--0");
    expect(data).toBe(cesiumUrl);
    expect(loader).toBe(CesiumIonLoader);
    expect(loadOptions).toEqual({
      "cesium-ion": { accessToken: "<asdfasdffffd>" },
    });
  });

  it("Should render Tile3DLayer with 3DTiles tileset", () => {
    callRenderLayers({
      layers3d: [
        {
          url: tiles3DUrl,
          type: TilesetType.Tiles3D,
        },
      ],
    });
    expect(Tile3DLayer).toHaveBeenCalled();
    const { id, data, loader, loadOptions } = Tile3DLayer.mock.lastCall[0];
    expect(id).toBe("tile-layer-undefined--0");
    expect(data).toBe(tiles3DUrl);
    expect(loader).toBe(Tiles3DLoader);
    expect(loadOptions).toEqual({});
  });

  it("Should update layer", () => {
    callRenderLayers({
      layers3d: [
        {
          url: tilesetUrl,
          type: TilesetType.I3S,
        },
      ],
      loadNumber: 1,
    });
    const { id } = CustomTile3DLayer.mock.lastCall[0];
    expect(id).toBe(
      "tile-layer-undefined-draco-true-compressed-textures-true--1"
    );
  });

  it("Should render pickable with auto highlighting", () => {
    callRenderLayers({
      layers3d: [
        {
          url: tilesetUrl,
          type: TilesetType.I3S,
        },
      ],
    });
    const { pickable, autoHighlight } = CustomTile3DLayer.mock.lastCall[0];
    expect(pickable).toBe(true);
    expect(autoHighlight).toBe(true);
  });

  it("Should not highlight tile", () => {
    callRenderLayers({
      layers3d: [
        {
          url: tilesetUrl,
          type: TilesetType.I3S,
        },
      ],
      autoHighlight: false,
      selectedTilesetBasePath: "http://another.tileset.local",
    });
    const { highlightedObjectIndex } = CustomTile3DLayer.mock.lastCall[0];
    expect(highlightedObjectIndex).toBe(-1);
  });

  it("Should render wireframe", () => {
    callRenderLayers({
      layers3d: [
        {
          url: tilesetUrl,
          type: TilesetType.I3S,
        },
      ],
      autoHighlight: false,
      wireframe: false,
    });
    const {
      _subLayerProps: {
        mesh: { wireframe },
      },
    } = CustomTile3DLayer.mock.lastCall[0];
    expect(wireframe).toBe(false);

    callRenderLayers({
      layers3d: [
        {
          url: tilesetUrl,
          type: TilesetType.I3S,
        },
      ],
      autoHighlight: false,
      wireframe: true,
    });
    const {
      _subLayerProps: {
        mesh: { wireframe: wireframe2 },
      },
    } = CustomTile3DLayer.mock.lastCall[0];
    expect(wireframe2).toBe(true);
  });

  it("Should render with token", () => {
    callRenderLayers({
      layers3d: [
        {
          url: tilesetUrl,
          token: "<abcdefg123456>",
        },
      ],
    });
    const { loadOptions } = CustomTile3DLayer.mock.lastCall[0];
    expect(loadOptions).toEqual({
      i3s: {
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
        useCompressedTextures: true,
        useDracoGeometry: true,
        token: "<abcdefg123456>",
      },
    });
  });

  it("Should not be pickable", () => {
    callRenderLayers({
      layers3d: [
        {
          url: tilesetUrl,
          type: TilesetType.I3S,
        },
      ],
      pickable: false,
    });
    expect(CustomTile3DLayer).toHaveBeenCalled();
    const { pickable } = CustomTile3DLayer.mock.lastCall[0];
    expect(pickable).toBe(false);
  });

  it("Should colorize by attribute", () => {
    callRenderLayers({
      layers3d: [
        {
          url: tilesetUrl,
          type: TilesetType.I3S,
        },
      ],
      colorsByAttribute: {
        attributeName: "HEIGHTROOF",
        minValue: 0,
        maxValue: 1400,
        minColor: [146, 146, 252, 255],
        maxColor: [44, 44, 175, 255],
        mode: "replace",
      },
    });
    expect(CustomTile3DLayer).toHaveBeenCalled();
    const { id, colorsByAttribute } = CustomTile3DLayer.mock.lastCall[0];
    expect(id).toBe(
      "tile-layer-undefined-draco-true-compressed-textures-true--0"
    );
    expect(colorsByAttribute).toEqual({
      attributeName: "HEIGHTROOF",
      maxColor: [44, 44, 175, 255],
      maxValue: 1400,
      minColor: [146, 146, 252, 255],
      minValue: 0,
      mode: "replace",
    });
  });
});
