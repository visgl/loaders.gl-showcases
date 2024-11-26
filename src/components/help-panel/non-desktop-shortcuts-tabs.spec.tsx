import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelpPanelSelectedTab } from "../../types";
import { useAppLayout } from "../../utils/hooks/layout";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { NonDesktopShortcutTabs } from "./non-desktop-shortcuts-tabs";

jest.mock("../../utils/hooks/layout");

const useAppLayoutMock = useAppLayout as unknown as jest.Mocked<any>;

describe("NonDesktop Shortcut Tabs", () => {
  it("Should render Mobile NonDesktopShortcutTabs", async () => {
    useAppLayoutMock.mockImplementation(() => "mobile");

    const onTabSelect = jest.fn();
    const { container } =
      renderWithTheme(
        <NonDesktopShortcutTabs
          selectedTab={HelpPanelSelectedTab.Mouse}
          onTabSelect={onTabSelect}
        />
      ) ?? {};

    expect(container).toBeInTheDocument();

    const mouseTab = screen.getByText("Mouse");
    const trackpadTab = screen.getByText("Trackpad");
    const touchTab = screen.getByText("Touch");

    expect(mouseTab).toBeInTheDocument();
    expect(trackpadTab).toBeInTheDocument();
    expect(touchTab).toBeInTheDocument();

    await userEvent.click(mouseTab);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Mouse);

    await userEvent.click(trackpadTab);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Trackpad);

    await userEvent.click(touchTab);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Touch);

    const mouseImage = screen.getByTestId("mobile-image-Mouse");
    const trackpadImage = screen.getByTestId("mobile-image-Trackpad");
    const touchImage = screen.getByTestId("mobile-image-Touch");

    expect(mouseImage).toBeInTheDocument();
    expect(trackpadImage).toBeInTheDocument();
    expect(touchImage).toBeInTheDocument();

    await userEvent.click(mouseImage);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Mouse);

    await userEvent.click(trackpadImage);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Trackpad);

    await userEvent.click(touchImage);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Touch);
  });

  it("Should render Tablet NonDesktopShortcutTabs", async () => {
    useAppLayoutMock.mockImplementation(() => "tablet");

    const onTabSelect = jest.fn();
    const { container } =
      renderWithTheme(
        <NonDesktopShortcutTabs
          selectedTab={HelpPanelSelectedTab.Mouse}
          onTabSelect={onTabSelect}
        />
      ) ?? {};

    expect(container).toBeInTheDocument();

    const mouseTab = screen.getByText("Mouse");
    const trackpadTab = screen.getByText("Trackpad");
    const touchTab = screen.getByText("Touch");

    expect(mouseTab).toBeInTheDocument();
    expect(trackpadTab).toBeInTheDocument();
    expect(touchTab).toBeInTheDocument();

    await userEvent.click(mouseTab);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Mouse);

    await userEvent.click(trackpadTab);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Trackpad);

    await userEvent.click(touchTab);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Touch);

    const mouseImage = screen.getByTestId("tablet-image-Mouse");
    const trackpadImage = screen.getByTestId("tablet-image-Trackpad");
    const touchImage = screen.getByTestId("tablet-image-Touch");

    expect(mouseImage).toBeInTheDocument();
    expect(trackpadImage).toBeInTheDocument();
    expect(touchImage).toBeInTheDocument();

    await userEvent.click(mouseImage);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Mouse);

    await userEvent.click(trackpadImage);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Trackpad);

    await userEvent.click(touchImage);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Touch);
  });
});
