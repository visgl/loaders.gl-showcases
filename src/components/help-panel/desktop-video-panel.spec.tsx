import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { DesktopVideoPanel } from "./desktop-video-panel";

describe("Desktop Video Panel", () => {
  it("Should render placeholder if no video", () => {
    const { container } = renderWithTheme(<DesktopVideoPanel />) ?? {};

    expect(container).toBeInTheDocument();
    expect(
      screen.getByText("Hover over gesture to see animation")
    ).toBeInTheDocument();
  });

  it("Should render video", () => {
    const { container } =
      renderWithTheme(<DesktopVideoPanel video="/test/test.video.mp4" />) ?? {};
    const video = screen.getByTestId("shortcut-video-player");

    expect(container).toBeInTheDocument();
    expect(video).toBeInTheDocument();
  });
});
