import userEvent from "@testing-library/user-event";
import { DragMode } from "../../types";
import { renderWithThemeProviders } from "../../utils/testing-utils/render-with-theme";
import { MapControlPanel } from "./map-control-panel";
import { setupStore } from "../../redux/store";
import { setDragMode } from "../../redux/slices/drag-mode-slice";

jest.mock("@loaders.gl/i3s", () => {
  return jest.fn().mockImplementation(() => {
    return null;
  });
});

describe("MapControlPanel", () => {
  let componentElement;
  let buttons;
  let store;
  const onZoomIn = jest.fn();
  const onZoomOut = jest.fn();
  const onRotate = jest.fn();

  beforeEach(() => {
    const initStore = setupStore();
    initStore.dispatch(setDragMode(DragMode.pan));
    const { container, getAllByRole } = renderWithThemeProviders(
      <MapControlPanel
        bearing={90}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onCompassClick={onRotate}
      />,
      initStore
    );
    componentElement = container.firstChild;
    buttons = getAllByRole("button");
    store = initStore;
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
    renderWithThemeProviders(
      <MapControlPanel
        bearing={90}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onCompassClick={onRotate}
      />,
      store
    );
    expect(componentElement?.childNodes.length).toBe(2);

    userEvent.click(expander);
    renderWithThemeProviders(
      <MapControlPanel
        bearing={90}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onCompassClick={onRotate}
      />,
      store
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

    store.dispatch(setDragMode(DragMode.rotate));
    renderWithThemeProviders(
      <MapControlPanel
        bearing={90}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onCompassClick={onRotate}
      />,
      store
    );
    fill = getComputedStyle(panModeButton).getPropertyValue("fill");
    expect(fill).toBe("#000010");
    fill = getComputedStyle(rotateModeButton).getPropertyValue("fill");
    expect(fill).toBe("#FFFFFF");
  });

  it("Should click on dragMode buttons", () => {
    const [, , panMode, rotateMode] = buttons;
    userEvent.click(panMode);
    expect(store.getState().dragMode.value).toEqual(DragMode.rotate);
    userEvent.click(rotateMode);
    expect(store.getState().dragMode.value).toEqual(DragMode.pan);
  });
});
