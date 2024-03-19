import { screen } from "@testing-library/react";
import { DesktopHelpPanel } from "./desktop-help-panel";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";

import { DesktopShortcutTabs } from "./desktop-shortcuts-tabs";

import { DesktopShortcutsListPanel } from "./desktop-shortcut-list-panel";
import { CloseButton } from "../close-button/close-button";
import { DesktopVideoPanel } from "./desktop-video-panel";
import { HelpPanelSelectedTab } from "../../types";

jest.mock("./desktop-shortcuts-tabs");
jest.mock("./desktop-shortcut-list-panel");
jest.mock("../close-button/close-button");
jest.mock("./desktop-video-panel");

const DesktopShortcutTabsMock =
  DesktopShortcutTabs as unknown as jest.Mocked<any>;
const DesktopShortcutsListPanelMock =
  DesktopShortcutsListPanel as unknown as jest.Mocked<any>;
const CloseButtonMock = CloseButton as unknown as jest.Mocked<any>;
const DesktopVideoPanelMock = DesktopVideoPanel as unknown as jest.Mocked<any>;

jest.mock("../../utils/hooks/layout", () => ({
  useAppLayout: jest
    .fn()
    .mockImplementationOnce(() => {
      return "desktop";
    })
    .mockImplementationOnce(() => {
      return "mobile";
    }),
}));

beforeAll(() => {
  DesktopShortcutTabsMock.mockImplementation(() => (
    <div>Desktop Shortcut Tabs Mock</div>
  ));
  DesktopShortcutsListPanelMock.mockImplementation(() => (
    <div>Desktop Shortcuts ListPanel Mock</div>
  ));
  CloseButtonMock.mockImplementation(() => <div>Close Button Mock</div>);
  DesktopVideoPanelMock.mockImplementation(() => (
    <div>Desktop VideoPanel Mock</div>
  ));
});

describe("Desktop Help Panel", () => {
  it("Should render DesktopHelpPanel", () => {
    const onClose = jest.fn();
    const { container } =
      renderWithTheme(
        <DesktopHelpPanel
          onClose={onClose}
          shortcuts={[
            { id: "test", icon: <div></div>, title: "", text: "", video: "" },
          ]}
          activeShortcutId={"test"}
          selectedTab={HelpPanelSelectedTab.Touch}
          onTabSelect={jest.fn()}
          onShortcutHover={jest.fn()}
        />
      ) ?? {};

    expect(container).toBeInTheDocument();
    expect(screen.getByText("Desktop Shortcut Tabs Mock")).toBeInTheDocument();
    expect(
      screen.getByText("Desktop Shortcuts ListPanel Mock")
    ).toBeInTheDocument();
    expect(screen.getByText("Close Button Mock")).toBeInTheDocument();
    expect(screen.getByText("Desktop VideoPanel Mock")).toBeInTheDocument();
  });
});
