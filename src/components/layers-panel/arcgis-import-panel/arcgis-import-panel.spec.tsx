import { type RenderResult, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithThemeProviders } from "../../../utils/testing-utils/render-with-theme";
import { ArcGisImportPanel } from "./arcgis-import-panel";
import { setupStore } from "../../../redux/store";
import {
  selectArcGisContent,
  getArcGisContent,
} from "../../../redux/slices/arcgis-content-slice";
import { getArcGisUserContent } from "../../../utils/arcgis";

jest.mock("../../../utils/arcgis");

const getArcGisUserContentMock =
  getArcGisUserContent as unknown as jest.Mocked<any>;

const onImportMock = jest.fn();
const onCancelMock = jest.fn();

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

const callRender = (
  renderFunc,
  props = {},
  store = setupStore()
): RenderResult => {
  return renderFunc(
    <ArcGisImportPanel
      onImport={onImportMock}
      onCancel={onCancelMock}
      {...props}
    />,
    store
  );
};

describe("Import panel", () => {
  beforeAll(() => {
    getArcGisUserContentMock.mockImplementation(async () => {
      return CONTENT_EXPECTED;
    });
  });

  it("Should render import panel", async () => {
    const store = setupStore();
    await store.dispatch(getArcGisContent());
    const { container } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText("Select map to import")).toBeInTheDocument();
    expect(screen.getByText("Import Selected")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
  });

  it("Should close the dialog", async () => {
    const store = setupStore();
    callRender(renderWithThemeProviders, undefined, store);

    const cross = document.querySelector("svg");
    cross && (await userEvent.click(cross));
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it("Should import an item", async () => {
    const store = setupStore();
    callRender(renderWithThemeProviders, undefined, store);
    await store.dispatch(getArcGisContent());

    const importSelected = screen.getByText("Import Selected");

    // No item is selected yet.
    importSelected && (await userEvent.click(importSelected));
    expect(onImportMock).toHaveBeenCalledTimes(0);

    // Select an item to import
    const row = screen.getByText("City-123");
    row && (await userEvent.click(row));

    importSelected && (await userEvent.click(importSelected));
    expect(onImportMock).toHaveBeenCalledTimes(1);
  });

  it("Should change the sorting order", async () => {
    const store = setupStore();
    callRender(renderWithThemeProviders, undefined, store);
    await store.dispatch(getArcGisContent());

    let state = store.getState();
    let cont = selectArcGisContent(state);

    const title = screen.getByText("Title");

    title && (await userEvent.click(title));
    state = store.getState();
    cont = selectArcGisContent(state);
    expect(cont[0].id).toBe("123");

    title && (await userEvent.click(title));
    state = store.getState();
    cont = selectArcGisContent(state);
    expect(cont[0].id).toBe("789");

    const date = screen.getByText("Date");

    date && (await userEvent.click(date));
    state = store.getState();
    cont = selectArcGisContent(state);
    expect(cont[0].id).toBe("789");

    date && (await userEvent.click(date));
    state = store.getState();
    cont = selectArcGisContent(state);
    expect(cont[0].id).toBe("123");

    date && (await userEvent.click(date));
    state = store.getState();
    cont = selectArcGisContent(state);
    expect(cont[0].id).toBe("789");
  });
});
