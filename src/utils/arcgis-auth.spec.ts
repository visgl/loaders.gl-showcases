import {
  getAuthenticatedUser,
  arcGisRequestLogin,
  arcGisRequestLogout,
} from "./arcgis-auth";

jest.mock("@esri/arcgis-rest-request");

const ARCGIS_REST_USER_INFO = "__ARCGIS_REST_USER_INFO__";
const mockEmailExpected = "usermail@gmail.com";

let OLD_ENV = {};

beforeAll(() => {
  OLD_ENV = process.env;
});

describe("getAuthenticatedUser", () => {
  beforeEach(() => {
    jest.resetModules(); // Clear the cache
    process.env = { ...OLD_ENV };
    process.env.REACT_APP_ARCGIS_REST_CLIENT_ID = "CLIENT_ID";
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("Should return email", () => {
    localStorage.setItem(ARCGIS_REST_USER_INFO, mockEmailExpected);
    const email = getAuthenticatedUser();
    expect(email).toEqual(mockEmailExpected);
  });

  it("Should return session", async () => {
    const email = await arcGisRequestLogin();
    expect(email).toBe(mockEmailExpected);
  });

  it("Should return empty session", async () => {
    const email = await arcGisRequestLogout();
    expect(email).toBe("");
  });
});
