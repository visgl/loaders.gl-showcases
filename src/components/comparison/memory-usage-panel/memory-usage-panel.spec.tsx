import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { MemoryUsagePanel } from "./memory-usage-panel";

Object.assign(window.navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

describe("MemoryUsagePanel", () => {
  let componentElement;
  let expandContainer;
  let rerenderFunc;
  const onClose = jest.fn();

  beforeEach(() => {
    const { rerender, container } = renderWithTheme(
      <MemoryUsagePanel id="test-memory-usage-panel" onClose={onClose} />
    );
    componentElement = container.firstChild;
    expandContainer = componentElement.lastChild.lastChild;
    rerenderFunc = rerender;
  });

  it("Should render", () => {
    expect(componentElement).toBeInTheDocument();
    expect(componentElement.childNodes.length).toBe(3);
  });

  it("Should collapse/expand", () => {
    const expandIcon = screen.getByText("Layer Used").nextElementSibling;

    expect(expandContainer).toBeInTheDocument();
    expect(expandIcon).toBeInTheDocument();
    expandIcon && userEvent.click(expandIcon);
    renderWithTheme(
      <MemoryUsagePanel id="test-memory-usage-panel" onClose={onClose} />,
      rerenderFunc
    );
    expect(expandContainer.childNodes.length).toBe(1);

    expandIcon && userEvent.click(expandIcon);
    renderWithTheme(
      <MemoryUsagePanel id="test-memory-usage-panel" onClose={onClose} />,
      rerenderFunc
    );
    expect(expandContainer.childNodes.length).toBe(12);
  });

  it("Should copy to clipboard", () => {
    const LINK =
      "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0";
    const copyIcon = expandContainer.childNodes[1].lastChild;
    userEvent.click(copyIcon);
    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(LINK);
    screen.debug(copyIcon);
  });
});
