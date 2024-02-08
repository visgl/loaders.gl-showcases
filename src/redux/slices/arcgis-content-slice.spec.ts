import { setupStore } from "../store";
import reducer, {
  selectArcGisContent,
  selectArcGisContentSelected,
  selectSortAscending,
  selectSortColumn,
  selectStatus,
  setSortAscending,
  setSortColumn,
  setArcGisContentSelected,
  resetArcGisContentSelected,
  getArcGisContent,
} from "./arcgis-content-slice";

import { getArcGisUserContent } from "../../utils/arcgis";

jest.mock("../../utils/arcgis");
const getArcGisUserContentMock =
  getArcGisUserContent as unknown as jest.Mocked<any>;

const CONTENT_EXPECTED = [
  {
    id: "123",
    name: "123.slpk",
    url: "https://123.com",
    created: 123453,
    title: "City-123",
    token: "token-https://123.com",
  },
  {
    id: "789",
    name: "789.slpk",
    url: "https://789.com",
    created: 123457,
    title: "City-789",
    token: "token-https://789.com",
  },
  {
    id: "456",
    name: "456.slpk",
    url: "https://456.com",
    created: 123454,
    title: "City-456",
    token: "token-https://456.com",
  },
];

const CONTENT_SORTED_EXPECTED = [
  {
    id: "123",
    name: "123.slpk",
    url: "https://123.com",
    created: 123453,
    title: "City-123",
    token: "token-https://123.com",
  },
  {
    id: "456",
    name: "456.slpk",
    url: "https://456.com",
    created: 123454,
    title: "City-456",
    token: "token-https://456.com",
  },
  {
    id: "789",
    name: "789.slpk",
    url: "https://789.com",
    created: 123457,
    title: "City-789",
    token: "token-https://789.com",
  },
];

const INIT_VALUE_EXPECTED = {
  arcGisContent: [],
  arcGisContentSelected: "",
  sortColumn: null,
  sortAscending: true,
  status: "idle",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("slice: arcgis-content", () => {
  beforeAll(() => {
    getArcGisUserContentMock.mockImplementation(async () => {
      sleep(10);
      return CONTENT_EXPECTED;
    });
  });

  it("Reducer should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual(
      INIT_VALUE_EXPECTED
    );
  });

  it("Selector should return the initial state", () => {
    const store = setupStore();
    const state = store.getState();
    expect(selectStatus(state)).toEqual("idle");
  });

  it("Selector should return 'loading' status", () => {
    const store = setupStore();
    /* No await! */ store.dispatch(getArcGisContent());
    const state = store.getState();
    expect(selectStatus(state)).toEqual("loading");
  });

  it("Selector should return empty string if no content added", () => {
    const store = setupStore();
    store.dispatch(setArcGisContentSelected("123"));
    const state = store.getState();
    expect(selectArcGisContentSelected(state)).toEqual("");
  });

  it("Selector should return id of selected item", async () => {
    const store = setupStore();
    await store.dispatch(getArcGisContent());
    store.dispatch(setArcGisContentSelected("456"));
    const state = store.getState();
    expect(selectArcGisContentSelected(state)).toEqual("456");
  });

  it("Selector should return empty string if nothing is selected", async () => {
    const store = setupStore();
    await store.dispatch(getArcGisContent());
    store.dispatch(setArcGisContentSelected("123"));
    store.dispatch(resetArcGisContentSelected());
    const state = store.getState();
    expect(selectArcGisContentSelected(state)).toEqual("");
  });

  it("Selector should return content received (unsorted)", async () => {
    const store = setupStore();
    await store.dispatch(getArcGisContent());
    const state = store.getState();
    expect(selectArcGisContent(state)).toEqual(CONTENT_EXPECTED);
    expect(selectStatus(state)).toEqual("idle");
  });

  it("Selector should return content received (sorted)", async () => {
    const store = setupStore();
    store.dispatch(setSortColumn("title"));
    store.dispatch(setSortAscending(true));

    await store.dispatch(getArcGisContent());
    let state = store.getState();
    expect(selectSortColumn(state)).toEqual("title");
    expect(selectSortAscending(state)).toEqual(true);
    expect(selectArcGisContent(state)).toEqual(CONTENT_SORTED_EXPECTED);

    store.dispatch(setSortColumn("created"));
    store.dispatch(setSortAscending(true));
    state = store.getState();
    expect(selectArcGisContent(state)).toEqual(CONTENT_SORTED_EXPECTED);
  });
});
