import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithThemeProviders } from "../../utils/testing-utils/render-with-theme";
import { MapOptionPanel } from "./map-options-panel";

import { ActionIconButton } from "../action-icon-button/action-icon-button";
import { setupStore } from "../../redux/store";

jest.mock("../action-icon-button/action-icon-button");

const PlusButtonMock = ActionIconButton as unknown as jest.Mocked<any>;

beforeAll(() => {
  PlusButtonMock.mockImplementation(({ children, onClick }) => (
    <div onClick={onClick}>{children}</div>
  ));
});

const onInsertBaseMapMock = jest.fn();

const callRender = (renderFunc, props = {}, store = setupStore()) => {
  return renderFunc(
    <MapOptionPanel insertBaseMap={onInsertBaseMapMock} {...props} />,
    store
  );
};

describe("Map Options Panel", () => {
  it("Should render panel", async () => {
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
  });

  it("Should click Insert button", async () => {
    const store = setupStore();
    const { container } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    expect(container).toBeInTheDocument();
    const insertBaseMapButton = screen.getByText("Insert Base Map");
    // Should be able to click on insert button
    await userEvent.click(insertBaseMapButton);
    expect(onInsertBaseMapMock).toHaveBeenCalled();
  });

  it("Should render base maps", () => {
    const store = setupStore();
    const { container } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    expect(container).toBeInTheDocument();

    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Light gray")).toBeInTheDocument();
    expect(screen.getByText("Dark gray")).toBeInTheDocument();
    expect(screen.getByText("Streets")).toBeInTheDocument();
    expect(screen.getByText("Streets(night)")).toBeInTheDocument();
  });
});
