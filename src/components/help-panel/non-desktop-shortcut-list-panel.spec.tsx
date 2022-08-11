import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { NonDesktopShortcutsListPanel } from "./non-desktop-shortcuts-list-panel";
import { NonDesktopShortcutItem } from "./non-desktop-shortcut-item";

jest.mock("./non-desktop-shortcut-item");

const NonDesktopShortcutItemMock =
  NonDesktopShortcutItem as unknown as jest.Mocked<any>;

beforeAll(() => {
  NonDesktopShortcutItemMock.mockImplementation(({ shortcut }) => (
    <div {...shortcut}>{shortcut.text}</div>
  ));
});

describe("NonDesktop Shortcut List Panel", () => {
  it("Should render NonDesktopShortcutListPanel", () => {
    const { container } = renderWithTheme(
      <NonDesktopShortcutsListPanel
        shortcuts={[
          {
            id: "test",
            icon: <div>Hello one</div>,
            title: "First Item Title",
            text: "First Item Text",
            video: "/link-to-test-video-0",
          },
          {
            id: "test1",
            icon: <div>Hello two</div>,
            title: "Second Item Title",
            text: "Second Item Text",
            video: "/link-to-test-video-1",
          },
        ]}
        onShortcutClick={jest.fn()}
      />
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText("First Item Text")).toBeInTheDocument();
    expect(screen.getByText("Second Item Text")).toBeInTheDocument();
  });
});
