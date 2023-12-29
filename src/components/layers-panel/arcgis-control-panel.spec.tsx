import { renderWithThemeProviders } from "../../utils/testing-utils/render-with-theme";
import { screen, within } from "@testing-library/react";
import { setupStore } from "../../redux/store";
import { ArcGisControlPanel } from "./arcgis-control-panel";
import userEvent from "@testing-library/user-event";
import {
  arcGisLogin,
  arcGisLogout,
} from "../../redux/slices/arcgis-auth-slice";
import {
  getAuthenticatedUser,
  arcGisRequestLogin,
  arcGisCompleteLogin,
  arcGisRequestLogout,
} from "../../utils/arcgis";

jest.mock("../../utils/arcgis");

const getAuthenticatedUserMock =
  getAuthenticatedUser as unknown as jest.Mocked<any>;
const arcGisRequestLoginMock =
  arcGisRequestLogin as unknown as jest.Mocked<any>;
const arcGisCompleteLoginMock =
  arcGisCompleteLogin as unknown as jest.Mocked<any>;
const arcGisRequestLogoutMock =
  arcGisRequestLogout as unknown as jest.Mocked<any>;

const EMAIL_EXPECTED = "usermail@gmail.com";
let storageUserinfo = "";

const onArcGisImportMock = jest.fn();

const callRender = (renderFunc, props = {}, store = setupStore()) => {
  return renderFunc(
    <ArcGisControlPanel onArcGisImportClick={onArcGisImportMock} {...props} />,
    store
  );
};

describe("Layers Control Panel - ArcGIS auth", () => {
  beforeAll(() => {
    arcGisRequestLoginMock.mockImplementation(async () => {
      storageUserinfo = EMAIL_EXPECTED;
      return storageUserinfo;
    });
    arcGisCompleteLoginMock.mockImplementation(async () => {
      return storageUserinfo;
    });
    arcGisRequestLogoutMock.mockImplementation(async () => {
      storageUserinfo = "";
      return storageUserinfo;
    });
    getAuthenticatedUserMock.mockImplementation(() => {
      return storageUserinfo;
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

    const logoutUserInfo = await screen.findByText(EMAIL_EXPECTED);
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
