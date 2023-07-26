import { screen } from "@testing-library/react";
import { renderWithThemeProviders } from "../../utils/testing-utils/render-with-theme";
import { useAppLayout } from "../../utils/hooks/layout";
import { DebugPanel } from "./debug-panel";
import {
  BoundingVolumeColoredBy,
  BoundingVolumeType,
  TileColoredBy,
} from "../../types";
import userEvent from "@testing-library/user-event";
import { setupStore } from "../../redux/store";
import {
  setDebugOptions,
  selectTileColorMode,
  selectBoundingVolumeColorMode,
  selectBoundingVolumeType,
} from "../../redux/slices/debug-options-slice";

jest.mock("../../utils/hooks/layout");
jest.mock("../close-button/close-button", () => ({
  CloseButton: ({ onClick }) => {
    const CloseButtonMock = "close-button-mock";
    return (
      // @ts-expect-error - mock component
      <CloseButtonMock onClick={onClick} data-testid="close-button" />
    );
  },
}));

const useAppLayoutMock = useAppLayout as unknown as jest.Mocked<any>;

const onCloseMock = jest.fn();

const callRender = (renderFunc, props = {}, store = setupStore()) => {
  return renderFunc(<DebugPanel onClose={onCloseMock} {...props} />, store);
};

const toggles = {
  differentViewports: {
    toggleId: "toggle-minimap-viewport",
    titleText: "Use different Viewports",
    calledWith: ["minimapViewport", true],
  },
  minimap: {
    toggleId: "toggle-minimap",
    titleText: "Minimap",
    calledWith: ["minimap", false],
  },
  loadingTiles: {
    toggleId: "toggle-loading-tiles",
    titleText: "Loading Tiles",
    calledWith: ["loadTiles", true],
  },
  picking: {
    toggleId: "toggle-enable-picking",
    titleText: "Enable picking",
    calledWith: ["pickable", true],
  },
  wireframe: {
    toggleId: "toggle-enable-wireframe",
    titleText: "Wireframe mode",
    calledWith: ["wireframe", true],
  },
  textureUvs: {
    toggleId: "toggle-enable-texture-uvs",
    titleText: "Texture UVs",
    calledWith: ["showUVDebugTexture", true],
  },
  boundingVolumes: {
    toggleId: "toggle-enable-bounding-volumes",
    titleText: "Bounding Volumes",
    calledWith: ["boundingVolume", true],
  },
};

const checkToggleTitle = ({ titleText }) => {
  const title = screen.getByText(titleText);
  expect(title).toBeInTheDocument();
};

describe("Debug panel", () => {
  it("Should render debug panel", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");

    const store = setupStore();
    store.dispatch(
      setDebugOptions({
        minimap: true,
        minimapViewport: false,
        boundingVolume: false,
        tileColorMode: TileColoredBy.original,
        boundingVolumeColorMode: BoundingVolumeColoredBy.original,
        boundingVolumeType: BoundingVolumeType.mbs,
        pickable: false,
        loadTiles: false,
        showUVDebugTexture: false,
        wireframe: false,
      })
    );
    callRender(renderWithThemeProviders, undefined, store);

    // Check panel title
    const title = screen.getByText("Debug Panel");
    expect(title).toBeInTheDocument();

    // Check close Button
    const closeButton = screen.getByTestId("close-button");
    userEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalled();

    // Check all toggles
    for (const key of Object.keys(toggles)) {
      const toggleData = toggles[key];
      checkToggleTitle(toggleData);
    }
  });

  it("Should hide different viewport toggle if minimap is turned off", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");

    const store = setupStore();
    store.dispatch(
      setDebugOptions({
        minimap: false,
        minimapViewport: false,
        boundingVolume: false,
        tileColorMode: TileColoredBy.original,
        boundingVolumeColorMode: BoundingVolumeColoredBy.original,
        boundingVolumeType: BoundingVolumeType.mbs,
        pickable: false,
        loadTiles: false,
        showUVDebugTexture: false,
        wireframe: false,
      })
    );
    callRender(renderWithThemeProviders, undefined, store);

    expect(
      screen.queryByText("Use different Viewports")
    ).not.toBeInTheDocument();
  });

  it("Should be able to select different mesh color", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");

    const colorItems = [
      TileColoredBy.original,
      TileColoredBy.random,
      TileColoredBy.depth,
      TileColoredBy.custom,
    ];
    for (const colorItem of colorItems) {
      const store = setupStore();
      store.dispatch(
        setDebugOptions({
          minimap: true,
          minimapViewport: false,
          boundingVolume: false,
          tileColorMode: colorItem,
          boundingVolumeColorMode: BoundingVolumeColoredBy.original,
          boundingVolumeType: BoundingVolumeType.mbs,
          pickable: false,
          loadTiles: false,
          showUVDebugTexture: false,
          wireframe: false,
        })
      );
      callRender(renderWithThemeProviders, undefined, store);
      const state = store.getState();
      const tileColorMode = selectTileColorMode(state);
      expect(tileColorMode).toEqual(colorItem);
    }
  });

  it("Should be able to select bounding volume color and type", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");

    const store = setupStore();
    store.dispatch(
      setDebugOptions({
        minimap: false,
        minimapViewport: false,
        boundingVolume: true,
        tileColorMode: TileColoredBy.original,
        boundingVolumeColorMode: BoundingVolumeColoredBy.original,
        boundingVolumeType: BoundingVolumeType.mbs,
        pickable: false,
        loadTiles: false,
        showUVDebugTexture: false,
        wireframe: false,
      })
    );
    callRender(renderWithThemeProviders, undefined, store);
    const state = store.getState();
    const boundingVolumeColorMode = selectBoundingVolumeColorMode(state);
    expect(boundingVolumeColorMode).toEqual(BoundingVolumeColoredBy.original);
    const boundingVolumeType = selectBoundingVolumeType(state);
    expect(boundingVolumeType).toEqual(BoundingVolumeType.mbs);
  });

  it("Should be able to select bounding volume color and type. Another items", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");

    const store = setupStore();
    store.dispatch(
      setDebugOptions({
        minimap: false,
        minimapViewport: false,
        boundingVolume: true,
        tileColorMode: TileColoredBy.original,
        boundingVolumeColorMode: BoundingVolumeColoredBy.tile,
        boundingVolumeType: BoundingVolumeType.obb,
        pickable: false,
        loadTiles: false,
        showUVDebugTexture: false,
        wireframe: false,
      })
    );
    callRender(renderWithThemeProviders, undefined, store);
    const state = store.getState();
    const boundingVolumeColorMode = selectBoundingVolumeColorMode(state);
    expect(boundingVolumeColorMode).toEqual(BoundingVolumeColoredBy.tile);
    const boundingVolumeType = selectBoundingVolumeType(state);
    expect(boundingVolumeType).toEqual(BoundingVolumeType.obb);
  });
});
