// Get tileset stub before Mocks. The order is important
import { getTileset3d, getTile3d } from "../../test/tile-stub";
import { getTilesetJson } from "../../test/tileset-header-stub";
import { DragMode, TilesetType, TileColoredBy } from "../../types";

// Mocks
jest.mock("@loaders.gl/core");
jest.mock("@loaders.gl/i3s", () => {
  return {
    COORDINATE_SYSTEM: {
      METER_OFFSETS: 2,
      LNGLAT_OFFSETS: 3,
    },
  };
});
jest.mock("@loaders.gl/3d-tiles", () => {
  return jest.fn().mockImplementation(() => {
    return null;
  });
});
jest.mock("@loaders.gl/images");
jest.mock("@loaders.gl/tiles");
jest.mock("@deck.gl/react", () => {
  return jest.fn().mockImplementation(() => {
    return null;
  });
});
jest.mock("react-map-gl/maplibre", () => {
  return {
    Map: jest.fn().mockImplementation(() => <div></div>),
  };
});
jest.mock("@deck.gl/core");
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
import { TerrainLayer } from "@deck.gl/geo-layers";
import { load } from "@loaders.gl/core";
import { ImageLoader } from "@loaders.gl/images";
import { CustomTile3DLayer } from "../../layers";
import ColorMap from "../../utils/debug/colors-map";
import {
  selectDebugTextureForTile,
  selectDebugTextureForTileset,
  selectOriginalTextureForTile,
  selectOriginalTextureForTileset,
} from "../../utils/debug/texture-selector-utils";
import { getElevationByCentralTile } from "../../utils/terrain-elevation";
import { renderWithProvider } from "../../utils/testing-utils/render-with-provider";
import { setupStore } from "../../redux/store";
import { setDragMode } from "../../redux/slices/drag-mode-slice";
import { setDebugOptions } from "../../redux/slices/debug-options-slice";
import { addBaseMap } from "../../redux/slices/base-maps-slice";

const simpleCallbackMock = jest.fn().mockImplementation(() => {
  /* Do Nothing */
});
const tilesetUrl =
  "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0";
const imageStubObject = { width: 1024, height: 1024, data: new ArrayBuffer(0) };
(load as unknown as jest.Mock<any>).mockReturnValue(
  Promise.resolve(imageStubObject)
);
const getColorMock = jest
  .spyOn(ColorMap.prototype, "getTileColor")
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
        pickable={false}
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
    it("Should call Tile3DLayer tileset callbacks", () => {
      const { rerender } = callRender(renderWithProvider);
      expect(CustomTile3DLayer).toHaveBeenCalled();
      const { onTileLoad, onTilesetLoad, onTileUnload } = (
        CustomTile3DLayer as any
      ).mock.lastCall[0];
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
      const { onTileLoad: onTileLoad2 } = (CustomTile3DLayer as any).mock
        .lastCall[0];
      act(() => onTileLoad2(tile3d));
      expect(simpleCallbackMock).toHaveBeenCalledTimes(2);

      callRender(rerender, { onTileUnload: undefined });
      const { onTileUnload: onTileUnload2 } = (CustomTile3DLayer as any).mock
        .lastCall[0];
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
      expect(CustomTile3DLayer).toHaveBeenCalled();
      const { _getMeshColor } = (CustomTile3DLayer as any).mock.lastCall[0];
      _getMeshColor();
      expect(getColorMock).toHaveBeenCalledWith(undefined, {
        coloredBy: "Original",
        selectedTileId: "selected-tile-id",
        coloredTilesMap: { "selected-tile-id": [33, 55, 66] },
      });
    });

    it("Should remove featureIds", () => {
      callRender(renderWithProvider, { featurePicking: false });
      expect(CustomTile3DLayer).toHaveBeenCalled();
      const { onTileLoad } = (CustomTile3DLayer as any).mock.lastCall[0];
      const tile3d = getTile3d();
      tile3d.content.featureIds = new Uint32Array([10, 20, 30]);
      act(() => onTileLoad(tile3d));
      expect(tile3d.content.featureIds).toBeFalsy();
    });

    it("Should update debug texture on a tile", () => {
      const store = setupStore();
      store.dispatch(setDebugOptions({ showUVDebugTexture: false }));
      const { rerender } = callRender(renderWithProvider, undefined, store);
      expect(CustomTile3DLayer).toHaveBeenCalled();
      const { onTileLoad } = (CustomTile3DLayer as any).mock.lastCall[0];
      const tile3d = getTile3d();
      act(() => onTileLoad(tile3d));
      expect(selectOriginalTextureForTile).toHaveBeenCalledWith(tile3d);
      expect(selectDebugTextureForTile).not.toHaveBeenCalled();

      store.dispatch(setDebugOptions({ showUVDebugTexture: true }));
      callRender(rerender, undefined, store);
      const { onTileLoad: onTileLoadSecond } = (CustomTile3DLayer as any).mock
        .lastCall[0];
      act(() => onTileLoadSecond(tile3d));
      expect(selectDebugTextureForTile).toHaveBeenCalledWith(tile3d, null);
      expect(selectOriginalTextureForTile).toHaveBeenCalledTimes(1);
    });
  });

  describe("Render TerrainLayer", () => {
    const store = setupStore();
    store.dispatch(addBaseMap({ id: "Terrain", mapUrl: "", name: "Terrain" }));
    it("Should render terrain", () => {
      callRender(renderWithProvider, undefined, store);
      expect(TerrainLayer).toHaveBeenCalled();
    });

    it("Should call onTerrainTileLoad", () => {
      const store = setupStore();
      store.dispatch(
        addBaseMap({ id: "Terrain", mapUrl: "", name: "Terrain" })
      );
      const { rerender } = callRender(renderWithProvider, undefined, store);
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
});
