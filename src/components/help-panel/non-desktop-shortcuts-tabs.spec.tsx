import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelpPanelSelectedTab } from "../../types";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { NonDesktopShortcutTabs } from "./non-desktop-shortcuts-tabs";

import { useAppLayout } from "../../utils/layout";

jest.mock("../../../public/images/trackpadTabMobile.svg");
jest.mock("../../../public/images/mouseTabMobile.svg");
jest.mock("../../../public/images/touchTabMobile.svg");

jest.mock("../../../public/images/trackpadTabTablet.svg");
jest.mock("../../../public/images/mouseTabTablet.svg");
jest.mock("../../../public/images/touchTabTablet.svg");
jest.mock("../../utils/layout");

const useAppLayoutMock = useAppLayout as unknown as jest.Mocked<any>;

describe("NonDesktop Shortcut Tabs", () => {
  it("Should render Mobile NonDesktopShortcutTabs", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");

    const onTabSelect = jest.fn();
    const { container } = renderWithTheme(
      <NonDesktopShortcutTabs
        selectedTab={HelpPanelSelectedTab.Mouse}
        onTabSelect={onTabSelect}
      />
    );

    expect(container).toBeInTheDocument();

    const mouseTab = screen.getByText("Mouse");
    const trackpadTab = screen.getByText("Trackpad");
    const touchTab = screen.getByText("Touch");

    expect(mouseTab).toBeInTheDocument();
    expect(trackpadTab).toBeInTheDocument();
    expect(touchTab).toBeInTheDocument();

    userEvent.click(mouseTab);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Mouse);

    userEvent.click(trackpadTab);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Trackpad);

    userEvent.click(touchTab);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Touch);

    const mouseImage = screen.getByTestId("mobile-image-Mouse");
    const trackpadImage = screen.getByTestId("mobile-image-Trackpad");
    const touchImage = screen.getByTestId("mobile-image-Touch");

    expect(mouseImage).toBeInTheDocument();
    expect(trackpadImage).toBeInTheDocument();
    expect(touchImage).toBeInTheDocument();

    userEvent.click(mouseImage);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Mouse);

    userEvent.click(trackpadImage);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Trackpad);

    userEvent.click(touchImage);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Touch);
  });

  it("Should render Tablet NonDesktopShortcutTabs", () => {
    useAppLayoutMock.mockImplementation(() => "tablet");

    const onTabSelect = jest.fn();
    const { container } = renderWithTheme(
      <NonDesktopShortcutTabs
        selectedTab={HelpPanelSelectedTab.Mouse}
        onTabSelect={onTabSelect}
      />
    );

    expect(container).toBeInTheDocument();

    const mouseTab = screen.getByText("Mouse");
    const trackpadTab = screen.getByText("Trackpad");
    const touchTab = screen.getByText("Touch");

    expect(mouseTab).toBeInTheDocument();
    expect(trackpadTab).toBeInTheDocument();
    expect(touchTab).toBeInTheDocument();

    userEvent.click(mouseTab);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Mouse);

    userEvent.click(trackpadTab);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Trackpad);

    userEvent.click(touchTab);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Touch);

    const mouseImage = screen.getByTestId("tablet-image-Mouse");
    const trackpadImage = screen.getByTestId("tablet-image-Trackpad");
    const touchImage = screen.getByTestId("tablet-image-Touch");

    expect(mouseImage).toBeInTheDocument();
    expect(trackpadImage).toBeInTheDocument();
    expect(touchImage).toBeInTheDocument();

    userEvent.click(mouseImage);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Mouse);

    userEvent.click(trackpadImage);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Trackpad);

    userEvent.click(touchImage);
    expect(onTabSelect).toBeCalledWith(HelpPanelSelectedTab.Touch);
  });
});
