import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelpPanelSelectedTab } from "../../types";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { DesktopShortcutTabs } from "./desktop-shortcuts-tabs";

jest.mock("../../../public/images/trackpadTabDesktop.svg");
jest.mock("../../../public/images/mouseTabDesktop.svg");
jest.mock("../../../public/images/touchTabDesktop.svg");

describe("Desktop Shortcut Tabs", () => {
  it("Should render DesktopShortcutTabs", () => {
    const onTabSelect = jest.fn();
    const { container } = renderWithTheme(
      <DesktopShortcutTabs
        selectedTab={HelpPanelSelectedTab.Mouse}
        onTabSelect={onTabSelect}
      />
    );
    expect(container).toBeInTheDocument();
    expect(screen.getByText("Shortcuts")).toBeInTheDocument();
    expect(screen.getByText("Mouse")).toBeInTheDocument();
    expect(screen.getByText("Trackpad")).toBeInTheDocument();
    expect(screen.getByText("Touch")).toBeInTheDocument();

    const touchTab = screen.getByTestId("tab-touch");
    const trackpadTab = screen.getByTestId("tab-trackpad");
    const mouseTab = screen.getByTestId("tab-mouse");

    expect(mouseTab).toHaveStyle("color: #60C2A4");

    userEvent.click(mouseTab);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Mouse);

    userEvent.click(trackpadTab);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Trackpad);

    userEvent.click(touchTab);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Touch);
  });
});
