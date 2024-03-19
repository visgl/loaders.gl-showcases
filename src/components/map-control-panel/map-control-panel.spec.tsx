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
  let buttons: HTMLButtonElement[];
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
    buttons = getAllByRole("button") as HTMLButtonElement[];
    store = initStore;
  });

  it("Should render", () => {
    expect(componentElement).toBeInTheDocument();
    expect(componentElement?.childNodes.length).toBe(6);
    expect(componentElement?.childNodes[0].nodeName).toBe("DIV");
  });

  it("Should collapse/expand", async () => {
    expect(componentElement?.childNodes.length).toBe(6);

    const expander = componentElement?.childNodes[0];
    expect(expander).toBeInTheDocument();
    await userEvent.click(expander);
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

    await userEvent.click(expander);
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

  it("Should click on zoom in/out", async () => {
    const [zoomIn, zoomOut] = buttons;
    await userEvent.click(zoomIn);
    expect(onZoomIn).toHaveBeenCalledTimes(1);
    await userEvent.click(zoomOut);
    expect(onZoomOut).toHaveBeenCalledTimes(1);
  });

  it("Should click on rotate", async () => {
    const rotateButton = buttons[buttons.length - 1];
    const compassIcon = rotateButton.firstChild;
    expect(compassIcon).toHaveStyle("transform: rotate(-90deg)");
    await userEvent.click(rotateButton);
    expect(onRotate).toHaveBeenCalledTimes(1);
  });

  it("Should highlight dragMode buttons", async () => {
    const [, , panModeButton, rotateModeButton] = buttons;
    expect(panModeButton).toHaveStyle({ fill: "#FFFFFF" });
    // TODO: the button gets `hover` style for some reason
    expect(rotateModeButton).toHaveStyle({ fill: "#000011" });

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
    // TODO: the button gets `hover` style for some reason
    expect(panModeButton).toHaveStyle({ fill: "#000011" });
    expect(rotateModeButton).toHaveStyle({ fill: "#FFFFFF" });
  });

  it("Should click on dragMode buttons", async () => {
    const [, , panMode, rotateMode] = buttons;
    await userEvent.click(panMode);
    expect(store.getState().dragMode.value).toEqual(DragMode.rotate);
    await userEvent.click(rotateMode);
    expect(store.getState().dragMode.value).toEqual(DragMode.pan);
  });
});
