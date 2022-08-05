import { fireEvent, screen } from "@testing-library/react";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { NonDesktopShortcutItem } from "./non-desktop-shortcut-item";

jest.mock("../../../public/icons/play.svg");

describe("NonDesktop Shortcut Item", () => {
  it("Should render NonDesktopShortcutItem", () => {
    const onShortcutClick = jest.fn();

    renderWithTheme(
      <NonDesktopShortcutItem
        shortcut={{
          id: "test",
          icon: <div>Hello world</div>,
          title: "First Item Title",
          text: "First Item Text",
          video: "/link-to-test-video",
        }}
        onShortcutClick={onShortcutClick}
      />
    );

    const playIcon = screen.getByTestId("play-icon-test");

    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("First Item Title")).toBeInTheDocument();
    expect(screen.getByText("First Item Text")).toBeInTheDocument();
    expect(playIcon).toBeInTheDocument();

    fireEvent.click(playIcon);

    expect(onShortcutClick).toHaveBeenCalled();
  });
});
