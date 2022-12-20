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
        loadingTime={1123}
        updateNumber={1}
        onClose={onClose}
        activeLayers={[]}
      />
    );
    componentElement = container.firstChild;
    expandContainer = componentElement.lastChild.lastChild;
    rerenderFunc = rerender;
  });

  it("Should render with tileset stats section", () => {
    expect(componentElement.lastChild.childNodes.length).toBe(3);
  });

  it("Should render without tileset stats section", () => {
    renderWithTheme(
      <MemoryUsagePanel
        id="test-memory-usage-panel"
        memoryStats={memoryStats}
        tilesetStats={null}
        loadingTime={1123}
        updateNumber={1}
        onClose={onClose}
        activeLayers={[]}
      />,
      rerenderFunc
    );
    expect(componentElement.lastChild.childNodes.length).toBe(2);
  });

  it("Should render content formats", () => {
    renderWithTheme(
      <MemoryUsagePanel
        id="test-memory-usage-panel"
        memoryStats={memoryStats}
        tilesetStats={null}
        contentFormats={{ draco: true, meshopt: false, dds: false, ktx2: true }}
        loadingTime={1123}
        updateNumber={1}
        onClose={onClose}
        activeLayers={[]}
      />,
      rerenderFunc
    );
    expect(componentElement.childNodes.length).toBe(5);

    const formatsTitle = componentElement.childNodes[2].firstChild.firstChild;
    expect(formatsTitle.innerHTML).toBe("Content Formats");

    const formatsContainer = componentElement.childNodes[2].firstChild;
    const formats: { [key: string]: string } = {};
    for (let i = 1; i <= 4; i++) {
      const element = formatsContainer.childNodes[i];
      formats[element.firstChild.innerHTML] = element.childNodes[1].innerHTML;
    }
    expect(formats).toEqual({
      DDS: "No",
      Draco: "Yes",
      KTX2: "Yes",
      Meshopt: "No",
    });
  });

  it("Should collapse/expand", () => {
    const expandIcon = screen.getByText("Layer(s) Used").nextElementSibling;

    expect(expandContainer).toBeInTheDocument();
    expect(expandIcon).toBeInTheDocument();
    expandIcon && userEvent.click(expandIcon);
    renderWithTheme(
      <MemoryUsagePanel
        id="test-memory-usage-panel"
        memoryStats={memoryStats}
        tilesetStats={tilesetStats}
        loadingTime={1123}
        updateNumber={1}
        onClose={onClose}
        activeLayers={[]}
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
        loadingTime={1123}
        updateNumber={1}
        onClose={onClose}
        activeLayers={[]}
      />,
      rerenderFunc
    );
    expect(expandContainer.childNodes.length).toBe(5);
  });

  it("Should show layer name in statistics if active layers provided", () => {
    renderWithTheme(
      <MemoryUsagePanel
        id="test-memory-usage-panel"
        memoryStats={memoryStats}
        tilesetStats={tilesetStats}
        loadingTime={1123}
        updateNumber={1}
        onClose={onClose}
        activeLayers={[{
          id: 'active-layer-id',
          name: 'San Francisco',
          url: 'https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0'
        }]}
      />,
      rerenderFunc
    );
    const tilesetTitle = screen.getByText('San Francisco');
    expect(tilesetTitle).toBeInTheDocument();
  });

  it("Should not show loading time if it is not provided", () => {
    renderWithTheme(
      <MemoryUsagePanel
        id="test-memory-usage-panel"
        memoryStats={memoryStats}
        tilesetStats={tilesetStats}
        updateNumber={1}
        onClose={onClose}
        activeLayers={[{
          id: 'active-layer-id',
          name: 'San Francisco',
          url: 'https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0'
        }]}
      />,
      rerenderFunc
    );
    const tilesetTitle = screen.queryByText('Loading time');
    expect(tilesetTitle).not.toBeInTheDocument();
  });

  it("Should copy to clipboard", () => {
    const LINK = tilesetStats.id;
    const copyIcon = expandContainer.childNodes[1].lastChild;
    userEvent.click(copyIcon);
    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(LINK);
  });
});
