import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithThemeProviders } from "../../utils/testing-utils/render-with-theme";
import { MapOptionPanel } from "./map-options-panel";

import { BaseMapListItem } from "./base-map-list-item/base-map-list-item";
import { PlusButton } from "../plus-button/plus-button";
import { DeleteConfirmation } from "./delete-confirmation";
import { BaseMapOptionsMenu } from "./basemap-options-menu/basemap-options-menu";
import { setupStore } from "../../redux/store";
import {
  setInitialBaseMaps,
  setBaseMaps,
  selectBaseMaps,
  selectSelectedBaseMaps,
} from "../../redux/slices/base-maps-slice";

jest.mock("./base-map-list-item/base-map-list-item");
jest.mock("../plus-button/plus-button");
jest.mock("./delete-confirmation");
jest.mock("./basemap-options-menu/basemap-options-menu");

const BaseMapListItemMock = BaseMapListItem as unknown as jest.Mocked<any>;
const PlusButtonMock = PlusButton as unknown as jest.Mocked<any>;
const DeleteConfirmationMock =
  DeleteConfirmation as unknown as jest.Mocked<any>;
const BaseMapOptionsMenuMock =
  BaseMapOptionsMenu as unknown as jest.Mocked<any>;

beforeAll(() => {
  BaseMapListItemMock.mockImplementation((props) => (
    <div {...props}>{`BaseMap ListItem-${props.id}`}</div>
  ));
  PlusButtonMock.mockImplementation(({ children, onClick }) => (
    <div onClick={onClick}>{children}</div>
  ));
  DeleteConfirmationMock.mockImplementation(() => (
    <div>Delete Conformation</div>
  ));
  BaseMapOptionsMenuMock.mockImplementation(() => <div>BaseMap Options</div>);
});

const onInsertBaseMapMock = jest.fn();

const callRender = (renderFunc, props = {}, store = setupStore()) => {
  return renderFunc(
    <MapOptionPanel insertBaseMap={onInsertBaseMapMock} {...props} />,
    store
  );
};

describe("Map Options Panel", () => {
  it("Should render without basemaps", () => {
    const store = setupStore();
    store.dispatch(setInitialBaseMaps());
    const { container } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    expect(container).toBeInTheDocument();
    // Title shold be present
    expect(screen.getByText("Base Map")).toBeInTheDocument();
    // Insert Button should be present
    const insertBaseMapButton = screen.getByText("Insert Base Map");
    expect(insertBaseMapButton).toBeInTheDocument();
    // Should be able to click on insert button
    userEvent.click(insertBaseMapButton);
    expect(onInsertBaseMapMock).toHaveBeenCalled();
  });

  it("Should render base maps", () => {
    const store = setupStore();
    store.dispatch(
      setBaseMaps({
        id: "first",
        name: "first name",
        mapUrl: "https://first-url.com",
      })
    );
    store.dispatch(
      setBaseMaps({
        id: "second",
        name: "second name",
        mapUrl: "https://second-url.com",
      })
    );
    const { container } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    expect(container).toBeInTheDocument();

    expect(screen.getByText("BaseMap ListItem-first")).toBeInTheDocument();
    expect(screen.getByText("BaseMap ListItem-second")).toBeInTheDocument();
  });

  it("Should be able to call functions", () => {
    const store = setupStore();
    store.dispatch(
      setBaseMaps({
        id: "first",
        name: "first name",
        mapUrl: "https://first-url.com",
      })
    );
    const { container } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    expect(container).toBeInTheDocument();

    expect(screen.getByText("BaseMap ListItem-first")).toBeInTheDocument();

    const { onOptionsClick, onMapsSelect, onClickOutside } =
      BaseMapListItemMock.mock.lastCall[0];

    act(() => {
      onOptionsClick();
    });

    act(() => {
      onMapsSelect();
    });

    const state = store.getState();
    const baseMapId = selectSelectedBaseMaps(state);
    expect(baseMapId).toEqual("first");

    act(() => {
      onClickOutside();
    });
  });

  it("Should render conformation panel", () => {
    const store = setupStore();
    store.dispatch(
      setBaseMaps({
        id: "first",
        name: "first name",
        mapUrl: "https://first-url.com",
      })
    );
    store.dispatch(
      // Candidate to delete
      setBaseMaps({
        id: "",
        name: "second name",
        mapUrl: "https://second-url.com",
      })
    );
    callRender(renderWithThemeProviders, undefined, store);
    expect(screen.getByText("Delete Conformation")).toBeInTheDocument();

    const { onDeleteHandler, onKeepHandler } =
      DeleteConfirmationMock.mock.lastCall[0];

    act(() => {
      onDeleteHandler();
    });

    const state = store.getState();
    const baseMap = selectBaseMaps(state);
    expect(baseMap).toEqual([
      {
        id: "Dark",
        mapUrl:
          "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
        name: "Dark",
      },
      {
        id: "Light",
        mapUrl:
          "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
        name: "Light",
      },
      { id: "Terrain", mapUrl: "", name: "Terrain" },
      { id: "first", mapUrl: "https://first-url.com", name: "first name" },
    ]);

    act(() => {
      onKeepHandler();
    });
  });
});
