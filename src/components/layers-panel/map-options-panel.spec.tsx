import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { MapOptionPanel } from "./map-options-panel";

import { BaseMapListItem } from "./base-map-list-item/base-map-list-item";
import { PlusButton } from "../plus-button/plus-button";
import { DeleteConfirmation } from "./delete-confirmation";
import { BaseMapOptionsMenu } from "./basemap-options-menu/basemap-options-menu";

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
const onDeleteBaseMapMock = jest.fn();
const onSelectBaseMapMock = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <MapOptionPanel
      //      baseMaps={[]}
      //selectedBaseMapId={""}
      //selectBaseMap={onSelectBaseMapMock}
      insertBaseMap={onInsertBaseMapMock}
      //deleteBaseMap={onDeleteBaseMapMock}
      {...props}
    />
  );
};

describe("Map Options Panel", () => {
  it("Should render without basemaps", () => {
    const { container } = callRender(renderWithTheme);
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
    const { container } = callRender(renderWithTheme, {
      baseMaps: [
        { id: "first", name: "first name", mapUrl: "https://first-url.com" },
        { id: "second", name: "second name", mapUrl: "https://second-url.com" },
      ],
    });

    expect(container).toBeInTheDocument();

    expect(screen.getByText("BaseMap ListItem-first")).toBeInTheDocument();
    expect(screen.getByText("BaseMap ListItem-second")).toBeInTheDocument();
  });

  it("Should be able to call functions", () => {
    const { container } = callRender(renderWithTheme, {
      baseMaps: [
        { id: "first", name: "first name", mapUrl: "https://first-url.com" },
      ],
    });

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
    expect(onSelectBaseMapMock).toHaveBeenCalled();

    act(() => {
      onClickOutside();
    });
  });

  it("Should render conformation panel", () => {
    callRender(renderWithTheme, {
      baseMaps: [
        { id: "first", name: "first name", mapUrl: "https://first-url.com" },
        // Candidate to delete
        { id: "", name: "second name", mapUrl: "https://second-url.com" },
      ],
    });

    expect(screen.getByText("Delete Conformation")).toBeInTheDocument();

    const { onDeleteHandler, onKeepHandler } =
      DeleteConfirmationMock.mock.lastCall[0];

    act(() => {
      onDeleteHandler();
    });

    expect(onDeleteBaseMapMock).toHaveBeenCalled();

    act(() => {
      onKeepHandler();
    });
  });
});
