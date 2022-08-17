import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { LayersPanel } from "./layers-panel";

// Mocked compnents
import { LayersControlPanel } from "./layers-control-panel";
import { MapOptionPanel } from "./map-options-panel";
import { InsertPanel } from "../../insert-panel/insert-panel";
import { WarningPanel } from "./warning/warning-panel";
import { LayerSettingsPanel } from "./layer-settings-panel";

jest.mock("./layers-control-panel");
jest.mock("./map-options-panel");
jest.mock("../../insert-panel/insert-panel");
jest.mock("./warning/warning-panel");
jest.mock("./layer-settings-panel");

jest.mock("../../close-button/close-button", () => ({
  CloseButton: ({ onClick }) => {
    const CloseButtonMock = "close-button-mock";

    return (
      // @ts-expect-error - Property 'checkbox-mock' does not exist on type 'JSX.IntrinsicElements'
      <CloseButtonMock onClick={onClick}>Close</CloseButtonMock>
    );
  },
}));

const LayersControlPanelMock =
  LayersControlPanel as unknown as jest.Mocked<any>;
const MapOptionPanelMock = MapOptionPanel as unknown as jest.Mocked<any>;
const InsertPanelMock = InsertPanel as unknown as jest.Mocked<any>;
const WarningPanelMock = WarningPanel as unknown as jest.Mocked<any>;
const LayerSettingsPanelMock =
  LayerSettingsPanel as unknown as jest.Mocked<any>;

beforeAll(() => {
  LayersControlPanelMock.mockImplementation(() => (
    <div>Layers Control Panel</div>
  ));
  MapOptionPanelMock.mockImplementation(() => <div>Map Options Panel</div>);
  InsertPanelMock.mockImplementation(() => <div>Insert Options Panel</div>);
  WarningPanelMock.mockImplementation(() => <div>Warning Panel</div>);
  LayerSettingsPanelMock.mockImplementation(() => (
    <div>Layer Settings Panel</div>
  ));
});

const insertBaseMapMock = jest.fn();
const deleteBaseMapMock = jest.fn();
const selectBaseMapMock = jest.fn();
const layerInsertMock = jest.fn();
const layerSelectMock = jest.fn();
const layerDeleteMock = jest.fn();
const onUpdateLayerVisibilityMock = jest.fn();
const onCloseMock = jest.fn();
const onPointToLayerMock = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <LayersPanel
      id={""}
      layers={[]}
      sublayers={[]}
      selectedLayerIds={[]}
      type={0}
      baseMaps={[]}
      selectedBaseMapId={""}
      insertBaseMap={insertBaseMapMock}
      selectBaseMap={selectBaseMapMock}
      deleteBaseMap={deleteBaseMapMock}
      onLayerInsert={layerInsertMock}
      onLayerSelect={layerSelectMock}
      onLayerDelete={layerDeleteMock}
      onUpdateSublayerVisibility={onUpdateLayerVisibilityMock}
      onClose={onCloseMock}
      onPointToLayer={onPointToLayerMock}
      {...props}
    />
  );
};

describe("Layers Panel", () => {
  it("Should render LayersPanel", () => {
    const { container } = callRender(renderWithTheme);
    expect(container).toBeInTheDocument();

    // Check Tabs
    expect(screen.getByText("Layers")).toBeInTheDocument();
    expect(screen.getByText("Map Options")).toBeInTheDocument();

    // Check Mocked Close Button
    expect(screen.getByText("Close")).toBeInTheDocument();
    userEvent.click(screen.getByText("Close"));
    expect(onCloseMock).toHaveBeenCalled();

    // Check Layers Control Panel is open and Map Options Panel doesn't
    expect(screen.getByText("Layers Control Panel")).toBeInTheDocument();
    expect(screen.queryByText("Map Options Panel")).not.toBeInTheDocument();

    // Check Map Options Panel is open if click to Map Options Tab.
    userEvent.click(screen.getByText("Map Options"));
    expect(screen.getByText("Map Options Panel")).toBeInTheDocument();
    expect(screen.queryByText("Layers Control Panel")).not.toBeInTheDocument();

    // Check switching back to Layers Tab.
    userEvent.click(screen.getByText("Layers"));
    expect(screen.getByText("Layers Control Panel")).toBeInTheDocument();
    expect(screen.queryByText("Map Options Panel")).not.toBeInTheDocument();
  });

  it("Should be able to insert new Layer", () => {
    callRender(renderWithTheme, {
      layers: [{ id: "test", name: "first", url: "https://first-test.url" }],
    });
     // @ts-expect-error - Property 'mock' does not exist on type
    const { onLayerInsertClick } = LayersControlPanel.mock.lastCall[0];

    act(() => {
      onLayerInsertClick();
    });

    expect(screen.getByText("Insert Options Panel")).toBeInTheDocument();

    const { onInsert } = InsertPanelMock.mock.lastCall[0];

    // Click insert layer
    act(() => {
      onInsert({ name: "test", url: "https://test.url", token: "" });
    });
    expect(layerInsertMock).toHaveBeenCalled();
  });

  it("Should be able to cancel insert new Layer", () => {
    callRender(renderWithTheme, {
      layers: [{ id: "test", name: "first", url: "https://first-test.url" }],
    });
     // @ts-expect-error - Property 'mock' does not exist on type
    const { onLayerInsertClick } = LayersControlPanel.mock.lastCall[0];

    act(() => {
      onLayerInsertClick();
    });

    expect(screen.getByText("Insert Options Panel")).toBeInTheDocument();

    const { onCancel } = InsertPanelMock.mock.lastCall[0];

    // Click cancel insert layer
    act(() => {
      onCancel();
    });

    expect(screen.queryByText("Insert Options Panel")).not.toBeInTheDocument();
  });

  it("Should show duplication layer error in Insert Panel", () => {
    callRender(renderWithTheme, {
      layers: [{ id: "test", name: "first", url: "https://test.url" }],
    });
     // @ts-expect-error - Property 'mock' does not exist on type
    const { onLayerInsertClick } = LayersControlPanel.mock.lastCall[0];

    act(() => {
      onLayerInsertClick();
    });

    expect(screen.getByText("Insert Options Panel")).toBeInTheDocument();

    const { onInsert } = InsertPanelMock.mock.lastCall[0];

    // Click insert layer
    act(() => {
      onInsert({ name: "test", url: "https://test.url", token: "" });
    });
    expect(layerInsertMock).not.toHaveBeenCalled();
    // Should close Insert Lyaer Panel
    expect(screen.queryByText("Insert Options Panel")).not.toBeInTheDocument();
    expect(screen.getByText("Warning Panel")).toBeInTheDocument();

    // Shold be able to close warning panel
    const { onConfirm } = WarningPanelMock.mock.lastCall[0];
    act(() => {
      onConfirm();
    });

    expect(screen.queryByText("Warning Panel")).not.toBeInTheDocument();
  });


  it("Should close duplication warining on click outside", () => {
    callRender(renderWithTheme, {
      layers: [{ id: "test", name: "first", url: "https://test.url" }],
    });
     // @ts-expect-error - Property 'mock' does not exist on type
    const { onLayerInsertClick } = LayersControlPanel.mock.lastCall[0];
    act(() => {
      onLayerInsertClick();
    });
    const { onInsert } = InsertPanelMock.mock.lastCall[0];
    act(() => {
      onInsert({ name: "test", url: "https://test.url", token: "" });
    });
    expect(screen.queryByText("Insert Options Panel")).not.toBeInTheDocument();
    expect(screen.getByText("Warning Panel")).toBeInTheDocument();

    // Click outside
    userEvent.click(screen.getByText("Map Options"));

    expect(screen.queryByText("Warning Panel")).not.toBeInTheDocument();
  });

  it("Should be able to insert baseMap", () => {
    callRender(renderWithTheme);
    // Switch to the MapOptions Tab
    userEvent.click(screen.getByText("Map Options"));

    // Call insert baseMap to show insert panel
    const { insertBaseMap } = MapOptionPanelMock.mock.lastCall[0];
    act(() => {
      insertBaseMap();
    });
    expect(screen.getByText("Insert Options Panel")).toBeInTheDocument();

    const { onInsert } = InsertPanelMock.mock.lastCall[0];
    // Click insert baseMap
    act(() => {
      onInsert({
        name: "test-basemap",
        url: "https://test-base-map.url",
        token: "",
      });
    });

    expect(insertBaseMapMock).toHaveBeenCalled();
  });

  it("Should be able to cancel insert baseMap", () => {
    callRender(renderWithTheme);
    // Switch to the MapOptions Tab
    userEvent.click(screen.getByText("Map Options"));

    // Call insert baseMap to show insert panel
    const { insertBaseMap } = MapOptionPanelMock.mock.lastCall[0];
    act(() => {
      insertBaseMap();
    });
    expect(screen.getByText("Insert Options Panel")).toBeInTheDocument();

    const { onCancel } = InsertPanelMock.mock.lastCall[0];

    // Click cancel insert layer
    act(() => {
      onCancel();
    });

    expect(screen.queryByText("Insert Options Panel")).not.toBeInTheDocument();
  });

  it("Should show layer settings panel", () => {
    callRender(renderWithTheme);
    // @ts-expect-error - Property 'mock' does not exist on type
    const { onLayerSettingsClick } = LayersControlPanel.mock.lastCall[0];
    // Call show layer settings
    act(() => {
      onLayerSettingsClick();
    });

    expect(screen.getByText("Layer Settings Panel")).toBeInTheDocument();

    const { onCloseClick, onBackClick } =
      LayerSettingsPanelMock.mock.lastCall[0];

    // Click insert layer
    act(() => {
      onCloseClick();
    });
    expect(onCloseMock).toHaveBeenCalled();

    // Click insert layer
    act(() => {
      onBackClick();
    });
    expect(screen.queryByText("Layer Settings Panel")).not.toBeInTheDocument();
  });
});
