import type { Histogram } from "@loaders.gl/i3s";

import { useMemo } from "react";
import styled, { useTheme } from "styled-components";
import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { color_brand_quaternary } from "../../constants/colors";
import { HistogramTooltip } from "./histogram-tooltip";

const ChartContainer = styled.div`
  height: 176px;

  svg {
    border-radius: 20px;
  }
`;

type HistrogramProps = {
  attributeName: string;
  histogramData: Histogram;
};

export const HistogramChart = ({
  histogramData,
  attributeName,
}: HistrogramProps) => {
  const theme = useTheme();

  const prepareChartData = (): { count: number }[] => {
    const data: { xAxisData: number; count: number }[] = [];
    let min = histogramData.minimum;
    const binSize =
      (histogramData.maximum - histogramData.minimum) /
      histogramData.counts.length;
    for (const count of histogramData.counts) {
      data.push({
        xAxisData: Math.floor(min),
        count,
      });

      min += binSize;
    }

    return data;
  };

  const data = useMemo(() => prepareChartData(), [histogramData]);

  return (
    <ChartContainer>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid
            vertical={false}
            fill={theme.colors.mainColor}
            strokeDasharray="2"
            stroke={color_brand_quaternary}
          />
          <XAxis dataKey={"xAxisData"} hide />
          <YAxis hide />
          <Tooltip
            content={(props) => (
              <HistogramTooltip attributeName={attributeName} {...props} />
            )}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke={theme.colors.mainHistogramColor}
            fill={theme.colors.mainHistogramColor}
            fillOpacity="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
