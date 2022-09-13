// TODO Add export type to index file in loaders.gl
import type {
  StatisticsInfo,
  StatsInfo,
  Histogram,
  ValueCount,
} from "@loaders.gl/i3s/dist/types";

import { useEffect, useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";

import { load } from "@loaders.gl/core";
import { JSONLoader } from "@loaders.gl/loader-utils";
import { ToggleSwitch } from "../toogle-switch/toggle-switch";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";
import { HistogramChart } from "./histogram";

import LayersIcon from "../../../public/icons/layers.svg";
import DropdownUp from "../../../public/icons/dropdown-up.svg";

type VisibilityProps = {
  visible: boolean;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: transparent;
  color: ${({ theme }) => theme.colors.fontColor};
  overflow-y: auto;
  width: calc(100% - 32px);
  padding: 0 16px;
`;

const AttributeTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
`;

const TilesetData = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 26px;
`;

const TilesetName = styled.div`
  margin-left: 8px;
`;

const Statistics = styled.div`
  margin-top: 19px;
  display: grid;
  grid-template-columns: 1fr 2fr;
`;

const Statistic = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;

  :nth-child(even) {
    opacity: 0.8;
    margin-left: 10px;
  }
`;

const HistograpPanel = styled.div`
  display: flex;
  flex-direction: column;
`;

const HistogramTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const HistogamArrow = styled(DropdownUp)`
  cursor: pointer;
  fill: ${({ theme }) => theme.colors.fontColor};
  transform: ${({ open }) => (open ? "none" : "rotate(180deg)")};

  &:hover {
    opacity: 0.8;
  }
`;

const SplitLine = styled.div`
  margin: 24px 0 28px 0;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.mainHiglightColor};
`;

const AttributeColorize = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 36px;
`;

const ColorizeTitle = styled.div`
  font-weight: 700;
`;

const ValueCountContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  align-items: center;
`;

const ValueCountItem = styled.div`
  margin-bottom: 5px;
`;

const SpinnerContainer = styled.div<VisibilityProps>`
  position: absolute;
  left: calc(50% - 22px);
  top: 70px;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`;

const FadeContainer = styled.div`
  display: flex; 
  justify-content: center;
  margin-bottom: 36px;
`;

const Fade = styled.div`
  width: 295px;
  height: 25px;
  background: linear-gradient(90deg, #9292fc 0%, #0e73f2 100%, #2c2caf 100%);
  border-radius: 2px;
`;

const HISTOGRAM = "histogram";
const MOST_FREQUENT_VALUES = "mostFrequentValues";
const COLORIZE_BY_ATTRIBUTE = "Colorize by Attribute";
const VALUE_TITLE = "Value";
const COUNT_TITLE = "Count";

const statisitcsMap = new Map();

type AttributeStatsProps = {
  attributeName: string;
  statisticsInfo: StatisticsInfo;
  tilesetName: string;
  tilesetBasePath: string;
  showColorizeByAttribute: boolean;
  onColorizeByAttributeClick: () => void;
};

export const AttributeStats = ({
  attributeName,
  statisticsInfo,
  tilesetName,
  tilesetBasePath,
  showColorizeByAttribute,
  onColorizeByAttributeClick,
}: AttributeStatsProps) => {
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState<StatsInfo | null>(null);
  const [showHistogram, setShowHistogram] = useState(true);
  const [histogramData, setHistogramData] = useState<Histogram | null>(null);

  /**
   * Handle base uri and statistic uri
   * @param statisticUrl
   * @param baseUri
   * @returns
   */
  const resolveUrl = (statisticUrl: string, tilesetUrl: string): string => {
    const statUrl = new URL(statisticUrl, `${tilesetUrl}/`);
    return decodeURI(statUrl.toString());
  };

  useEffect(() => {
    /**
     * Load I3S attribute statistics
     * Spec - https://github.com/Esri/i3s-spec/blob/master/docs/1.8/statisticsInfo.cmn.md
     * Spec - https://github.com/Esri/i3s-spec/blob/master/docs/1.8/statsInfo.cmn.md
     * @param statisticsInfo
     * @param options
     * @returns
     */
    const getAttributeStatsInfo = async (
      tilesetUrl: string,
      attributeUrl: string
    ) => {
      setIsLoading(true);
      const statAttributeUrl = resolveUrl(attributeUrl, tilesetUrl);

      if (statisitcsMap.has(statAttributeUrl)) {
        const statistics = statisitcsMap.get(statAttributeUrl);
        setStatistics(statistics);
        setIsLoading(false);
      } else {
        try {
          const data = await load(statAttributeUrl, JSONLoader);
          const stats = data?.stats as StatsInfo;

          statisitcsMap.set(statAttributeUrl, stats);
          setStatistics(stats);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getAttributeStatsInfo(tilesetBasePath, statisticsInfo.href);
  }, [attributeName]);

  const renderStatisticRows = () => {
    const statisticsRows: JSX.Element[] = [];

    for (const statName in statistics) {
      const statValue = statistics[statName];

      switch (statName) {
        case HISTOGRAM:
          setHistogramData(statValue);
          break;

        case MOST_FREQUENT_VALUES: {
          statisticsRows.push(<Statistic key={statName}>{statName}</Statistic>);
          const frequentValues = renderMostFrequentValuesStats(statValue);
          statisticsRows.push(
            <Statistic key={`${statName}-${statValue}`}>
              {frequentValues}
            </Statistic>
          );
          break;
        }

        default: {
          statisticsRows.push(<Statistic key={statName}>{statName}</Statistic>);
          statisticsRows.push(
            <Statistic key={`${statName}-${statValue}`}>{statValue}</Statistic>
          );
        }
      }
    }

    return statisticsRows;
  };

  const renderMostFrequentValuesStats = (frequentValues: ValueCount[]) => {
    const valueCountRows: JSX.Element[] = [
      <ValueCountContainer key={"most-frequetn-values-title"}>
        <ValueCountItem>{VALUE_TITLE}</ValueCountItem>
        <ValueCountItem>{COUNT_TITLE}</ValueCountItem>
      </ValueCountContainer>,
    ];

    for (const item of frequentValues) {
      valueCountRows.push(
        <ValueCountContainer key={item.value}>
          <ValueCountItem>{item.value}</ValueCountItem>
          <ValueCountItem>{item.count}</ValueCountItem>
        </ValueCountContainer>
      );
    }

    return valueCountRows;
  };

  const statisticRows = useMemo(() => renderStatisticRows(), [statistics]);

  return (
    <>
      <SpinnerContainer visible={isLoading}>
        <LoadingSpinner />
      </SpinnerContainer>
      {!isLoading && (
        <Container>
          <AttributeTitle>{attributeName}</AttributeTitle>
          <TilesetData>
            <LayersIcon
              data-testid="statistics-layers-icon"
              fill={theme.colors.fontColor}
            />
            <TilesetName>{tilesetName}</TilesetName>
          </TilesetData>
          <Statistics>{statisticRows}</Statistics>
          {histogramData && (
            <>
              <HistograpPanel>
                <HistogramTitle>
                  Histogram
                  <HistogamArrow
                    data-testid="histogram-arrow"
                    open={showHistogram}
                    onClick={() => setShowHistogram((prevValue) => !prevValue)}
                  />
                </HistogramTitle>
                {showHistogram && (
                  <HistogramChart
                    attributeName={attributeName}
                    histogramData={histogramData}
                  />
                )}
              </HistograpPanel>
              {showHistogram && (
                <SplitLine data-testid="histogram-split-line" />
              )}
            </>
          )}

          <AttributeColorize>
            <ColorizeTitle>{COLORIZE_BY_ATTRIBUTE}</ColorizeTitle>
            <ToggleSwitch
              id={"colorize-by-attribute"}
              checked={showColorizeByAttribute}
              onChange={onColorizeByAttributeClick}
            />
          </AttributeColorize>
          {showColorizeByAttribute && (
            <FadeContainer>
              <Fade />
            </FadeContainer>
          )}
        </Container>
      )}
    </>
  );
};
