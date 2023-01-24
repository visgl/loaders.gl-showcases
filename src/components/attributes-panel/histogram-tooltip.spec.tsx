import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { HistogramTooltip } from "./histogram-tooltip";

describe("HistogramTooltip", () => {
  it("Should not be rendered if no active", () => {
    renderWithTheme(<HistogramTooltip active={false} />);
    expect(screen.queryByText("Count")).not.toBeInTheDocument();
  });

  it("Should not be rendered if no payload", () => {
    renderWithTheme(<HistogramTooltip active={true} payload={null} />);
    expect(screen.queryByText("Count")).not.toBeInTheDocument();
  });

  it("Should not be rendered if payload lenght is 0", () => {
    renderWithTheme(<HistogramTooltip active={true} payload={[]} />);
    expect(screen.queryByText("Count")).not.toBeInTheDocument();
  });

  it("Should show histogram tooltip", () => {
    renderWithTheme(
      <HistogramTooltip
        active={true}
        payload={[{ value: 0 }]}
        attributeName="Test"
        label="test_label"
      />
    );
    expect(screen.queryByText("Count: 0")).toBeInTheDocument();
    expect(screen.queryByText("Test: test_label")).toBeInTheDocument();
  });
});
