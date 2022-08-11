import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { DesktopShortcutsListPanel } from "./desktop-shortcut-list-panel";
import { DesktopShortcutItem } from "./desktop-shortcut-item";

jest.mock("./desktop-shortcut-item");

const DesktopShortcutItemMock =
  DesktopShortcutItem as unknown as jest.Mocked<any>;

describe("Desktop Shortcut List Panel", () => {
  beforeAll(() => {
    DesktopShortcutItemMock.mockImplementation(({ shortcut }) => (
      <div {...shortcut}>{shortcut.text}</div>
    ));
  });

  it("Should render DesktopShortcutListPanel", () => {
    const { container } = renderWithTheme(
      <DesktopShortcutsListPanel
        activeShortcutId={"test"}
        shortcuts={[
          {
            id: "test",
            icon: <div>Hello one</div>,
            text: "First Item Text",
            video: "/link-to-test-video-0",
          },
          {
            id: "test1",
            icon: <div>Hello two</div>,
            text: "Second Item Text",
            video: "/link-to-test-video-1",
          },
        ]}
        onHover={jest.fn()}
      />
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText("First Item Text")).toBeInTheDocument();
    expect(screen.getByText("Second Item Text")).toBeInTheDocument();
  });
});
