import { act, screen } from "@testing-library/react";
import { renderWithThemeProviders } from "../../utils/testing-utils/render-with-theme";
import { LayersControlPanel } from "./layers-control-panel";

// Mocked components
import { ActionIconButton } from "../action-icon-button/action-icon-button";
import { DeleteConfirmation } from "./delete-confirmation";
import { LayerOptionsMenu } from "./layer-options-menu/layer-options-menu";
import { ListItem } from "./list-item/list-item";
import { setupStore } from "../../redux/store";

jest.mock("./list-item/list-item");
jest.mock("../action-icon-button/action-icon-button");
jest.mock("./delete-confirmation");
jest.mock("./layer-options-menu/layer-options-menu");

const ListItemMock = ListItem as unknown as jest.Mocked<any>;
const PlusButtonMock = ActionIconButton as unknown as jest.Mocked<any>;
const DeleteConfirmationMock =
  DeleteConfirmation as unknown as jest.Mocked<any>;
const LayerOptionsMenuMock = LayerOptionsMenu as unknown as jest.Mocked<any>;

const onInsertLayerMock = jest.fn();
const onInsertSceneMock = jest.fn();
const onDeleteLayerMock = jest.fn();
const onSelectLayerMock = jest.fn();
const onLayerSettingsClickMock = jest.fn();
const onPointToLayerMock = jest.fn();

const callRender = (renderFunc, props = {}, store = setupStore()) => {
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
    />,
    store
  );
};

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

describe("Layers Control Panel", () => {
  it("Should render LayersControlPanel without layers", () => {
    const store = setupStore();
    const { container } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    expect(container).toBeInTheDocument();

    // Insert Buttons should be present
    expect(screen.getByText("Insert layer")).toBeInTheDocument();
    expect(screen.getByText("Insert scene")).toBeInTheDocument();
  });

  it("Should render LayersControlPanel with layers", () => {
    const store = setupStore();
    const { container } = callRender(
      renderWithThemeProviders,
      {
        layers: [
          { id: "first", name: "first name", url: "https://first-url.com" },
          { id: "second", name: "second name", url: "https://second-url.com" },
          {
            id: "third",
            name: "third name",
            url: "",
            layers: [
              {
                id: "fourth",
                name: "fourth name",
                url: "https://fourth-url.com",
              },
              { id: "fith", name: "fith name", url: "https://fith-url.com" },
              {
                id: "sixth",
                name: "sixth name",
                url: "https://sixth-url.com",
                layers: [
                  {
                    id: "seventh",
                    name: "seventh name",
                    url: "https://seventh-url.com",
                  },
                ],
              },
            ],
          },
        ],
      },
      store
    );
    expect(container).toBeInTheDocument();

    expect(screen.getByText("ListItem-first")).toBeInTheDocument();
    expect(screen.getByText("ListItem-second")).toBeInTheDocument();
    expect(screen.getByText("ListItem-third")).toBeInTheDocument();
    expect(screen.getByText("ListItem-fourth")).toBeInTheDocument();
    expect(screen.getByText("ListItem-fith")).toBeInTheDocument();
    expect(screen.getByText("ListItem-sixth")).toBeInTheDocument();
    expect(screen.getByText("ListItem-seventh")).toBeInTheDocument();
  });

  it("Should be able to call functions", () => {
    const { container } = callRender(renderWithThemeProviders, {
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
    callRender(renderWithThemeProviders, {
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
