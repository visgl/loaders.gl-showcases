import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupStore } from "../../../redux/store";
import { renderWithThemeProviders } from "../../../utils/testing-utils/render-with-theme";
import { BasemapListPanel } from "./basemap-list-panel";

import { DeleteConfirmation } from "../delete-confirmation";
import {
  addBaseMap,
  selectSelectedBaseMap,
  selectBaseMapsByGroup,
} from "../../../redux/slices/base-maps-slice";
import { BaseMapGroup } from "../../../types";

jest.mock("../delete-confirmation");

const DeleteConfirmationMock =
  DeleteConfirmation as unknown as jest.Mocked<any>;

beforeAll(() => {
  DeleteConfirmationMock.mockImplementation(() => (
    <div>Delete Confirmation</div>
  ));
});

const callRender = (renderFunc, props = {}, store = setupStore()) => {
  return renderFunc(
    <BasemapListPanel group={BaseMapGroup.Maplibre} {...props} />,
    store
  );
};

describe("Basemap List Panel", () => {
  it("Should render basemaps", async () => {
    const store = setupStore();
    const { container } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    expect(container).toBeInTheDocument();

    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("Light")).toBeInTheDocument();
  });

  it("Should select a map", async () => {
    const store = setupStore();
    store.dispatch(
      addBaseMap({
        id: "first",
        name: "first name",
        mapUrl: "https://first-url.com",
        group: BaseMapGroup.Maplibre,
        iconId: "Dark",
      })
    );
    // Element "first" is added and made selected
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
    await act(async () => {
      iconWrapperElement && (await userEvent.click(iconWrapperElement));
    });

    const state = store.getState();
    const baseMapId = selectSelectedBaseMap(state)?.id;
    expect(baseMapId).toEqual("first");
  });

  it("Should render options menu, keep or delete a map", async () => {
    const store = setupStore();
    store.dispatch(
      // Candidate to delete
      addBaseMap({
        id: "custom",
        name: "custom name",
        mapUrl: "https://first-url.com",
        group: BaseMapGroup.Maplibre,
        iconId: "Light",
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

    let state = store.getState();
    let baseMaps = selectBaseMapsByGroup(state, "");

    expect(baseMaps.find((item) => item.id === "custom")).not.toBeUndefined();

    const iconWrapperElement = el.parentElement;
    const optionsElement = iconWrapperElement?.lastElementChild;

    // Keep a map
    // Click on options menu
    await act(async () => {
      optionsElement && (await userEvent.click(optionsElement));
    });

    let optionsMenu = screen.getByText("Delete map");
    expect(optionsMenu).toBeInTheDocument();

    // Click on Delete Map
    await act(async () => {
      optionsMenu && (await userEvent.click(optionsMenu));
    });

    let confirmation = screen.getByText("Delete Confirmation");
    expect(confirmation).toBeInTheDocument();

    const { onKeepHandler } = DeleteConfirmationMock.mock.lastCall[0];

    act(() => {
      onKeepHandler();
    });

    state = store.getState();
    baseMaps = selectBaseMapsByGroup(state, "");
    expect(baseMaps.find((item) => item.id === "custom")).not.toBeUndefined();

    // Delete a map
    // Click on options menu
    await act(async () => {
      optionsElement && (await userEvent.click(optionsElement));
    });

    optionsMenu = screen.getByText("Delete map");
    expect(optionsMenu).toBeInTheDocument();

    // Click on Delete Map
    await act(async () => {
      optionsMenu && (await userEvent.click(optionsMenu));
    });

    confirmation = screen.getByText("Delete Confirmation");
    expect(confirmation).toBeInTheDocument();

    const { onDeleteHandler } = DeleteConfirmationMock.mock.lastCall[0];

    act(() => {
      onDeleteHandler();
    });

    state = store.getState();
    baseMaps = selectBaseMapsByGroup(state, "");
    expect(baseMaps.find((item) => item.id === "custom")).toBeUndefined();
  });

  it("Should close options menu if clicked outside", async () => {
    const store = setupStore();
    store.dispatch(
      // Candidate to delete
      addBaseMap({
        id: "custom",
        name: "custom name",
        mapUrl: "https://first-url.com",
        group: BaseMapGroup.Maplibre,
        iconId: "Light",
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
    await act(async () => {
      optionsElement && (await userEvent.click(optionsElement));
    });

    const optionsMenu = screen.getByText("Delete map");
    expect(optionsMenu).toBeInTheDocument();

    // Click on out of options menu
    const elOutside = screen.getByText("Dark");
    await act(async () => {
      elOutside && (await userEvent.click(elOutside));
    });

    const optionsMenuClosed = screen.queryByText("Delete map");
    expect(optionsMenuClosed).not.toBeInTheDocument();
  });
});
