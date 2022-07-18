import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { MapControllPanel } from "./map-control-panel";

describe("MapControllPanel", () => {
  let componentElement;
  let rerenderFunc;
  let buttons;
  const onZoomIn = jest.fn();
  const onZoomOut = jest.fn();

  beforeEach(() => {
    const { rerender, container, getAllByRole } = renderWithTheme(
      <MapControllPanel onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
    );
    rerenderFunc = rerender;
    componentElement = container.firstChild;
    buttons = getAllByRole("button");
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
    renderWithTheme(
      <MapControllPanel onZoomIn={onZoomIn} onZoomOut={onZoomOut} />,
      rerenderFunc
    );
    expect(componentElement?.childNodes.length).toBe(2);

    userEvent.click(expander);
    renderWithTheme(
      <MapControllPanel onZoomIn={onZoomIn} onZoomOut={onZoomOut} />,
      rerenderFunc
    );
    expect(componentElement?.childNodes.length).toBe(6);
  });

  it("Should click on zoom in/out", () => {
    const [zoomIn, zoomOut] = buttons;
    userEvent.click(zoomIn);
    expect(onZoomIn).toBeCalledTimes(1);
    userEvent.click(zoomOut);
    expect(onZoomOut).toBeCalledTimes(1);
  });
});
