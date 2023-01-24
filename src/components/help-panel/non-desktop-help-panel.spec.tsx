import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";

import { NonDesktopHelpPanel } from "./non-desktop-help-panel";
import { NonDesktopShortcutTabs } from "./non-desktop-shortcuts-tabs";
import { NonDesktopShortcutsListPanel } from "./non-desktop-shortcuts-list-panel";
import { NonDesktopVideoPanel } from "./non-desktop-video-panel";
import { CloseButton } from "../close-button/close-button";
import { HelpPanelSelectedTab } from "../../types";
import userEvent from "@testing-library/user-event";

jest.mock("./non-desktop-shortcuts-tabs");
jest.mock("./non-desktop-shortcuts-list-panel");
jest.mock("./non-desktop-video-panel");
jest.mock("../close-button/close-button");
jest.mock("../../utils/hooks/layout", () => ({
  getCurrentLayoutProperty: jest.fn(),
  useAppLayout: jest
    .fn()
    .mockImplementationOnce(() => {
      return "tablet";
    })
    .mockImplementationOnce(() => {
      return "mobile";
    }),
}));

const NonDesktopShortcutTabsMock =
  NonDesktopShortcutTabs as unknown as jest.Mocked<any>;
const NonDesktopShortcutsListPanelMock =
  NonDesktopShortcutsListPanel as unknown as jest.Mocked<any>;
const CloseButtonMock = CloseButton as unknown as jest.Mocked<any>;
const NonDesktopVideoPanelMock =
  NonDesktopVideoPanel as unknown as jest.Mocked<any>;

beforeAll(() => {
  NonDesktopShortcutTabsMock.mockImplementation(() => (
    <div>Non Desktop Shortcut Tabs Mock</div>
  ));
  NonDesktopShortcutsListPanelMock.mockImplementation(() => (
    <div>Non Desktop Shortcuts ListPanel Mock</div>
  ));
  CloseButtonMock.mockImplementation(() => <div>Close Button Mock</div>);
  NonDesktopVideoPanelMock.mockImplementation(({ onCloseVideoPanel }) => {
    return <div onClick={onCloseVideoPanel}>Non Desktop VideoPanel Mock</div>;
  });
});

describe("Non Desktop Help Panel", () => {
  it("Should render NonDesktopHelpPanel", () => {
    const onClose = jest.fn();
    const onShortcutClick = jest.fn();
    const { container } = renderWithTheme(
      <NonDesktopHelpPanel
        onClose={onClose}
        shortcuts={[
          { id: "test", icon: <div></div>, title: "", text: "", video: "" },
        ]}
        activeShortcutId={"test"}
        selectedTab={HelpPanelSelectedTab.Touch}
        onTabSelect={jest.fn()}
        onShortcutClick={onShortcutClick}
      />
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText("Shortcuts")).toBeInTheDocument();
    expect(screen.getByText("Close Button Mock")).toBeInTheDocument();
    expect(
      screen.getByText("Non Desktop Shortcut Tabs Mock")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Non Desktop Shortcuts ListPanel Mock")
    ).toBeInTheDocument();

    expect(screen.getByText("Non Desktop VideoPanel Mock")).toBeInTheDocument();

    userEvent.click(screen.getByText("Non Desktop VideoPanel Mock"));

    expect(onShortcutClick).toHaveBeenCalled();

    userEvent.click(screen.getByTestId("non-desktop-overlay"));

    expect(onShortcutClick).toHaveBeenCalled();
  });

  it("Should render NonDesktopHelpPanel with no videoPanel if no active shortcut", () => {
    const onClose = jest.fn();
    const { container } = renderWithTheme(
      <NonDesktopHelpPanel
        onClose={onClose}
        shortcuts={[
          { id: "test", icon: <div></div>, title: "", text: "", video: "" },
        ]}
        activeShortcutId={"test-1"}
        selectedTab={HelpPanelSelectedTab.Touch}
        onTabSelect={jest.fn()}
        onShortcutClick={jest.fn()}
      />
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText("Shortcuts")).toBeInTheDocument();
    expect(screen.getByText("Close Button Mock")).toBeInTheDocument();
    expect(
      screen.getByText("Non Desktop Shortcut Tabs Mock")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Non Desktop Shortcuts ListPanel Mock")
    ).toBeInTheDocument();

    expect(screen.queryByText("Non Desktop VideoPanel Mock")).toBe(null);
  });
});
