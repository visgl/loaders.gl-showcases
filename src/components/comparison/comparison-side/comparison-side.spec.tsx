import { act } from "@testing-library/react";
import { load } from "@loaders.gl/core";
import { BASE_MAPS } from "../../../constants/map-styles";
import {
  ActiveButton,
  ComparisonMode,
  ComparisonSideMode,
  CompareButtonMode,
  DragMode,
} from "../../../types";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { DeckGlI3s } from "../../deck-gl-i3s/deck-gl-i3s";
import { MainToolsPanel } from "../../main-tools-panel/main-tools-panel";
import { ComparisonParamsPanel } from "../comparison-params-panel/comparison-params-panel";
import { LayersPanel } from "../layers-panel/layers-panel";
import { ComparisonSide } from "./comparison-side";
import { parseTilesetUrlParams } from "../../../utils/url-utils";
import { MemoryUsagePanel } from "../memory-usage-panel/memory-usage-panel";

jest.mock("@loaders.gl/core");
jest.mock("../../deck-gl-i3s/deck-gl-i3s");
jest.mock("../../main-tools-panel/main-tools-panel");
jest.mock("../layers-panel/layers-panel");
jest.mock("../comparison-params-panel/comparison-params-panel");
jest.mock("../memory-usage-panel/memory-usage-panel");
jest.mock("../../../utils/url-utils");
jest.mock("../../../utils/sublayers");

const onViewStateChangeMock = jest.fn();
const pointToTilesetMock = jest.fn();
const onChangeLayersMock = jest.fn();
const onInsertBaseMapMock = jest.fn();
const onSelectBaseMapMock = jest.fn();
const onDeleteBaseMapMock = jest.fn();
const onLayerSelected = jest.fn();
const onTilesetLoaded = jest.fn();
const onLoadingStateChange = jest.fn();
const onShowBookmarksChange = jest.fn();
const loadMock = load as unknown as jest.Mocked<any>;
const DeckGlI3sMock = DeckGlI3s as unknown as jest.Mocked<any>;
const MainToolsPanelMock = MainToolsPanel as unknown as jest.Mocked<any>;
const LayersPanelMock = LayersPanel as unknown as jest.Mocked<any>;
const ComparisonParamsPanelMock =
  ComparisonParamsPanel as unknown as jest.Mocked<any>;
const MemoryUsagePanelMock = MemoryUsagePanel as unknown as jest.Mocked<any>;
const parseTilesetUrlParamsMock =
  parseTilesetUrlParams as unknown as jest.Mocked<any>;

describe("ComparisonSide", () => {
  let viewState;
  let baseMap;

  const callRender = (renderFunc, props = {}) => {
    return renderFunc(
      <ComparisonSide
        activeLayersIds={[]}
        mode={ComparisonMode.acrossLayers}
        side={ComparisonSideMode.left}
        viewState={viewState}
        selectedBaseMap={baseMap}
        baseMaps={BASE_MAPS}
        showLayerOptions
        showComparisonSettings
        dragMode={DragMode.pan}
        loadingTime={1123}
        hasBeenCompared={false}
        showBookmarks={false}
        onShowBookmarksChange={onShowBookmarksChange}
        compareButtonMode={CompareButtonMode.Start}
        onViewStateChange={onViewStateChangeMock}
        pointToTileset={pointToTilesetMock}
        onChangeLayers={onChangeLayersMock}
        onInsertBaseMap={onInsertBaseMapMock}
        onSelectBaseMap={onSelectBaseMapMock}
        onDeleteBaseMap={onDeleteBaseMapMock}
        onLayerSelected={onLayerSelected}
        onLoadingStateChange={onLoadingStateChange}
        onTilesetLoaded={onTilesetLoaded}
        {...props}
      />
    );
  };

  beforeAll(() => {
    DeckGlI3sMock.mockImplementation(() => <div></div>);
    MainToolsPanelMock.mockImplementation(() => <div></div>);
    LayersPanelMock.mockImplementation(() => <div></div>);
    ComparisonParamsPanelMock.mockImplementation(() => <div></div>);
    MemoryUsagePanelMock.mockImplementation(() => <div></div>);
    parseTilesetUrlParamsMock.mockReturnValue({
      tilesetUrl: "https://new.layer.url/layers/0",
      token: null,
    });
  });

  beforeEach(() => {
    viewState = {
      main: {
        longitude: 0,
        latitude: 0,
        pitch: 45,
        maxPitch: 90,
        bearing: 0,
        minZoom: 2,
        maxZoom: 24,
        zoom: 2,
        transitionDuration: 0,
        transitionInterpolator: null,
      },
    };
    baseMap = {
      id: "Dark",
      name: "Dark",
      mapUrl:
        "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
    };
  });

  it("Should render left side", () => {
    const { rerender, container } = callRender(renderWithTheme);
    expect(container).toBeInTheDocument();
    callRender(rerender, { onChangeLayers: undefined });
    expect(container).toBeInTheDocument();
  });

  it("Should render right side", () => {
    const { container } = callRender(renderWithTheme, {
      side: ComparisonSideMode.right,
    });
    expect(container).toBeInTheDocument();
  });

  it("Should change mode", () => {
    const { rerender } = callRender(renderWithTheme);
    expect(LayersPanelMock.mock.calls.length).toBe(2);

    callRender(rerender, {
      mode: ComparisonMode.withinLayer,
      showLayerOptions: false,
    });
    expect(LayersPanelMock.mock.calls.length).toBe(2);

    callRender(rerender, {
      mode: ComparisonMode.acrossLayers,
      showLayerOptions: true,
    });
    expect(LayersPanelMock.mock.calls.length).toBe(4);
  });

  it("Should handle staticLayers", () => {
    callRender(renderWithTheme, {
      staticLayers: [
        {
          id: "static-layer-id",
          name: "static-layer",
          url: "https://static.layer.url",
        },
      ],
      activeLayersIds: ["static-layer-id"],
    });
    expect(loadMock.mock.calls.length).toBe(1);
  });

  it("DeckGlI3s", () => {
    callRender(renderWithTheme);

    const { onPointToLayer } = LayersPanelMock.mock.lastCall[0];
    act(() => onPointToLayer());
    expect(pointToTilesetMock).toHaveBeenCalledTimes(1);
    expect(pointToTilesetMock).toHaveBeenCalledWith(undefined);
    pointToTilesetMock.mockReset();

    const { onTilesetLoad } = DeckGlI3sMock.mock.lastCall[0];
    act(() =>
      onTilesetLoad({ url: "http://tileset.url", setProps: () => undefined })
    );

    const { onPointToLayer: onPointToLayer2 } =
      LayersPanelMock.mock.lastCall[0];
    act(() =>
      onPointToLayer2({
        latitude: 122,
        longitude: 41,
        zoom: 10,
      })
    );
    expect(pointToTilesetMock).toHaveBeenCalledTimes(1);
    expect(pointToTilesetMock).toHaveBeenCalledWith({
      latitude: 122,
      longitude: 41,
      zoom: 10,
    });
  });

  it("Should handle tileset load", () => {
    jest.useFakeTimers();
    callRender(renderWithTheme);

    const { onTilesetLoad } = DeckGlI3sMock.mock.lastCall[0];
    act(() =>
      onTilesetLoad({
        url: "http://tileset.url",
        isLoaded: () => true,
        setProps: () => undefined,
      })
    );

    jest.advanceTimersByTime(500);

    expect(onTilesetLoaded).toHaveBeenCalled();
  });

  it("Should handle tile load", () => {
    jest.useFakeTimers();
    callRender(renderWithTheme);

    const tilesetStub = {
      url: "http://tileset.url",
      isLoaded: () => true,
      setProps: () => undefined,
    };
    const { onTileLoad, onTilesetLoad } = DeckGlI3sMock.mock.lastCall[0];
    act(() => onTilesetLoad(tilesetStub));
    act(() =>
      onTileLoad({
        tileset: tilesetStub,
      })
    );

    jest.advanceTimersByTime(500);

    expect(onTilesetLoaded).toHaveBeenCalled();
  });

  describe("LayersPanel", () => {
    it("Should render", () => {
      callRender(renderWithTheme);
      expect(LayersPanelMock.mock.calls.length).toBe(2);
    });

    it("Should call onLayerInsert", () => {
      callRender(renderWithTheme);
      const mock = LayersPanelMock.mock;
      const { layers, onLayerInsert } = mock.lastCall[0];
      expect(layers.length).toBe(4);
      expect(loadMock.mock.calls.length).toBe(0);
      act(() =>
        onLayerInsert({
          id: "new-layer",
          name: "New Layer",
          url: "https://new.layer.url",
        })
      );
      const { layers: layers2 } = mock.lastCall[0];
      expect(layers2.length).toBe(5);
      expect(loadMock.mock.calls.length).toBe(1);
      const tilesetUrl = loadMock.mock.lastCall[0];
      expect(tilesetUrl).toBe("https://new.layer.url/layers/0");
    });

    it("Should call onLayerSelect", () => {
      callRender(renderWithTheme);
      const { onLayerSelect } = LayersPanelMock.mock.lastCall[0];

      act(() =>
        onLayerSelect({
          id: "test",
          name: "new-york",
          url: "https://new-york.test",
        })
      );
      const layerUrl = parseTilesetUrlParamsMock.mock.lastCall[0];
      expect(layerUrl).toBe("https://new-york.test");
      expect(onChangeLayersMock).toHaveBeenCalledTimes(1);
    });

    it("Should call onLayerDelete", () => {
      callRender(renderWithTheme);
      const { layers, onLayerDelete } = LayersPanelMock.mock.lastCall[0];
      expect(layers.length).toBe(4);

      act(() => onLayerDelete("new-york"));
      const { layers: layers2 } = LayersPanelMock.mock.lastCall[0];
      expect(layers2.length).toBe(3);
    });

    it("Should call onUpdateSublayerVisibilityHandler", () => {
      callRender(renderWithTheme);
      const { onUpdateSublayerVisibility } = LayersPanelMock.mock.lastCall[0];
      act(() => onUpdateSublayerVisibility({ layerType: "3DObject" }));
      act(() => onUpdateSublayerVisibility({ layerType: "Unknown type" }));
      // No checks. Can't change `flattenedSublayers` due to async loading
    });

    it("Should close", () => {
      callRender(renderWithTheme);
      expect(LayersPanelMock.mock.calls.length).toBe(2);
      const { onClose } = LayersPanelMock.mock.lastCall[0];
      act(() => onClose());
      expect(LayersPanelMock.mock.calls.length).toBe(2);
    });
  });

  describe("SettingsPanel", () => {
    beforeEach(() => {
      callRender(renderWithTheme);
      expect(ComparisonParamsPanelMock.mock.calls.length).toBe(0);
      const { onChange } = MainToolsPanelMock.mock.lastCall[0];
      act(() => onChange(ActiveButton.settings));
    });

    it("Should render", () => {
      expect(ComparisonParamsPanelMock.mock.calls.length).toBe(1);
    });

    it("Should call onGeometryChange", () => {
      const { useDracoGeometry } = DeckGlI3sMock.mock.lastCall[0];
      expect(useDracoGeometry).toBeTruthy();

      const { onGeometryChange } = ComparisonParamsPanelMock.mock.lastCall[0];
      act(() => onGeometryChange());

      const { useDracoGeometry: newUseDracoGeometry } =
        DeckGlI3sMock.mock.lastCall[0];
      expect(newUseDracoGeometry).toBeFalsy();
    });

    it("Should call onTexturesChange", () => {
      const { useCompressedTextures } = DeckGlI3sMock.mock.lastCall[0];
      expect(useCompressedTextures).toBeTruthy();

      const { onTexturesChange } = ComparisonParamsPanelMock.mock.lastCall[0];
      act(() => onTexturesChange());

      const { useCompressedTextures: newUseCompressedTextures } =
        DeckGlI3sMock.mock.lastCall[0];
      expect(newUseCompressedTextures).toBeFalsy();
    });

    it("Should close", () => {
      expect(ComparisonParamsPanelMock.mock.calls.length).toBe(1);
      const { onClose } = ComparisonParamsPanelMock.mock.lastCall[0];
      act(() => onClose());
      expect(ComparisonParamsPanelMock.mock.calls.length).toBe(1);
    });
  });

  describe("MemoryUsagePanel", () => {
    beforeEach(() => {
      callRender(renderWithTheme);
      expect(MemoryUsagePanelMock.mock.calls.length).toBe(0);
      const { onChange } = MainToolsPanelMock.mock.lastCall[0];
      act(() => onChange(ActiveButton.memory));
    });

    it("Should render", () => {
      expect(MemoryUsagePanelMock.mock.calls.length).toBe(1);
    });

    it("Should disappear in comparing mode", () => {
      callRender(renderWithTheme, {
        compareButtonMode: CompareButtonMode.Comparing,
      });
      expect(MemoryUsagePanelMock.mock.calls.length).toBe(1);
    });

    it("Should close", () => {
      expect(MemoryUsagePanelMock.mock.calls.length).toBe(1);
      const { onClose } = MemoryUsagePanelMock.mock.lastCall[0];
      act(() => onClose());
      expect(MemoryUsagePanelMock.mock.calls.length).toBe(1);
    });
  });
});
