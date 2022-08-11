import { fireEvent, screen } from "@testing-library/react";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { DesktopShortcutItem } from "./desktop-shortcut-item";

describe("Desktop Shortcut Item", () => {
  it("Should render DesktopShortcutItem", () => {
    const onHover = jest.fn();

    const baseDom = renderWithTheme(
      <DesktopShortcutItem
        shortcut={{
          id: "test",
          icon: <div>Hello world</div>,
          text: "First Item Text",
          video: "/link-to-test-video",
        }}
        active={true}
        onHover={onHover}
      />
    );

    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("First Item Text")).toBeInTheDocument();

    fireEvent.mouseOver(baseDom.getByTestId("test"));

    expect(onHover).toHaveBeenCalled();
  });

  it("Should render not active DesktopShortcutItem", () => {
    const onHover = jest.fn();

    const baseDom = renderWithTheme(
      <DesktopShortcutItem
        shortcut={{
          id: "test",
          icon: <div>Hello world</div>,
          text: "First Item Text",
          video: "/link-to-test-video",
        }}
        active={false}
        onHover={onHover}
      />
    );

    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("First Item Text")).toBeInTheDocument();

    fireEvent.mouseOver(baseDom.getByTestId("test"));

    expect(onHover).toHaveBeenCalled();
  });
});
