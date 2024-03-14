import { setupStore } from "../store";
import reducer, {
  selectUser,
  arcGisLogin,
  arcGisLogout,
} from "./arcgis-auth-slice";

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
let storageUserinfo = EMAIL_EXPECTED;

describe("slice: arcgis-auth", () => {
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

  beforeEach(() => {
    storageUserinfo = EMAIL_EXPECTED;
  });

  it("Reducer should return the initial state", () => {
    expect(reducer(undefined, { type: "none" })).toEqual({
      user: EMAIL_EXPECTED,
    });
  });

  it("Selector should return the initial state", () => {
    const store = setupStore();
    const state = store.getState();
    expect(selectUser(state)).toEqual(EMAIL_EXPECTED);
  });

  it("Selector should return the updated value after Login", async () => {
    const store = setupStore();
    await store.dispatch(arcGisLogin());
    const state = store.getState();
    expect(selectUser(state)).toEqual(EMAIL_EXPECTED);
  });

  it("Selector should return the updated value after Logout", async () => {
    const store = setupStore();
    await store.dispatch(arcGisLogout());
    const state = store.getState();
    expect(selectUser(state)).toEqual("");
  });
});
