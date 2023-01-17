import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { TileColorSection } from "./tile-color-section";
import { fireEvent } from "@testing-library/react";

const handleResetColor = jest.fn();
const handleSelectTileColor = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <TileColorSection
      tileId={"41510-main"}
      tileSelectedColor={{ r: 0, g: 100, b: 255 }}
      isResetButtonDisabled={true}
      handleResetColor={handleResetColor}
      handleSelectTileColor={handleSelectTileColor}
      {...props}
    />
  );
};

describe("Tile Color Section", () => {
  it("Should render validate data", () => {
    const { container } = callRender(renderWithTheme);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("Reset button should be disabled", () => {
    const { container, getByText } = callRender(renderWithTheme);
    const expand = container.firstChild.lastChild.lastChild;
    fireEvent.click(expand);
    const resetColor = getByText("Reset").parentElement;
    expect(resetColor).toHaveStyle("cursor: not-allowed");
    expect(resetColor).toBeDisabled();
  });

  it("Reset button should be enabled", () => {
    const { container, getByText } = callRender(renderWithTheme, {
      isResetButtonDisabled: false,
    });
    const expand = container.firstChild.lastChild.lastChild;
    fireEvent.click(expand);
    const resetColor = getByText("Reset").parentElement;
    expect(resetColor).toHaveStyle("cursor: pointer");
    expect(resetColor).not.toBeDisabled();
    fireEvent.click(resetColor);
    expect(handleResetColor).toHaveBeenCalled();
  });

  it("Handle select color should be called", () => {
    const { container, getByLabelText } = callRender(
      renderWithTheme,
      {
        isResetButtonDisabled: false,
      }
    );
    const expand = container.firstChild.lastChild.lastChild;
    fireEvent.click(expand);
    fireEvent.change(getByLabelText("hex"), { target: { value: "#FFFFFF" } });
    expect(handleSelectTileColor).toHaveBeenCalled();
  });
});
