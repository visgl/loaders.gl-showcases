import userEvent from "@testing-library/user-event";
import { DragMode } from "../../types";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { MapControllPanel } from "./map-control-panel";

describe("MapControllPanel", () => {
  let componentElement;
  let rerenderFunc;
  let buttons;
  const onZoomIn = jest.fn();
  const onZoomOut = jest.fn();
  const onRotate = jest.fn();
  const onDragModeToggle = jest.fn();

  beforeEach(() => {
    const { rerender, container, getAllByRole } = renderWithTheme(
      <MapControllPanel
        bearing={90}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onCompassClick={onRotate}
        dragMode={DragMode.pan}
        onDragModeToggle={onDragModeToggle}
      />
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
      <MapControllPanel
        bearing={90}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onCompassClick={onRotate}
        dragMode={DragMode.pan}
        onDragModeToggle={onDragModeToggle}
      />,
      rerenderFunc
    );
    expect(componentElement?.childNodes.length).toBe(2);

    userEvent.click(expander);
    renderWithTheme(
      <MapControllPanel
        bearing={90}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onCompassClick={onRotate}
        dragMode={DragMode.pan}
        onDragModeToggle={onDragModeToggle}
      />,
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

  it("Should click on rotate", () => {
    const rotateButton = buttons[buttons.length - 1];
    const compassIcon = rotateButton.firstChild;
    expect(compassIcon).toHaveStyle("transform: rotate(-90deg)");
    userEvent.click(rotateButton);
    expect(onRotate).toBeCalledTimes(1);
  });

  it("Should highlight dragMode buttons", () => {
    const [, , panModeButton, rotateModeButton] = buttons;
    let fill = getComputedStyle(panModeButton).getPropertyValue("fill");
    expect(fill).toBe("#FFFFFF");
    fill = getComputedStyle(rotateModeButton).getPropertyValue("fill");
    expect(fill).toBe("#000010");

    renderWithTheme(
      <MapControllPanel
        bearing={90}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onCompassClick={onRotate}
        dragMode={DragMode.pan}
        onDragModeToggle={onDragModeToggle}
      />,
      rerenderFunc
    );
    fill = getComputedStyle(panModeButton).getPropertyValue("fill");
    expect(fill).toBe("#000010");
    fill = getComputedStyle(rotateModeButton).getPropertyValue("fill");
    expect(fill).toBe("#FFFFFF");
  });

  it("Should click on dragMode buttons", () => {
    const [, , panMode, rotateMode] = buttons;
    userEvent.click(panMode);
    expect(onDragModeToggle).toBeCalledTimes(1);
    userEvent.click(rotateMode);
    expect(onDragModeToggle).toBeCalledTimes(2);
  });
});
