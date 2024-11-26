import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelpPanelSelectedTab } from "../../types";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { DesktopShortcutTabs } from "./desktop-shortcuts-tabs";

jest.mock("../../../public/images/trackpadTabDesktop.svg");
jest.mock("../../../public/images/mouseTabDesktop.svg");
jest.mock("../../../public/images/touchTabDesktop.svg");

describe("Desktop Shortcut Tabs", () => {
  it("Should render DesktopShortcutTabs", async () => {
    const onTabSelect = jest.fn();
    const { container } =
      renderWithTheme(
        <DesktopShortcutTabs
          selectedTab={HelpPanelSelectedTab.Mouse}
          onTabSelect={onTabSelect}
        />
      ) ?? {};
    expect(container).toBeInTheDocument();
    expect(screen.getByText("Shortcuts")).toBeInTheDocument();
    expect(screen.getByText("Mouse")).toBeInTheDocument();
    expect(screen.getByText("Trackpad")).toBeInTheDocument();
    expect(screen.getByText("Touch")).toBeInTheDocument();

    const touchTab = screen.getByTestId("tab-touch");
    const trackpadTab = screen.getByTestId("tab-trackpad");
    const mouseTab = screen.getByTestId("tab-mouse");

    expect(mouseTab).toHaveStyle("color: #60C2A4");

    await userEvent.click(mouseTab);
    expect(onTabSelect).toHaveBeenCalledWith(HelpPanelSelectedTab.Mouse);

    await userEvent.click(trackpadTab);
    expect(onTabSelect).toHaveBeenCalledWith(HelpPanelSelectedTab.Trackpad);

    await userEvent.click(touchTab);
    expect(onTabSelect).toHaveBeenCalledWith(HelpPanelSelectedTab.Touch);
  });
});
