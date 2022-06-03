import { render, screen } from "@testing-library/react";
import { TileDetailsPanel } from "./tile-details-panel";
import userEvent from "@testing-library/user-event";

describe("Tile Details Panel", () => {
  it("Should render tile details panel with title", () => {
    const handleClosePanel = jest.fn();
    render(
      <TileDetailsPanel
        title={"Sanfran_Orig_0992.flt"}
        handleClosePanel={handleClosePanel}
      />
    );
    const button = screen.getByRole("button");
    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(heading).toHaveTextContent("Sanfran_Orig_0992.flt");
    userEvent.click(button);
    expect(handleClosePanel).toHaveBeenCalledTimes(1);
  });

  it("Should render children data", () => {
    const handleClosePanel = jest.fn();
    const { container } = render(
      <TileDetailsPanel title={""} handleClosePanel={handleClosePanel}>
        {"Some Text"}
      </TileDetailsPanel>
    );
    expect(container).not.toBeEmptyDOMElement();
  });

  it("Should not render empty title", () => {
    const handleClosePanel = jest.fn();
    render(<TileDetailsPanel title={""} handleClosePanel={handleClosePanel} />);
    const heading = screen.queryByRole("heading");
    expect(heading).not.toBeInTheDocument();
  });
});
