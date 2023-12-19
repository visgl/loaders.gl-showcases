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
} from "../../utils/arcgis-auth";

jest.mock("../../utils/arcgis-auth");

const getAuthenticatedUserMock =
  getAuthenticatedUser as unknown as jest.Mocked<any>;
const arcGisRequestLoginMock =
  arcGisRequestLogin as unknown as jest.Mocked<any>;
const arcGisCompleteLoginMock =
  arcGisCompleteLogin as unknown as jest.Mocked<any>;
const arcGisRequestLogoutMock =
  arcGisRequestLogout as unknown as jest.Mocked<any>;

const mockEmailExpected = "usermail@gmail.com";
let mockStorageUserinfo = mockEmailExpected;

describe("slice: arcgis-auth", () => {
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

  beforeEach(() => {
    mockStorageUserinfo = mockEmailExpected;
  });

  it("Reducer should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual({
      user: mockEmailExpected,
    });
  });

  it("Selector should return the initial state", () => {
    const store = setupStore();
    const state = store.getState();
    expect(selectUser(state)).toEqual(mockEmailExpected);
  });

  it("Selector should return the updated value after Login", async () => {
    const store = setupStore();
    await store.dispatch(arcGisLogin());
    const state = store.getState();
    expect(selectUser(state)).toEqual(mockEmailExpected);
  });

  it("Selector should return the updated value after Logout", async () => {
    const store = setupStore();
    await store.dispatch(arcGisLogout());
    const state = store.getState();
    expect(selectUser(state)).toEqual("");
  });
});
