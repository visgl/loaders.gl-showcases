import { TileDetailsPanel } from "./tile-details-panel";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { getTile3d } from "../../test/tile-stub";

const handleClosePanel = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <TileDetailsPanel
      tile={getTile3d()}
      handleClosePanel={handleClosePanel}
      {...props}
    >
      {"Some Text"}
    </TileDetailsPanel>
  );
};

describe("Tile Details Panel", () => {
  it("Should render tile details panel with title", () => {
    const { getByText } = callRender(renderWithTheme);
    const title = getByText("Sanfran_Orig_0992.flt");
    const closeButton = title.nextSibling;
    getByText("Some Text");
    expect(closeButton).toBeInTheDocument();
    userEvent.click(closeButton);
    expect(handleClosePanel).toHaveBeenCalledTimes(1);
  });

  it("Should not render empty title", () => {
    const { queryByText } = callRender(renderWithTheme, { title: "" });
    const heading = queryByText("Sanfran_Orig_0992.flt");
    expect(heading).not.toBeInTheDocument();
  });
});
