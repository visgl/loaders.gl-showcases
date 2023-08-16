import { act, screen } from "@testing-library/react";
import { load } from "@loaders.gl/core";
import {
  ActiveButton,
  ComparisonMode,
  ComparisonSideMode,
  CompareButtonMode,
  DragMode,
} from "../../../types";
import { renderWithThemeProviders } from "../../../utils/testing-utils/render-with-theme";
import { DeckGlWrapper } from "../../deck-gl-wrapper/deck-gl-wrapper";
import { MainToolsPanel } from "../../main-tools-panel/main-tools-panel";
import { ComparisonParamsPanel } from "../comparison-params-panel/comparison-params-panel";
import { LayersPanel } from "../../layers-panel/layers-panel";
import { ComparisonSide } from "./comparison-side";
import { parseTilesetUrlParams } from "../../../utils/url-utils";
import { MemoryUsagePanel } from "../../memory-usage-panel/memory-usage-panel";
import { setupStore } from "../../../redux/store";
import { setDragMode } from "../../../redux/slices/drag-mode-slice";

jest.mock("@loaders.gl/core");
jest.mock("../../deck-gl-wrapper/deck-gl-wrapper");
jest.mock("../../main-tools-panel/main-tools-panel");
jest.mock("../../layers-panel/layers-panel");
jest.mock("../comparison-params-panel/comparison-params-panel");
jest.mock("../../memory-usage-panel/memory-usage-panel");
jest.mock("../../../utils/url-utils");
jest.mock("../../../utils/sublayers");
jest.mock("../../../constants/i3s-examples", () => ({
  EXAMPLES: [
    {
      id: "tileset-1",
      name: "tileset-1",
      url: "http://tileset-1.url",
    },
    {
      id: "tileset-2",
      name: "tileset-2",
      url: "http://tileset-2.url",
    },
    {
      id: "tileset-3",
      name: "tileset-3",
      url: "http://tileset-3.url",
    },
    {
      id: "tileset-4",
      name: "tileset-4",
      url: "",
      layers: [
        {
          id: "tileset-5",
          name: "tileset-5",
          url: "",
          layers: [
            {
              id: "tileset-6",
              name: "tileset-6",
              url: "http://tileset-6.url",
            },
            {
              id: "tileset-7",
              name: "tileset-7",
              url: "http://tileset-7.url",
            },
          ],
        },
        {
          id: "tileset-8",
          name: "tileset-8",
          url: "http://tileset-8.url",
        },
      ],
    },
  ],
}));

const onViewStateChangeMock = jest.fn();
const pointToTilesetMock = jest.fn();
const onChangeLayersMock = jest.fn();
const onTilesetLoaded = jest.fn();
const onLoadingStateChange = jest.fn();
const onShowBookmarksChange = jest.fn();
const onBuildingExplorerOpened = jest.fn();

const loadMock = load as unknown as jest.Mocked<any>;
const DeckGlWrapperMock = DeckGlWrapper as unknown as jest.Mocked<any>;
const MainToolsPanelMock = MainToolsPanel as unknown as jest.Mocked<any>;
const LayersPanelMock = LayersPanel as unknown as jest.Mocked<any>;
const ComparisonParamsPanelMock =
  ComparisonParamsPanel as unknown as jest.Mocked<any>;
const MemoryUsagePanelMock = MemoryUsagePanel as unknown as jest.Mocked<any>;
const parseTilesetUrlParamsMock =
  parseTilesetUrlParams as unknown as jest.Mocked<any>;

describe("ComparisonSide", () => {
  let viewState;

  const callRender = (renderFunc, props = {}, store = setupStore()) => {
    return renderFunc(
      <ComparisonSide
        activeLayersIds={[]}
        mode={ComparisonMode.acrossLayers}
        side={ComparisonSideMode.left}
        viewState={viewState}
        showLayerOptions
        showComparisonSettings
        loadingTime={1123}
        hasBeenCompared={false}
        showBookmarks={false}
        loadNumber={0}
        preventTransitions={false}
        buildingExplorerOpened={true}
        onShowBookmarksChange={onShowBookmarksChange}
        compareButtonMode={CompareButtonMode.Start}
        onViewStateChange={onViewStateChangeMock}
        pointToTileset={pointToTilesetMock}
        onChangeLayers={onChangeLayersMock}
        onLoadingStateChange={onLoadingStateChange}
        onTilesetLoaded={onTilesetLoaded}
        onBuildingExplorerOpened={onBuildingExplorerOpened}
        {...props}
      />,
      store
    );
  };

  beforeAll(() => {
    DeckGlWrapperMock.mockImplementation(() => <div></div>);
    MainToolsPanelMock.mockImplementation(() => <div></div>);
    LayersPanelMock.mockImplementation(() => <div></div>);
    ComparisonParamsPanelMock.mockImplementation(() => <div></div>);
    MemoryUsagePanelMock.mockImplementation(() => <div>Memory panel</div>);
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
  });

  it("Should render left side", () => {
    const { rerender, container } = callRender(renderWithThemeProviders);
    expect(container).toBeInTheDocument();
    callRender(rerender, { onChangeLayers: undefined });
    expect(container).toBeInTheDocument();
  });

  it("Should render right side", () => {
    const { container } = callRender(renderWithThemeProviders, {
      side: ComparisonSideMode.right,
    });
    expect(container).toBeInTheDocument();
  });

  it("Should change mode", () => {
    const store = setupStore();
    store.dispatch(setDragMode(DragMode.pan));
    const { rerender } = callRender(renderWithThemeProviders, undefined, store);
    expect(LayersPanelMock.mock.calls.length).toBe(2);

    callRender(rerender, {
      mode: ComparisonMode.withinLayer,
      showLayerOptions: false,
    });
    expect(LayersPanelMock.mock.calls.length).toBe(3);

    callRender(rerender, {
      mode: ComparisonMode.acrossLayers,
      showLayerOptions: true,
    });
    expect(LayersPanelMock.mock.calls.length).toBe(5);
  });

  it("Should handle staticLayers", () => {
    callRender(renderWithThemeProviders, {
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

  it("Should handle staticLayers with child layers", () => {
    callRender(renderWithThemeProviders, {
      staticLayers: [
        {
          id: "static-layer-id",
          name: "static-layer",
          url: "https://static.layer.url",
          layers: [
            {
              id: "1-static-layer-id",
              name: "1-static-layer",
              url: "https://static.layer.1.url",
            },
            {
              id: "2-static-layer-id",
              name: "2-static-layer",
              url: "https://static.layer.2.url",
            },
          ],
        },
      ],
      activeLayersIds: ["1-static-layer-id", "2-static-layer-id"],
    });
    expect(loadMock.mock.calls.length).toBe(2);
  });

  it("DeckGlI3s", () => {
    callRender(renderWithThemeProviders);

    const { onPointToLayer } = LayersPanelMock.mock.lastCall[0];
    act(() => onPointToLayer());
    expect(pointToTilesetMock).toHaveBeenCalledTimes(1);
    expect(pointToTilesetMock).toHaveBeenCalledWith(undefined);
    pointToTilesetMock.mockReset();

    const { onTilesetLoad } = DeckGlWrapperMock.mock.lastCall[0];
    act(() =>
      onTilesetLoad({ url: "http://tileset-1.url", setProps: () => undefined })
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
    callRender(renderWithThemeProviders);

    const { onTilesetLoad } = DeckGlWrapperMock.mock.lastCall[0];
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
    callRender(renderWithThemeProviders);

    const tilesetStub = {
      url: "http://tileset.url",
      isLoaded: () => true,
      setProps: () => undefined,
    };
    const { onTileLoad, onTilesetLoad } = DeckGlWrapperMock.mock.lastCall[0];
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
      callRender(renderWithThemeProviders);
      expect(LayersPanelMock.mock.calls.length).toBe(2);
    });

    it("Should call onLayerInsert", () => {
      callRender(renderWithThemeProviders);
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
      expect(onChangeLayersMock).toHaveBeenCalledTimes(1);
    });

    it("Should call onLayerInsert for group layers", () => {
      callRender(renderWithThemeProviders);
      const mock = LayersPanelMock.mock;
      const { layers, onLayerInsert } = mock.lastCall[0];
      expect(layers.length).toBe(4);
      expect(loadMock.mock.calls.length).toBe(0);
      act(() =>
        onLayerInsert({
          id: "new-layer",
          name: "New Layer",
          url: "",
          layers: [
            {
              id: "1-new-layer",
              name: "1-New Layer",
              url: "https://new.layer-1.url",
            },
          ],
        })
      );
      const { layers: layers2 } = mock.lastCall[0];
      expect(layers2.length).toBe(5);
      expect(loadMock.mock.calls.length).toBe(1);
      const tilesetUrl = loadMock.mock.lastCall[0];
      expect(tilesetUrl).toBe("https://new.layer.url/layers/0");
      expect(onChangeLayersMock).toHaveBeenCalledTimes(1);
    });

    it("Should call onLayerSelect for unit layer", () => {
      callRender(renderWithThemeProviders);
      const { onLayerSelect } = LayersPanelMock.mock.lastCall[0];

      act(() =>
        onLayerSelect({
          id: "tileset-1",
          name: "tileset-1",
          url: "http://tileset-1.url",
        })
      );

      const newActiveLayersIds = onChangeLayersMock.mock.calls[0][1];

      expect(onChangeLayersMock).toHaveBeenCalledTimes(1);
      expect(newActiveLayersIds).toStrictEqual(["tileset-1"]);
    });

    it("Should call onLayerSelect for root group layer", () => {
      callRender(renderWithThemeProviders);
      const { onLayerSelect } = LayersPanelMock.mock.lastCall[0];

      act(() =>
        onLayerSelect(
          // Group layer
          {
            id: "tileset-4",
            name: "tileset-4",
            url: "",
            layers: [
              {
                id: "tileset-5",
                name: "tileset-5",
                url: "",
                layers: [
                  {
                    id: "tileset-6",
                    name: "tileset-6",
                    url: "http://tileset-6.url",
                  },
                  {
                    id: "tileset-7",
                    name: "tileset-7",
                    url: "http://tileset-7.url",
                  },
                ],
              },
              {
                id: "tileset-8",
                name: "tileset-8",
                url: "http://tileset-8.url",
              },
            ],
          }
        )
      );

      const newActiveLayersIds = onChangeLayersMock.mock.calls[0][1];
      expect(newActiveLayersIds).toStrictEqual([
        "tileset-6",
        "tileset-7",
        "tileset-8",
      ]);
      expect(onChangeLayersMock).toHaveBeenCalledTimes(1);
    });

    it("Should call onLayerSelect for non root group layer", () => {
      callRender(renderWithThemeProviders);

      const { onLayerSelect } = LayersPanelMock.mock.lastCall[0];

      act(() =>
        onLayerSelect(
          // Non root group layer
          {
            id: "tileset-5",
            name: "tileset-5",
            url: "",
            layers: [
              {
                id: "tileset-6",
                name: "tileset-6",
                url: "http://tileset-6.url",
              },
              {
                id: "tileset-7",
                name: "tileset-7",
                url: "http://tileset-7.url",
              },
            ],
          },
          // Root layer
          {
            id: "tileset-4",
            name: "tileset-4",
            url: "",
            layers: [
              {
                id: "tileset-5",
                name: "tileset-5",
                url: "",
                layers: [
                  {
                    id: "tileset-6",
                    name: "tileset-6",
                    url: "http://tileset-6.url",
                  },
                  {
                    id: "tileset-7",
                    name: "tileset-7",
                    url: "http://tileset-7.url",
                  },
                ],
              },
              {
                id: "tileset-8",
                name: "tileset-8",
                url: "http://tileset-8.url",
              },
            ],
          }
        )
      );

      const newActiveLayersIds = onChangeLayersMock.mock.calls[0][1];
      expect(newActiveLayersIds).toStrictEqual(["tileset-6", "tileset-7"]);

      expect(onChangeLayersMock).toHaveBeenCalledTimes(1);
    });

    it("Should call onLayerSelect for non root group layer and one separate layer is selected", () => {
      callRender(renderWithThemeProviders, {
        staticLayers: [
          {
            id: "tileset-1",
            name: "tileset-1",
            url: "http://tileset-1.url",
          },
        ],
        activeLayersIds: ["tileset-1"],
      });

      const { onLayerSelect } = LayersPanelMock.mock.lastCall[0];

      act(() =>
        onLayerSelect(
          // Non root group layer
          {
            id: "tileset-5",
            name: "tileset-5",
            url: "",
            layers: [
              {
                id: "tileset-6",
                name: "tileset-6",
                url: "http://tileset-6.url",
              },
              {
                id: "tileset-7",
                name: "tileset-7",
                url: "http://tileset-7.url",
              },
            ],
          },
          // Root layer
          {
            id: "tileset-4",
            name: "tileset-4",
            url: "",
            layers: [
              {
                id: "tileset-5",
                name: "tileset-5",
                url: "",
                layers: [
                  {
                    id: "tileset-6",
                    name: "tileset-6",
                    url: "http://tileset-6.url",
                  },
                  {
                    id: "tileset-7",
                    name: "tileset-7",
                    url: "http://tileset-7.url",
                  },
                ],
              },
              {
                id: "tileset-8",
                name: "tileset-8",
                url: "http://tileset-8.url",
              },
            ],
          }
        )
      );

      const newActiveLayersIds = onChangeLayersMock.mock.calls[0][1];
      expect(newActiveLayersIds).toStrictEqual(["tileset-6", "tileset-7"]);
      expect(onChangeLayersMock).toHaveBeenCalledTimes(1);
    });

    it("Should call onLayerSelect for non root group layer and one layer in root group already selected", () => {
      callRender(renderWithThemeProviders, {
        staticLayers: [
          {
            id: "tileset-6",
            name: "tileset-6",
            url: "http://tileset-6.url",
          },
        ],
        activeLayersIds: ["tileset-6"],
      });

      const { onLayerSelect } = LayersPanelMock.mock.lastCall[0];

      act(() =>
        onLayerSelect(
          // Non root group layer
          {
            id: "tileset-7",
            name: "tileset-7",
            url: "http://tileset-7.url",
          },
          // Root layer
          {
            id: "tileset-4",
            name: "tileset-4",
            url: "",
            layers: [
              {
                id: "tileset-5",
                name: "tileset-5",
                url: "",
                layers: [
                  {
                    id: "tileset-6",
                    name: "tileset-6",
                    url: "http://tileset-6.url",
                  },
                  {
                    id: "tileset-7",
                    name: "tileset-7",
                    url: "http://tileset-7.url",
                  },
                ],
              },
              {
                id: "tileset-8",
                name: "tileset-8",
                url: "http://tileset-8.url",
              },
            ],
          }
        )
      );

      const newActiveLayersIds = onChangeLayersMock.mock.calls[0][1];
      expect(newActiveLayersIds).toStrictEqual(["tileset-6", "tileset-7"]);
      expect(onChangeLayersMock).toHaveBeenCalledTimes(1);
    });

    it("Should call onLayerSelect for leaf layer with parent", () => {
      callRender(renderWithThemeProviders);
      const { onLayerSelect } = LayersPanelMock.mock.lastCall[0];

      act(() =>
        onLayerSelect(
          // Leaf layer
          {
            id: "tileset-7",
            name: "tileset-7",
            url: "http://tileset-7.url",
          },
          // Root layer
          {
            id: "tileset-4",
            name: "tileset-4",
            url: "",
            layers: [
              {
                id: "tileset-5",
                name: "tileset-5",
                url: "",
                layers: [
                  {
                    id: "tileset-6",
                    name: "tileset-6",
                    url: "http://tileset-6.url",
                  },
                  {
                    id: "tileset-7",
                    name: "tileset-7",
                    url: "http://tileset-7.url",
                  },
                ],
              },
              {
                id: "tileset-8",
                name: "tileset-8",
                url: "http://tileset-8.url",
              },
            ],
          }
        )
      );

      const newActiveLayersIds = onChangeLayersMock.mock.calls[0][1];
      expect(newActiveLayersIds).toStrictEqual(["tileset-7"]);
      expect(onChangeLayersMock).toHaveBeenCalledTimes(1);
    });

    it("Should call onLayerSelect for leaf layer with parent and one leaf already selected", () => {
      callRender(renderWithThemeProviders, {
        staticLayers: [
          {
            id: "tileset-8",
            name: "tileset-8",
            url: "http://tileset-8.url",
          },
        ],
        activeLayersIds: ["tileset-8"],
      });
      const { onLayerSelect } = LayersPanelMock.mock.lastCall[0];

      act(() =>
        onLayerSelect(
          // Leaf layer
          {
            id: "tileset-7",
            name: "tileset-7",
            url: "http://tileset-7.url",
          },
          // Root layer
          {
            id: "tileset-4",
            name: "tileset-4",
            url: "",
            layers: [
              {
                id: "tileset-5",
                name: "tileset-5",
                url: "",
                layers: [
                  {
                    id: "tileset-6",
                    name: "tileset-6",
                    url: "http://tileset-6.url",
                  },
                  {
                    id: "tileset-7",
                    name: "tileset-7",
                    url: "http://tileset-7.url",
                  },
                ],
              },
              {
                id: "tileset-8",
                name: "tileset-8",
                url: "http://tileset-8.url",
              },
            ],
          }
        )
      );

      const newActiveLayersIds = onChangeLayersMock.mock.calls[0][1];
      expect(newActiveLayersIds).toStrictEqual(["tileset-8", "tileset-7"]);
      expect(onChangeLayersMock).toHaveBeenCalledTimes(1);
    });

    it("Should not be able to unselect unit layer", () => {
      callRender(renderWithThemeProviders, {
        staticLayers: [
          {
            id: "tileset-1",
            name: "tileset-1",
            url: "http://tileset-1.url",
          },
        ],
        activeLayersIds: ["tileset-1"],
      });
      const { onLayerSelect } = LayersPanelMock.mock.lastCall[0];

      act(() =>
        onLayerSelect({
          id: "tileset-1",
          name: "tileset-1",
          url: "http://tileset-1.url",
        })
      );

      const newActiveLayersIds = onChangeLayersMock.mock.calls[0][1];

      expect(onChangeLayersMock).toHaveBeenCalledTimes(1);
      expect(newActiveLayersIds).toStrictEqual(["tileset-1"]);
    });

    it("Should be able to unselect non root group layer", () => {
      callRender(renderWithThemeProviders, {
        staticLayers: [
          {
            id: "tileset-6",
            name: "tileset-6",
            url: "http://tileset-6.url",
          },
          {
            id: "tileset-7",
            name: "tileset-7",
            url: "http://tileset-7.url",
          },
        ],
        activeLayersIds: ["tileset-6", "tileset-7"],
      });
      const { onLayerSelect } = LayersPanelMock.mock.lastCall[0];

      act(() =>
        onLayerSelect(
          // Selected layer
          {
            id: "tileset-5",
            name: "tileset-5",
            url: "",
            layers: [
              {
                id: "tileset-6",
                name: "tileset-6",
                url: "http://tileset-6.url",
              },
              {
                id: "tileset-7",
                name: "tileset-7",
                url: "http://tileset-7.url",
              },
            ],
          },
          // Root layer
          {
            id: "tileset-4",
            name: "tileset-4",
            url: "",
            layers: [
              {
                id: "tileset-5",
                name: "tileset-5",
                url: "",
                layers: [
                  {
                    id: "tileset-6",
                    name: "tileset-6",
                    url: "http://tileset-6.url",
                  },
                  {
                    id: "tileset-7",
                    name: "tileset-7",
                    url: "http://tileset-7.url",
                  },
                ],
              },
              {
                id: "tileset-8",
                name: "tileset-8",
                url: "http://tileset-8.url",
              },
            ],
          }
        )
      );

      const newActiveLayersIds = onChangeLayersMock.mock.calls[0][1];

      expect(onChangeLayersMock).toHaveBeenCalledTimes(1);
      expect(newActiveLayersIds).toStrictEqual([]);
    });

    it("Should be able to unselect leaf layer", () => {
      callRender(renderWithThemeProviders, {
        staticLayers: [
          {
            id: "tileset-7",
            name: "tileset-7",
            url: "http://tileset-7.url",
          },
        ],
        activeLayersIds: ["tileset-7"],
      });
      const { onLayerSelect } = LayersPanelMock.mock.lastCall[0];

      act(() =>
        onLayerSelect(
          // Selected layer
          {
            id: "tileset-7",
            name: "tileset-7",
            url: "http://tileset-7.url",
          },
          // Root layer
          {
            id: "tileset-4",
            name: "tileset-4",
            url: "",
            layers: [
              {
                id: "tileset-5",
                name: "tileset-5",
                url: "",
                layers: [
                  {
                    id: "tileset-6",
                    name: "tileset-6",
                    url: "http://tileset-6.url",
                  },
                  {
                    id: "tileset-7",
                    name: "tileset-7",
                    url: "http://tileset-7.url",
                  },
                ],
              },
              {
                id: "tileset-8",
                name: "tileset-8",
                url: "http://tileset-8.url",
              },
            ],
          }
        )
      );

      const newActiveLayersIds = onChangeLayersMock.mock.calls[0][1];

      expect(onChangeLayersMock).toHaveBeenCalledTimes(1);
      expect(newActiveLayersIds).toStrictEqual([]);
    });

    it("Should call onLayerDelete", () => {
      callRender(renderWithThemeProviders);
      const { layers, onLayerDelete } = LayersPanelMock.mock.lastCall[0];
      expect(layers.length).toBe(4);

      act(() => onLayerDelete("tileset-1"));
      const { layers: layers2 } = LayersPanelMock.mock.lastCall[0];
      expect(layers2.length).toBe(3);
    });

    it("Should call onLayerDelete for group layer", () => {
      callRender(renderWithThemeProviders);
      const { layers, onLayerDelete } = LayersPanelMock.mock.lastCall[0];
      expect(layers.length).toBe(4);

      act(() => onLayerDelete("tileset-4"));
      const { layers: layers2 } = LayersPanelMock.mock.lastCall[0];
      expect(layers2.length).toBe(3);
    });

    it("Should call onUpdateSublayerVisibilityHandler", () => {
      callRender(renderWithThemeProviders);
      const { onUpdateSublayerVisibility } = LayersPanelMock.mock.lastCall[0];
      act(() => onUpdateSublayerVisibility({ layerType: "3DObject" }));
      act(() => onUpdateSublayerVisibility({ layerType: "Unknown type" }));
      // No checks. Can't change `flattenedSublayers` due to async loading
    });

    it("Should close", () => {
      callRender(renderWithThemeProviders);
      expect(LayersPanelMock.mock.calls.length).toBe(2);
      const { onClose } = LayersPanelMock.mock.lastCall[0];
      act(() => onClose());
      expect(LayersPanelMock.mock.calls.length).toBe(2);
    });
  });

  describe("SettingsPanel", () => {
    beforeEach(() => {
      callRender(renderWithThemeProviders);
      expect(ComparisonParamsPanelMock.mock.calls.length).toBe(0);
      const { onChange } = MainToolsPanelMock.mock.lastCall[0];
      act(() => onChange(ActiveButton.settings));
    });

    it("Should render", () => {
      expect(ComparisonParamsPanelMock.mock.calls.length).toBe(1);
    });

    it("Should call onGeometryChange", () => {
      const { useDracoGeometry } = DeckGlWrapperMock.mock.lastCall[0];
      expect(useDracoGeometry).toBeTruthy();

      const { onGeometryChange } = ComparisonParamsPanelMock.mock.lastCall[0];
      act(() => onGeometryChange());

      const { useDracoGeometry: newUseDracoGeometry } =
        DeckGlWrapperMock.mock.lastCall[0];
      expect(newUseDracoGeometry).toBeFalsy();
    });

    it("Should call onTexturesChange", () => {
      const { useCompressedTextures } = DeckGlWrapperMock.mock.lastCall[0];
      expect(useCompressedTextures).toBeTruthy();

      const { onTexturesChange } = ComparisonParamsPanelMock.mock.lastCall[0];
      act(() => onTexturesChange());

      const { useCompressedTextures: newUseCompressedTextures } =
        DeckGlWrapperMock.mock.lastCall[0];
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
      callRender(renderWithThemeProviders);
      expect(MemoryUsagePanelMock.mock.calls.length).toBe(0);
      const { onChange } = MainToolsPanelMock.mock.lastCall[0];
      act(() => onChange(ActiveButton.memory));
    });

    it("Should render", () => {
      expect(MemoryUsagePanelMock.mock.calls.length).toBe(1);
    });

    it("Should disappear in comparing mode", () => {
      callRender(renderWithThemeProviders, {
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

  describe("Comparison end", () => {
    it("Should render statistics panel", () => {
      callRender(renderWithThemeProviders, {
        hasBeenCompared: true,
      });
      expect(screen.getByText("Memory panel")).toBeInTheDocument();
    });
  });
});
