import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { HistogramChart } from "./histogram";

jest.mock("./histogram-tooltip", () => ({
  HistogramTooltip: jest
    .fn()
    .mockImplementation(() => <div>HistogramTooltip</div>),
}));
jest.mock("recharts", () => ({
  AreaChart: jest
    .fn()
    .mockImplementation(({ children }) => <div>{children}</div>),
  Area: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  CartesianGrid: jest
    .fn()
    .mockImplementation(({ children }) => <div>{children}</div>),
  Tooltip: jest.fn().mockImplementation(({ content }) => (
    <div>
      Tooltip
      {content()}
    </div>
  )),
  ResponsiveContainer: jest
    .fn()
    .mockImplementation(({ children }) => <div>{children}</div>),
  XAxis: jest.fn().mockImplementation(() => <div>XAxis</div>),
  YAxis: jest.fn().mockImplementation(() => <div>YAxis</div>),
}));

describe("HistogramChart", () => {
  it("Should render HistogramChart", () => {
    const { container } = renderWithTheme(
      <HistogramChart
        attributeName={""}
        histogramData={{
          minimum: 0,
          maximum: 0,
          // @ts-expect-error - Change types in loaders.gl
          counts: [1, 2, 3, 4, 5],
        }}
      />
    );

    expect(container).toBeInTheDocument();
    expect(screen.queryByText("Tooltip")).toBeInTheDocument();
    expect(screen.queryByText("HistogramTooltip")).toBeInTheDocument();
    expect(screen.queryByText("XAxis")).toBeInTheDocument();
    expect(screen.queryByText("YAxis")).toBeInTheDocument();
  });
});
