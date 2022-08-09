import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { MemoryUsagePanel } from "./memory-usage-panel";

Object.assign(window.navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

const memoryStats: any = {
  id: "Memory Usage",
  stats: {
    "GPU Memory": {
      name: "GPU Memory",
      type: "count",
      count: 4,
    },
  },
};

const tilesetStats: any = {
  id: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0",
  stats: {
    "Tiles In Tileset(s)": {
      name: "Points/Vertices",
      type: "count",
      count: 216,
    },
    "Failed Tile Loads": {
      name: "Failed Tile Loads",
      type: "count",
      count: 0,
    },
    "Points/Vertices": {
      name: "Points/Vertices",
      type: "memory",
      count: 2704757,
    },
  },
};

describe("MemoryUsagePanel", () => {
  let componentElement;
  let expandContainer;
  let rerenderFunc;
  const onClose = jest.fn();

  beforeEach(() => {
    const { rerender, container } = renderWithTheme(
      <MemoryUsagePanel
        id="test-memory-usage-panel"
        memoryStats={memoryStats}
        tilesetStats={tilesetStats}
        onClose={onClose}
      />
    );
    componentElement = container.firstChild;
    expandContainer = componentElement.lastChild.lastChild;
    rerenderFunc = rerender;
  });

  it("Should render with tileset stats section", () => {
    expect(componentElement.lastChild.childNodes.length).toBe(2);
  });

  it("Should render without tileset stats section", () => {
    renderWithTheme(
      <MemoryUsagePanel
        id="test-memory-usage-panel"
        memoryStats={memoryStats}
        tilesetStats={null}
        onClose={onClose}
      />,
      rerenderFunc
    );
    expect(componentElement.lastChild.childNodes.length).toBe(1);
  });

  it("Should collapse/expand", () => {
    const expandIcon = screen.getByText("Layer Used").nextElementSibling;

    expect(expandContainer).toBeInTheDocument();
    expect(expandIcon).toBeInTheDocument();
    expandIcon && userEvent.click(expandIcon);
    renderWithTheme(
      <MemoryUsagePanel
        id="test-memory-usage-panel"
        memoryStats={memoryStats}
        tilesetStats={tilesetStats}
        onClose={onClose}
      />,
      rerenderFunc
    );
    expect(expandContainer.childNodes.length).toBe(1);

    expandIcon && userEvent.click(expandIcon);
    renderWithTheme(
      <MemoryUsagePanel
        id="test-memory-usage-panel"
        memoryStats={memoryStats}
        tilesetStats={tilesetStats}
        onClose={onClose}
      />,
      rerenderFunc
    );
    expect(expandContainer.childNodes.length).toBe(5);
  });

  it("Should copy to clipboard", () => {
    const LINK = tilesetStats.id;
    const copyIcon = expandContainer.childNodes[1].lastChild;
    userEvent.click(copyIcon);
    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(LINK);
  });
});
