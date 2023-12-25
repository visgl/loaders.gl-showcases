import { setupStore } from "../store";
import reducer, {
  selectArcGisContentSelected,
  selectSortAscending,
  selectSortColumn,
  selectStatus,
  setSortAscending,
  setSortColumn,
  setArcGisContentSelected,
  resetArcGisContentSelected,
  addArcGisContent,
  deleteArcGisContent,
} from "./arcgis-content-slice";

import { getArcGisUserContent } from "../../utils/arcgis";

jest.mock("../../utils/arcgis");

const getArcGisUserContentMock =
  getArcGisUserContent as unknown as jest.Mocked<any>;

const mockEmailExpected = "usermail@gmail.com";
let mockStorageUserinfo = mockEmailExpected;
const mockInitValueExpected = {
  arcGisContent: [],
  arcGisContentSelected: "",
  sortColumn: "",
  sortAscending: false,
  status: "idle",
};

const contentItem = {
  id: "123",
  name: "NewYork.slpk",
  url: "https://123.com",
  created: 123456,
  title: "New York",
  token: "token-https://123.com",
};

describe("slice: arcgis-content", () => {
  beforeAll(() => {
    getArcGisUserContentMock.mockImplementation(async () => {
      mockStorageUserinfo = mockEmailExpected;
      return mockStorageUserinfo;
    });
  });

  beforeEach(() => {
    mockStorageUserinfo = mockEmailExpected;
  });

  it("Reducer should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual(
      mockInitValueExpected
    );
  });

  it("Selector should return the initial state", () => {
    const store = setupStore();
    const state = store.getState();
    expect(selectStatus(state)).toEqual("idle");
  });

  it("Selector should return the updated sort column", () => {
    const store = setupStore();
    store.dispatch(setSortColumn("title"));
    const state = store.getState();
    expect(selectSortColumn(state)).toEqual("title");
  });

  it("Selector should return the updated sort order", () => {
    const store = setupStore();
    store.dispatch(setSortAscending(true));
    const state = store.getState();
    expect(selectSortAscending(state)).toEqual(true);
  });

  it("Selector should return empty string if no content added", () => {
    const store = setupStore();
    store.dispatch(setArcGisContentSelected("123"));
    const state = store.getState();
    expect(selectArcGisContentSelected(state)).toEqual("");
  });

  it("Selector should return id of selected item", () => {
    const store = setupStore();
    store.dispatch(addArcGisContent(contentItem));
    store.dispatch(setArcGisContentSelected("123"));
    const state = store.getState();
    expect(selectArcGisContentSelected(state)).toEqual("123");
  });

  it("Selector should return empty string if no content added", () => {
    const store = setupStore();
    store.dispatch(addArcGisContent(contentItem));
    store.dispatch(setArcGisContentSelected("123"));
    store.dispatch(deleteArcGisContent("123"));
    const state = store.getState();
    expect(selectArcGisContentSelected(state)).toEqual("");
  });

  it("Selector should return empty string", () => {
    const store = setupStore();
    store.dispatch(addArcGisContent(contentItem));
    store.dispatch(setArcGisContentSelected("123"));
    store.dispatch(resetArcGisContentSelected());
    const state = store.getState();
    expect(selectArcGisContentSelected(state)).toEqual("");
  });
});
