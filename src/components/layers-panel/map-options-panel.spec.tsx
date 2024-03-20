import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithThemeProviders } from "../../utils/testing-utils/render-with-theme";
import { MapOptionPanel } from "./map-options-panel";

import { ActionIconButton } from "../action-icon-button/action-icon-button";
import { DeleteConfirmation } from "./delete-confirmation";
import { BaseMapOptionsMenu } from "./basemap-options-menu/basemap-options-menu";
import { setupStore } from "../../redux/store";
import {
  addBaseMap,
  selectSelectedBaseMapId,
} from "../../redux/slices/base-maps-slice";
import { BaseMapGroup } from "../../types";

jest.mock("@loaders.gl/i3s", () => {
  return jest.fn().mockImplementation(() => {
    return null;
  });
});

jest.mock("../action-icon-button/action-icon-button");
jest.mock("./delete-confirmation");
jest.mock("./basemap-options-menu/basemap-options-menu");

const PlusButtonMock = ActionIconButton as unknown as jest.Mocked<any>;
const DeleteConfirmationMock =
  DeleteConfirmation as unknown as jest.Mocked<any>;
const BaseMapOptionsMenuMock =
  BaseMapOptionsMenu as unknown as jest.Mocked<any>;

beforeAll(() => {
  PlusButtonMock.mockImplementation(({ children, onClick }) => (
    <div onClick={onClick}>{children}</div>
  ));
  DeleteConfirmationMock.mockImplementation(() => (
    <div>Delete Confirmation</div>
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
      addBaseMap({
        id: "first",
        name: "first name",
        mapUrl: "https://first-url.com",
        group: BaseMapGroup.Maplibre,
      })
    );
    store.dispatch(
      addBaseMap({
        id: "second",
        name: "second name",
        mapUrl: "https://second-url.com",
        group: BaseMapGroup.Maplibre,
      })
    );
    const { container } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    expect(container).toBeInTheDocument();

    expect(screen.getByText("first name")).toBeInTheDocument();
    expect(screen.getByText("second name")).toBeInTheDocument();
  });

  it("Should select a map", () => {
    const store = setupStore();
    store.dispatch(
      addBaseMap({
        id: "first",
        name: "first name",
        mapUrl: "https://first-url.com",
        group: BaseMapGroup.Maplibre,
      })
    );
    // Element "first" is added and made selected
    store.dispatch(
      addBaseMap({
        id: "second",
        name: "second name",
        mapUrl: "https://second-url.com",
        group: BaseMapGroup.Maplibre,
      })
    );
    // Element "second" is added and made selected
    const { container } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    expect(container).toBeInTheDocument();
    const el = screen.getByText("first name");
    expect(el).toBeInTheDocument();

    const iconWrapperElement = el.parentElement;
    // Select "first" element
    act(() => {
      iconWrapperElement && userEvent.click(iconWrapperElement);
    });

    const state = store.getState();
    const baseMapId = selectSelectedBaseMapId(state);
    expect(baseMapId).toEqual("first");
  });

  it("Should render options menu", () => {
    const store = setupStore();
    store.dispatch(
      addBaseMap({
        id: "first",
        name: "first name",
        mapUrl: "https://first-url.com",
        group: BaseMapGroup.Maplibre,
      })
    );
    store.dispatch(
      // Candidate to delete
      addBaseMap({
        id: "custom",
        name: "custom name",
        mapUrl: "https://first-url.com",
        group: BaseMapGroup.Maplibre,
        custom: true,
      })
    );
    const { container } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    expect(container).toBeInTheDocument();
    const el = screen.getByText("custom name");
    expect(el).toBeInTheDocument();

    const iconWrapperElement = el.parentElement;
    const optionsElement = iconWrapperElement?.lastElementChild;
    // Click on options menu
    act(() => {
      optionsElement && userEvent.click(optionsElement);
    });

    const optionsMenu = screen.getByText("BaseMap Options");
    expect(optionsMenu).toBeInTheDocument();
  });
});
