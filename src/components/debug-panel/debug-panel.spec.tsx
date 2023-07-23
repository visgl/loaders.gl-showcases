import { screen } from "@testing-library/react";
import {
  renderWithTheme,
  renderWithThemeProviders,
} from "../../utils/testing-utils/render-with-theme";
import { useAppLayout } from "../../utils/hooks/layout";
import { DebugPanel } from "./debug-panel";
import {
  BoundingVolumeColoredBy,
  BoundingVolumeType,
  TileColoredBy,
} from "../../types";
import userEvent from "@testing-library/user-event";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setupStore } from "../../redux/store";
import { setDebugOptions } from "../../redux/slices/debug-options-slice";

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

const checkToggleTitleAndEvent = ({ toggleId, titleText, calledWith }) => {
  const title = screen.getByText(titleText);
  expect(title).toBeInTheDocument();

  const toggle = document.querySelector(`#${toggleId}`) || null;
  if (toggle) {
    userEvent.click(toggle);
  }
};

describe("Debug panel", () => {
  it("Should render debug panel and toggles should work", () => {
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
      checkToggleTitleAndEvent(toggleData);
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

    const colorItems = [
      {
        buttonText: "Original",
        calledWith: ["tileColorMode", TileColoredBy.original],
      },
      {
        buttonText: "Random by tile",
        calledWith: ["tileColorMode", TileColoredBy.random],
      },
      {
        buttonText: "By depth",
        calledWith: ["tileColorMode", TileColoredBy.depth],
      },
      {
        buttonText: "User selected",
        calledWith: ["tileColorMode", TileColoredBy.custom],
      },
    ];

    for (const colorItem of colorItems) {
      const button = screen.getByText(colorItem.buttonText);
      userEvent.click(button);
    }
  });

  it("Should be able to select bounding volume color", () => {
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

    const originalColorButton = screen.getAllByText("Original")[1];
    userEvent.click(originalColorButton);

    const byTileColorButton = screen.getByText("By tile");
    userEvent.click(byTileColorButton);
  });

  it("Should be able to select bounding volume type", () => {
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

    const OBBButton = screen.getByText("OBB");
    userEvent.click(OBBButton);

    const MBSButton = screen.getByText("MBS");
    userEvent.click(MBSButton);
  });
});
