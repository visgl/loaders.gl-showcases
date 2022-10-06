import { act, screen } from "@testing-library/react";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { LayersControlPanel } from "./layers-control-panel";

// Mocked components
import { PlusButton } from "../../plus-button/plus-button";
import { DeleteConfirmation } from "./delete-confirmation";
import { LayerOptionsMenu } from "./layer-options-menu/layer-options-menu";
import { ListItem } from "./list-item/list-item";

jest.mock("./list-item/list-item");
jest.mock("../../plus-button/plus-button");
jest.mock("./delete-confirmation");
jest.mock("./layer-options-menu/layer-options-menu");

const ListItemMock = ListItem as unknown as jest.Mocked<any>;
const PlusButtonMock = PlusButton as unknown as jest.Mocked<any>;
const DeleteConfirmationMock =
  DeleteConfirmation as unknown as jest.Mocked<any>;
const LayerOptionsMenuMock = LayerOptionsMenu as unknown as jest.Mocked<any>;

beforeAll(() => {
  ListItemMock.mockImplementation((props) => (
    <div {...props}>{`ListItem-${props.id}`}</div>
  ));
  PlusButtonMock.mockImplementation(({ children, onClick }) => (
    <div onClick={onClick}>{children}</div>
  ));
  DeleteConfirmationMock.mockImplementation(() => (
    <div>Delete Conformation</div>
  ));
  LayerOptionsMenuMock.mockImplementation(() => <div>Layers Options</div>);
});

const onInsertLayerMock = jest.fn();
const onInsertSceneMock = jest.fn();
const onDeleteLayerMock = jest.fn();
const onSelectLayerMock = jest.fn();
const onLayerSettingsClickMock = jest.fn();
const onPointToLayerMock = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <LayersControlPanel
      onSceneInsertClick={onInsertSceneMock}
      layers={[]}
      selectedLayerIds={[]}
      type={0} // Radio Button type
      hasSettings={false}
      onLayerSelect={onSelectLayerMock}
      onLayerInsertClick={onInsertLayerMock}
      onLayerSettingsClick={onLayerSettingsClickMock}
      onPointToLayer={onPointToLayerMock}
      deleteLayer={onDeleteLayerMock}
      {...props}
    />
  );
};

describe("Layers Control Panel", () => {
  it("Should render LayersControlPanel without layers", () => {
    const { container } = callRender(renderWithTheme);
    expect(container).toBeInTheDocument();

    // Insert Buttons should be present
    expect(screen.getByText("Insert layer")).toBeInTheDocument();
    expect(screen.getByText("Insert scene")).toBeInTheDocument();
  });

  it("Should render LayersControlPanel with layers", () => {
    const { container } = callRender(renderWithTheme, {
      layers: [
        { id: "first", name: "first name", url: "https://first-url.com" },
        { id: "second", name: "second name", url: "https://second-url.com" },
      ],
    });
    expect(container).toBeInTheDocument();

    expect(screen.getByText("ListItem-first")).toBeInTheDocument();
    expect(screen.getByText("ListItem-second")).toBeInTheDocument();
  });

  it("Should be able to call functions", () => {
    const { container } = callRender(renderWithTheme, {
      layers: [
        { id: "first", name: "first name", mapUrl: "https://first-url.com" },
      ],
    });

    expect(container).toBeInTheDocument();

    expect(screen.getByText("ListItem-first")).toBeInTheDocument();

    const { onChange, onOptionsClick, onClickOutside } =
      ListItemMock.mock.lastCall[0];

    act(() => {
      onChange();
    });
    expect(onSelectLayerMock);

    act(() => {
      onOptionsClick();
    });

    act(() => {
      onClickOutside();
    });
  });

  it("Should render conformation panel", () => {
    callRender(renderWithTheme, {
      layers: [
        { id: "first", name: "first name", mapUrl: "https://first-url.com" },
        // Candidate to delete
        { id: "", name: "second name", mapUrl: "https://second-url.com" },
      ],
    });

    expect(screen.getByText("Delete Conformation")).toBeInTheDocument();

    const { onDeleteHandler, onKeepHandler } =
      DeleteConfirmationMock.mock.lastCall[0];

    act(() => {
      onDeleteHandler();
    });

    expect(onDeleteLayerMock).toHaveBeenCalled();

    act(() => {
      onKeepHandler();
    });
  });
});
