import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { MapControllPanel } from "./map-control-panel";

describe("MapControllPanel", () => {
  let componentElement;
  let rerenderFunc;

  beforeEach(() => {
    const { rerender, container } = renderWithTheme(<MapControllPanel />);
    rerenderFunc = rerender;
    componentElement = container.firstChild;
  });

  it("Should render", () => {
    expect(componentElement).toBeInTheDocument();
    expect(componentElement?.childNodes.length).toBe(6);
    expect(componentElement?.childNodes[0].nodeName).toBe("DIV");
  });

  it("Should collapse/expand", () => {
    expect(componentElement?.childNodes.length).toBe(6);

    const expander = componentElement?.childNodes[0];
    expect(expander).toBeInTheDocument();
    userEvent.click(expander);
    renderWithTheme(<MapControllPanel />, rerenderFunc);
    expect(componentElement?.childNodes.length).toBe(2);

    userEvent.click(expander);
    renderWithTheme(<MapControllPanel />, rerenderFunc);
    expect(componentElement?.childNodes.length).toBe(6);
  });
});
