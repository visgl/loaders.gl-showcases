import { act, screen, within } from "@testing-library/react";
import { renderWithThemeProviders } from "../../utils/testing-utils/render-with-theme";
import { LayersControlPanel } from "./layers-control-panel";
import userEvent from "@testing-library/user-event";
import {
  arcGisLogin,
  arcGisLogout,
} from "../../redux/slices/arcgis-auth-slice";

// Mocked components
import { ActionIconButton } from "../action-icon-button/action-icon-button";
import { DeleteConfirmation } from "./delete-confirmation";
import { LayerOptionsMenu } from "./layer-options-menu/layer-options-menu";
import { ListItem } from "./list-item/list-item";
import { setupStore } from "../../redux/store";

import {
  getAuthenticatedUser,
  arcGisRequestLogin,
  arcGisCompleteLogin,
  arcGisRequestLogout,
} from "../../utils/arcgis";

jest.mock("./list-item/list-item");
jest.mock("../action-icon-button/action-icon-button");
jest.mock("./delete-confirmation");
jest.mock("./layer-options-menu/layer-options-menu");
jest.mock("../../utils/arcgis");

const ListItemMock = ListItem as unknown as jest.Mocked<any>;
const PlusButtonMock = ActionIconButton as unknown as jest.Mocked<any>;
const DeleteConfirmationMock =
  DeleteConfirmation as unknown as jest.Mocked<any>;
const LayerOptionsMenuMock = LayerOptionsMenu as unknown as jest.Mocked<any>;

const getAuthenticatedUserMock =
  getAuthenticatedUser as unknown as jest.Mocked<any>;
const arcGisRequestLoginMock =
  arcGisRequestLogin as unknown as jest.Mocked<any>;
const arcGisCompleteLoginMock =
  arcGisCompleteLogin as unknown as jest.Mocked<any>;
const arcGisRequestLogoutMock =
  arcGisRequestLogout as unknown as jest.Mocked<any>;

const mockEmailExpected = "usermail@gmail.com";
let mockStorageUserinfo = "";

const onInsertLayerMock = jest.fn();
const onInsertSceneMock = jest.fn();
const onDeleteLayerMock = jest.fn();
const onSelectLayerMock = jest.fn();
const onLayerSettingsClickMock = jest.fn();
const onPointToLayerMock = jest.fn();
const onArcGisImportMock = jest.fn();

const callRender = (renderFunc, props = {}, store = setupStore()) => {
  return renderFunc(
    <LayersControlPanel
      onSceneInsertClick={onInsertSceneMock}
      onArcGisImportClick={onArcGisImportMock}
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

describe("Layers Control Panel - ArcGIS auth", () => {
  beforeAll(() => {
    arcGisRequestLoginMock.mockImplementation(async () => {
      mockStorageUserinfo = mockEmailExpected;
      return mockStorageUserinfo;
    });
    arcGisCompleteLoginMock.mockImplementation(async () => {
      return mockStorageUserinfo;
    });
    arcGisRequestLogoutMock.mockImplementation(async () => {
      mockStorageUserinfo = "";
      return mockStorageUserinfo;
    });
    getAuthenticatedUserMock.mockImplementation(() => {
      return mockStorageUserinfo;
    });
  });

  it("Should render ArcGIS Login button", async () => {
    const store = setupStore();
    // Let's Log out...
    await store.dispatch(arcGisLogout());
    const { container } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    expect(container).toBeInTheDocument();
    expect(arcGisRequestLogoutMock).toHaveBeenCalledTimes(1);

    // We are in the "Logged out" state, so the "Log in" button should be there.
    const loginButton = await screen.findByText("Login to ArcGIS");
    expect(loginButton).toBeInTheDocument();
    loginButton && userEvent.click(loginButton);
    expect(arcGisRequestLoginMock).toHaveBeenCalledTimes(1);

    const importButton = screen.queryByText("Import from ArcGIS");
    expect(importButton).not.toBeInTheDocument();
  });

  it("Should render ArcGIS Import and Logout buttons", async () => {
    const store = setupStore();
    // Let's Log in...
    await store.dispatch(arcGisLogin());
    const { container } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    expect(container).toBeInTheDocument();
    expect(arcGisRequestLoginMock).toHaveBeenCalledTimes(1);

    // We are in the "Logged in" state, so the "Log in" button should NOT be there.
    const importButton = await screen.findByText("Import from ArcGIS");
    expect(importButton).toBeInTheDocument();

    const logoutUserInfo = await screen.findByText(mockEmailExpected);
    expect(logoutUserInfo).toBeInTheDocument();

    const loginButton = screen.queryByText("Login to ArcGIS");
    expect(loginButton).not.toBeInTheDocument();
  });

  it("Should respond to action on the ArcGIS Login button", async () => {
    const store = setupStore();
    // Let's Log out...
    await store.dispatch(arcGisLogout());
    const { container } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    expect(container).toBeInTheDocument();

    const loginButton = screen.getByText("Login to ArcGIS");
    loginButton && userEvent.click(loginButton);
    expect(arcGisRequestLoginMock).toHaveBeenCalledTimes(1);

    const importButton = await screen.findByText("Import from ArcGIS");
    expect(importButton).toBeInTheDocument();

    const loginButtonHidden = screen.queryByText("Login to ArcGIS");
    expect(loginButtonHidden).not.toBeInTheDocument();
  });

  it("Should respond to action on ArcGIS Logout button", async () => {
    const store = setupStore();
    // Let's Log in...
    await store.dispatch(arcGisLogin());
    const { container } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );

    const logoutButton = await screen.findByTestId("userinfo-button");
    logoutButton && userEvent.click(logoutButton);

    const modalDialog = await screen.findByTestId("modal-dialog-content");
    expect(modalDialog).toContainHTML("Are you sure you want to log out?");

    const cancelButton = within(modalDialog).getByText("Log out");
    cancelButton && userEvent.click(cancelButton);

    const modalDialogHidden = screen.queryByTestId("modal-dialog-content");
    expect(modalDialogHidden).not.toBeInTheDocument();

    const loginButton = await screen.findByText("Login to ArcGIS");
    expect(loginButton).toBeInTheDocument();
  });
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
