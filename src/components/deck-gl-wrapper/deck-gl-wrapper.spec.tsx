// Get tileset stub before Mocks. The order is important
import { getTileset3d, getTile3d } from "../../test/tile-stub";
import { getTilesetJson } from "../../test/tileset-header-stub";
import {
  DragMode,
  TilesetType,
  TileColoredBy,
  BoundingVolumeType,
  BoundingVolumeColoredBy,
} from "../../types";

// Mocks
jest.mock("@loaders.gl/core");
jest.mock("@loaders.gl/images");
jest.mock("@loaders.gl/tiles");
jest.mock("@deck.gl/react", () => {
  return jest.fn().mockImplementation(() => {
    return null;
  });
});
jest.mock("@deck.gl/core");
jest.mock("@deck.gl/layers");
jest.mock("@deck.gl/geo-layers");
jest.mock("react-map-gl");
jest.mock("../../utils/debug/build-minimap-data");
jest.mock("../../utils/debug/texture-selector-utils");
jest.mock("../../utils/debug/frustum-utils");
jest.mock("../../utils/terrain-elevation");
jest.mock("../../utils/debug/colors-map");
jest.mock("../../utils/debug/normals-utils");
jest.mock("../../layers/bounding-volume-layer/bounding-volume-layer");

import { act } from "@testing-library/react";
import { DeckGlWrapper } from "./deck-gl-wrapper";
import DeckGL from "@deck.gl/react";
import { MapController } from "@deck.gl/core";
import { TerrainLayer, Tile3DLayer } from "@deck.gl/geo-layers";
import { load } from "@loaders.gl/core";
import { LineLayer, ScatterplotLayer } from "@deck.gl/layers";
import { ImageLoader } from "@loaders.gl/images";
import { Tileset3D } from "@loaders.gl/tiles";
import { BoundingVolumeLayer } from "../../layers";
import { COORDINATE_SYSTEM, I3SLoader } from "@loaders.gl/i3s";
import ColorMap from "../../utils/debug/colors-map";
import {
  selectDebugTextureForTile,
  selectDebugTextureForTileset,
  selectOriginalTextureForTile,
  selectOriginalTextureForTileset,
} from "../../utils/debug/texture-selector-utils";
import { getElevationByCentralTile } from "../../utils/terrain-elevation";
import {
  getNormalSourcePosition,
  getNormalTargetPosition,
} from "../../utils/debug/normals-utils";
import { getFrustumBounds } from "../../utils/debug/frustum-utils";
import { buildMinimapData } from "../../utils/debug/build-minimap-data";
import { CesiumIonLoader, Tiles3DLoader } from "@loaders.gl/3d-tiles";
import { renderWithProvider } from "../../utils/testing-utils/render-with-provider";
import { setupStore } from "../../redux/store";
import { setColorsByAttrubute } from "../../redux/slices/colors-by-attribute-slice";
import { setDragMode } from "../../redux/slices/drag-mode-slice";
import { setDebugOptions } from "../../redux/slices/debug-options-slice";

const simpleCallbackMock = jest.fn().mockImplementation(() => {
  /* Do Nothing */
});
const tilesetUrl =
  "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0";
const cesiumUrl = "https://assets.cesium.com/687891/tileset.json";
const tiles3DUrl = "https://path.to.tileset/tileset.json";
const mapStyle =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";
const imageStubObject = { width: 1024, height: 1024, data: new ArrayBuffer(0) };
(load as unknown as jest.Mock<any>).mockReturnValue(
  Promise.resolve(imageStubObject)
);
const setPropsMock = jest.spyOn(Tileset3D.prototype, "setProps");
const getColorMock = jest
  .spyOn(ColorMap.prototype, "getTileColor")
  .mockImplementation(() => [100, 150, 200]);

const getBoundingVolumeColorMock = jest
  .spyOn(ColorMap.prototype, "getBoundingVolumeColor")
  .mockImplementation(() => [100, 150, 200]);

const controllerExpected = {
  type: MapController,
  maxPitch: 60,
  inertia: true,
  scrollZoom: { speed: 0.01, smooth: true },
  touchRotate: true,
  dragMode: DragMode.pan,
};

const callRender = (renderFunc, props = {}, store = setupStore()) => {
  let renderResult;
  act(() => {
    const result = renderFunc(
      <DeckGlWrapper
        mapStyle={mapStyle}
        layers3d={[
          {
            url: tilesetUrl,
            type: TilesetType.I3S,
          },
        ]}
        disableController={false}
        lastLayerSelectedId={tilesetUrl}
        metadata={{ layers: [getTilesetJson()] }}
        loadedTilesets={[getTileset3d()]}
        selectedTilesetBasePath={tilesetUrl}
        onAfterRender={simpleCallbackMock}
        getTooltip={simpleCallbackMock}
        onClick={simpleCallbackMock}
        onTilesetLoad={simpleCallbackMock}
        onTileLoad={simpleCallbackMock}
        onTileUnload={simpleCallbackMock}
        {...props}
      />,
      store
    );
    renderResult = result;
  });
  return renderResult;
};

describe("Deck.gl I3S map component", () => {
  it("Should render", () => {
    callRender(renderWithProvider, { loadedTilesets: undefined });
    expect(DeckGL).toHaveBeenCalled();
    const {
      children,
      layerFilter,
      layers,
      controller,
      views,
      viewState,
      onViewStateChange,
      getTooltip,
      onAfterRender,
      onClick,
    } = DeckGL.mock.lastCall[0];
    expect(children).toBeTruthy();
    expect(controller).toEqual(controllerExpected);
    expect(layerFilter).toBeTruthy();
    expect(layers).toBeTruthy();
    expect(views).toBeTruthy();
    expect(viewState).toBeTruthy();
    expect(onViewStateChange).toBeTruthy();
    expect(getTooltip).toBe(simpleCallbackMock);
    expect(onAfterRender).toBe(simpleCallbackMock);
    expect(onClick).toBe(simpleCallbackMock);
    expect(TerrainLayer).not.toHaveBeenCalled();
  });

  it("Controller", () => {
    const store = setupStore();
    store.dispatch(setDragMode(DragMode.pan));
    const { rerender } = callRender(
      renderWithProvider,
      { loadedTilesets: undefined },
      store
    );
    expect(DeckGL).toHaveBeenCalled();
    const {
      controller: { dragMode },
    } = DeckGL.mock.lastCall[0];
    expect(dragMode).toBe("pan");

    store.dispatch(setDragMode(DragMode.rotate));
    callRender(rerender, undefined, store);
    const {
      controller: { dragMode: dragMode2 },
    } = DeckGL.mock.lastCall[0];
    expect(dragMode2).toBe("rotate");

    callRender(rerender, { disableController: true });
    const { controller } = DeckGL.mock.lastCall[0];
    expect(controller).toBeFalsy();

    store.dispatch(setDragMode(DragMode.pan));
    callRender(rerender, undefined, store);
    const { controller: controller2 } = DeckGL.mock.lastCall[0];
    expect(controller2).toEqual(controllerExpected);
  });

  it("Should load UV debug texture", () => {
    const { rerender } = callRender(renderWithProvider, {
      loadDebugTextureImage: true,
    });
    expect(load).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/images/uv-debug-texture.jpg",
      ImageLoader
    );
    expect(load).toHaveBeenCalledTimes(1);
    callRender(rerender);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("Should show UV debug texture", () => {
    const store = setupStore();
    store.dispatch(setDebugOptions({ showUVDebugTexture: false }));
    const { rerender } = callRender(renderWithProvider, undefined, store);
    expect(selectDebugTextureForTileset).not.toHaveBeenCalled();
    expect(selectOriginalTextureForTileset).toHaveBeenCalledTimes(1);
    store.dispatch(setDebugOptions({ showUVDebugTexture: true }));
    callRender(rerender, undefined, store);
    expect(selectDebugTextureForTileset).toHaveBeenCalledTimes(1);
    expect(selectOriginalTextureForTileset).toHaveBeenCalledTimes(1);
  });

  describe("onViewStateChange", () => {
    it("Should change view state", () => {
      const { rerender } = callRender(renderWithProvider);
      const { onViewStateChange } = DeckGL.mock.lastCall[0];
      act(() =>
        onViewStateChange({
          interactionState: { isZooming: false },
          viewState: { latitude: 50, longitude: 50, position: [0, 0, 50] },
        })
      );
      callRender(rerender);
      const { viewState } = DeckGL.mock.lastCall[0];
      expect(viewState).toEqual({
        main: { latitude: 50, longitude: 50, position: [0, 0, 45] },
      });
    });

    it("Should change view state for minimap", () => {
      const store = setupStore();
      store.dispatch(setDebugOptions({ minimap: true }));
      const { rerender } = callRender(renderWithProvider, undefined, store);
      const { onViewStateChange } = DeckGL.mock.lastCall[0];
      act(() =>
        onViewStateChange({
          interactionState: { isZooming: false },
          viewState: { latitude: 50, longitude: 50, position: [0, 0, 50] },
          viewId: "minimap",
        })
      );
      store.dispatch(setDebugOptions({ minimap: true }));
      callRender(rerender, undefined, store);
      const { viewState } = DeckGL.mock.lastCall[0];
      expect(viewState).toEqual({
        main: {
          bearing: 0,
          latitude: 50,
          longitude: 50,
          maxPitch: 90,
          maxZoom: 30,
          minZoom: 2,
          pitch: 45,
          position: [0, 0, 45],
          transitionDuration: 0,
          transitionInterpolator: null,
          zoom: 14.5,
        },
        minimap: { latitude: 50, longitude: 50, position: [0, 0, 50] },
      });
    });
  });

  describe("Render Tile3DLayer", () => {
    it("Should render Tile3DLayer", () => {
      callRender(renderWithProvider);
      expect(Tile3DLayer).toHaveBeenCalled();
      const {
        id,
        data,
        loader,
        loadOptions,
        autoHighlight,
        highlightedObjectIndex,
      } = Tile3DLayer.mock.lastCall[0];
      expect(id).toBe(
        "tile-layer-undefined-draco-true-compressed-textures-true--colors-by-attribute-undefined--colors-by-attribute-mode-undefined--0"
      );
      expect(data).toBe(tilesetUrl);
      expect(loader).toBe(I3SLoader);
      expect(loadOptions).toEqual({
        i3s: {
          coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
          useCompressedTextures: true,
          useDracoGeometry: true,
          colorsByAttribute: null,
        },
      });
      expect(autoHighlight).toBe(false);
      expect(highlightedObjectIndex).toBe(undefined);
    });

    it("Should render Tile3DLayer with CesiumIon tileset", () => {
      callRender(renderWithProvider, {
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
      callRender(renderWithProvider, {
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
      callRender(renderWithProvider, { loadNumber: 1 });
      const { id } = Tile3DLayer.mock.lastCall[0];
      expect(id).toBe(
        "tile-layer-undefined-draco-true-compressed-textures-true--colors-by-attribute-undefined--colors-by-attribute-mode-undefined--1"
      );
    });

    it("Should render pickable with auto highlighting", () => {
      const store = setupStore();
      store.dispatch(setDebugOptions({ pickable: true }));
      callRender(renderWithProvider, { autoHighlight: true }, store);
      const { pickable, autoHighlight } = Tile3DLayer.mock.lastCall[0];
      expect(pickable).toBe(true);
      expect(autoHighlight).toBe(true);
    });

    it("Should not highlight tile", () => {
      callRender(renderWithProvider, {
        selectedTilesetBasePath: "http://another.tileset.local",
      });
      const { highlightedObjectIndex } = Tile3DLayer.mock.lastCall[0];
      expect(highlightedObjectIndex).toBe(-1);
    });

    it("Should render wireframe", () => {
      const store = setupStore();
      store.dispatch(setDebugOptions({ wireframe: false }));
      const { rerender } = callRender(renderWithProvider, undefined, store);
      const {
        _subLayerProps: {
          mesh: { wireframe },
        },
      } = Tile3DLayer.mock.lastCall[0];
      expect(wireframe).toBe(false);

      store.dispatch(setDebugOptions({ wireframe: true }));
      callRender(rerender, undefined, store);
      const {
        _subLayerProps: {
          mesh: { wireframe: wireframe2 },
        },
      } = Tile3DLayer.mock.lastCall[0];
      expect(wireframe2).toBe(true);
    });

    it("Should render with token", () => {
      callRender(renderWithProvider, {
        layers3d: [
          {
            url: tilesetUrl,
            token: "<abcdefg123456>",
          },
        ],
      });
      const { loadOptions } = Tile3DLayer.mock.lastCall[0];
      expect(loadOptions).toEqual({
        i3s: {
          coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
          useCompressedTextures: true,
          useDracoGeometry: true,
          colorsByAttribute: null,
          token: "<abcdefg123456>",
        },
      });
    });

    it("Should call Tile3DLayer tileset callbacks", () => {
      const { rerender } = callRender(renderWithProvider);
      expect(Tile3DLayer).toHaveBeenCalled();
      const { onTileLoad, onTilesetLoad, onTileUnload } =
        Tile3DLayer.mock.lastCall[0];
      const tile3d = getTile3d();
      act(() => onTileLoad(tile3d));
      expect(simpleCallbackMock).toHaveBeenCalledTimes(1);

      // TODO: couldn't mock MapView.ViewportType. expect toThrow instead
      // onTilesetLoad(getTileset3d());
      // expect(simpleCallbackMock).toHaveBeenCalledTimes(2);
      expect(() => onTilesetLoad(getTileset3d())).toThrow();

      expect(onTilesetLoad).toBeTruthy();
      act(() => onTileUnload(tile3d));
      expect(simpleCallbackMock).toHaveBeenCalledTimes(2);

      callRender(rerender, { onTileLoad: undefined });
      const { onTileLoad: onTileLoad2 } = Tile3DLayer.mock.lastCall[0];
      act(() => onTileLoad2(tile3d));
      expect(simpleCallbackMock).toHaveBeenCalledTimes(2);

      callRender(rerender, { onTileUnload: undefined });
      const { onTileUnload: onTileUnload2 } = Tile3DLayer.mock.lastCall[0];
      expect(() => act(() => onTileUnload2(tile3d))).not.toThrow();
      expect(simpleCallbackMock).toHaveBeenCalledTimes(2);
    });

    it("Should call Tile3DLayer color callback", () => {
      const store = setupStore();
      store.dispatch(
        setDebugOptions({ tileColorMode: TileColoredBy.original })
      );
      callRender(renderWithProvider, {
        selectedTile: { id: "selected-tile-id" },
        coloredTilesMap: { "selected-tile-id": [33, 55, 66] },
        store,
      });
      expect(Tile3DLayer).toHaveBeenCalled();
      const { _getMeshColor } = Tile3DLayer.mock.lastCall[0];
      _getMeshColor();
      expect(getColorMock).toHaveBeenCalledWith(undefined, {
        coloredBy: "Original",
        selectedTileId: "selected-tile-id",
        coloredTilesMap: { "selected-tile-id": [33, 55, 66] },
      });
    });

    it("Should remove featureIds", () => {
      callRender(renderWithProvider, { featurePicking: false });
      expect(Tile3DLayer).toHaveBeenCalled();
      const { onTileLoad } = Tile3DLayer.mock.lastCall[0];
      const tile3d = getTile3d();
      tile3d.content.featureIds = new Uint32Array([10, 20, 30]);
      act(() => onTileLoad(tile3d));
      expect(tile3d.content.featureIds).toBeFalsy();
    });

    it("Should update debug texture on a tile", () => {
      const store = setupStore();
      store.dispatch(setDebugOptions({ showUVDebugTexture: false }));
      const { rerender } = callRender(renderWithProvider, undefined, store);
      expect(Tile3DLayer).toHaveBeenCalled();
      const { onTileLoad } = Tile3DLayer.mock.lastCall[0];
      const tile3d = getTile3d();
      act(() => onTileLoad(tile3d));
      expect(selectOriginalTextureForTile).toHaveBeenCalledWith(tile3d);
      expect(selectDebugTextureForTile).not.toHaveBeenCalled();

      store.dispatch(setDebugOptions({ showUVDebugTexture: true }));
      callRender(rerender, undefined, store);
      const { onTileLoad: onTileLoadSecond } = Tile3DLayer.mock.lastCall[0];
      act(() => onTileLoadSecond(tile3d));
      expect(selectDebugTextureForTile).toHaveBeenCalledWith(tile3d, null);
      expect(selectOriginalTextureForTile).toHaveBeenCalledTimes(1);
    });

    it("Should not be pickable", () => {
      const store = setupStore();
      store.dispatch(setDebugOptions({ pickable: false }));
      callRender(renderWithProvider, undefined, store);
      expect(Tile3DLayer).toHaveBeenCalled();
      const { pickable } = Tile3DLayer.mock.lastCall[0];
      expect(pickable).toBe(false);
    });

    it("Should colorize by attribute", () => {
      const store = setupStore();
      store.dispatch(
        setColorsByAttrubute({
          attributeName: "HEIGHTROOF",
          minValue: 0,
          maxValue: 1400,
          minColor: [146, 146, 252, 255],
          maxColor: [44, 44, 175, 255],
          mode: "replace",
        })
      );
      callRender(renderWithProvider, undefined, store);
      expect(Tile3DLayer).toHaveBeenCalled();
      const { id, loadOptions } = Tile3DLayer.mock.lastCall[0];
      expect(id).toBe(
        "tile-layer-undefined-draco-true-compressed-textures-true--colors-by-attribute-HEIGHTROOF--colors-by-attribute-mode-replace--0"
      );
      expect(loadOptions.i3s.colorsByAttribute).toEqual({
        attributeName: "HEIGHTROOF",
        maxColor: [44, 44, 175, 255],
        maxValue: 1400,
        minColor: [146, 146, 252, 255],
        minValue: 0,
        mode: "replace",
      });
    });
  });

  describe("Render TerrainLayer", () => {
    it("Should render terrain", () => {
      callRender(renderWithProvider, { showTerrain: true });
      expect(TerrainLayer).toHaveBeenCalled();
    });

    it("Should call onTerrainTileLoad", () => {
      const { rerender } = callRender(renderWithProvider, {
        showTerrain: true,
      });
      const { onTileLoad } = TerrainLayer.mock.lastCall[0];
      const terrainTile = {
        bbox: { east: 10, north: 20, south: 30, west: 40 },
      };
      act(() => onTileLoad(terrainTile));

      callRender(rerender);
      const { onViewStateChange } = DeckGL.mock.lastCall[0];
      act(() =>
        onViewStateChange({
          interactionState: { isZooming: false },
          viewState: { latitude: 50, longitude: 50, position: [0, 0, 50] },
        })
      );
      expect(getElevationByCentralTile).toHaveBeenCalledWith(50, 50, {
        "10;20;30;40": { bbox: { east: 10, north: 20, south: 30, west: 40 } },
      });
    });
  });

  describe("Render BoundingVolumeLayer", () => {
    it("Should render bounding volume", () => {
      const store = setupStore();
      store.dispatch(
        setDebugOptions({
          boundingVolume: true,
          boundingVolumeType: BoundingVolumeType.obb,
        })
      );
      callRender(renderWithProvider, undefined, store);
      expect(BoundingVolumeLayer).toHaveBeenCalled();
    });

    it("Should call getBoundingVolumeColor", () => {
      const store = setupStore();
      store.dispatch(
        setDebugOptions({
          boundingVolume: true,
          boundingVolumeType: BoundingVolumeType.obb,
          boundingVolumeColorMode: BoundingVolumeColoredBy.tile,
        })
      );
      callRender(renderWithProvider, undefined, store);
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

  describe("Render normals", () => {
    it("Should render normals", () => {
      const normalsDebugData = {};
      callRender(renderWithProvider, {
        normalsDebugData: normalsDebugData,
        normalsTrianglesPercentage: 5,
        normalsLength: 25,
      });
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
      const normalsDebugData = {};
      callRender(renderWithProvider, {
        normalsDebugData: normalsDebugData,
        normalsTrianglesPercentage: 5,
        normalsLength: 25,
      });
      const { getSourcePosition, getTargetPosition, getColor } =
        LineLayer.mock.lastCall[0];
      getSourcePosition(undefined, { index: "id", data: "data" });
      expect(getNormalSourcePosition).toHaveBeenCalledWith("id", "data", 5);
      getTargetPosition(undefined, { index: "id", data: "data" });
      expect(getNormalTargetPosition).toHaveBeenCalledWith("id", "data", 5, 25);
      expect(getColor()).toEqual([255, 0, 0]);
    });
  });

  describe("Render minimap", () => {
    it("Should render minimap", () => {
      const store = setupStore();
      store.dispatch(setDebugOptions({ minimap: false }));
      const { rerender } = callRender(renderWithProvider, undefined, store);
      let lastCallArgs = DeckGL.mock.lastCall[0];
      expect(lastCallArgs.views.length).toBe(1);
      expect(Object.keys(lastCallArgs.viewState)).toEqual(["main"]);
      expect(getFrustumBounds).not.toHaveBeenCalled();
      store.dispatch(setDebugOptions({ minimap: true }));
      callRender(rerender, undefined, store);
      lastCallArgs = DeckGL.mock.lastCall[0];
      expect(lastCallArgs.views.length).toBe(2);
      expect(Object.keys(lastCallArgs.viewState)).toEqual(["main", "minimap"]);
      expect(getFrustumBounds).toHaveBeenCalledTimes(2);

      const { id, data, getWidth } = LineLayer.mock.lastCall[0];
      expect(id).toBe("frustum");
      expect(data).toBe(undefined);
      expect(getWidth).toBe(2);
    });

    it("Should call frustum callbacks", () => {
      const store = setupStore();
      store.dispatch(setDebugOptions({ minimap: true }));
      callRender(renderWithProvider, undefined, store);
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
      const store = setupStore();
      store.dispatch(setDebugOptions({ minimapViewport: true }));
      const { rerender } = callRender(renderWithProvider, undefined, store);
      expect(setPropsMock).toHaveBeenCalledWith({
        viewportTraversersMap: { main: "main", minimap: "minimap" },
        loadTiles: true,
      });
      store.dispatch(setDebugOptions({ minimapViewport: false }));
      callRender(rerender, undefined, store);
      expect(setPropsMock).toHaveBeenCalledWith({
        viewportTraversersMap: { main: "main", minimap: "main" },
        loadTiles: true,
      });
      expect(buildMinimapData).toHaveBeenCalledTimes(2);

      store.dispatch(setDebugOptions({ minimapViewport: true }));
      callRender(rerender, { loadedTilesets: [] }, store);
      expect(buildMinimapData).toHaveBeenCalledTimes(3);
    });

    it("Should render main viewport as Scatterplot", () => {
      const store = setupStore();
      store.dispatch(setDebugOptions({ minimapViewport: true }));
      callRender(renderWithProvider, undefined, store);
      expect(ScatterplotLayer).toHaveBeenCalled();
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

  describe("Layer filter", () => {
    it("Should not show frustum and scatterplon on main map", () => {
      callRender(renderWithProvider);
      const { layerFilter } = DeckGL.mock.lastCall[0];
      expect(
        layerFilter({
          layer: { id: "frustum", props: {} },
          viewport: { id: "main" },
        })
      ).toBe(false);
      expect(
        layerFilter({
          layer: { id: "main-on-minimap", props: {} },
          viewport: { id: "main" },
        })
      ).toBe(false);
    });

    it("Should not show bounding volumes on minimap", () => {
      const store = setupStore();
      store.dispatch(setDebugOptions({ minimap: true }));
      callRender(renderWithProvider, undefined, store);
      const { layerFilter } = DeckGL.mock.lastCall[0];
      expect(
        layerFilter({
          layer: { id: "obb-debug-0", props: {} },
          viewport: { id: "minimap" },
        })
      ).toBe(false);
    });

    it("Should not show tile if there is no viewport in viewportIds", () => {
      callRender(renderWithProvider);
      const { layerFilter } = DeckGL.mock.lastCall[0];
      expect(
        layerFilter({
          layer: { id: "layer-id", props: { viewportIds: ["main"] } },
          viewport: { id: "minimap" },
        })
      ).toBe(false);
    });

    it("Should not show normals on minimap", () => {
      callRender(renderWithProvider);
      const { layerFilter } = DeckGL.mock.lastCall[0];
      expect(
        layerFilter({
          layer: { id: "normals-debug", props: {} },
          viewport: { id: "minimap" },
        })
      ).toBe(false);
    });

    it("Should not show terrain on minimap", () => {
      callRender(renderWithProvider);
      const { layerFilter } = DeckGL.mock.lastCall[0];
      expect(
        layerFilter({
          layer: { id: "terrain-0", props: {} },
          viewport: { id: "minimap" },
        })
      ).toBe(false);
    });

    it("Should show a tile on a viewport", () => {
      callRender(renderWithProvider);
      const { layerFilter } = DeckGL.mock.lastCall[0];
      expect(
        layerFilter({
          layer: { id: "layer-id", props: { viewportIds: ["main"] } },
          viewport: { id: "main" },
        })
      ).toBe(true);
    });
  });
});
