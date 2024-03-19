import { fireEvent, screen } from "@testing-library/react";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { NonDesktopVideoPanel } from "./non-desktop-video-panel";
import { CloseButton } from "../close-button/close-button";

jest.mock("../close-button/close-button");

const CloseButtonMock = CloseButton as unknown as jest.Mocked<any>;

beforeAll(() => {
  CloseButtonMock.mockImplementation(({ onClick }) => (
    <div onClick={onClick}>Close Button Mock</div>
  ));
});

describe("NonDesktop Video Panel", () => {
  it("Should video panel", () => {
    const onCloseVideoPanel = jest.fn();
    const { container } =
      renderWithTheme(
        <NonDesktopVideoPanel
          shortcut={{
            id: "tst-id",
            icon: null,
            title: "Test video",
            text: "",
            video: "",
          }}
          onCloseVideoPanel={onCloseVideoPanel}
        />
      ) ?? {};

    const title = screen.getByText("Test video");
    const closeButton = screen.getByText("Close Button Mock");
    const videoPlayer = screen.getByTestId("shortcut-non-desktop-video-player");

    expect(container).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(videoPlayer).toBeInTheDocument();

    fireEvent.click(closeButton);

    expect(onCloseVideoPanel).toHaveBeenCalled();
  });
});
