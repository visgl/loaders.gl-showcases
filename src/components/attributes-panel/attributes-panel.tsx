import type { StatisticsInfo } from "@loaders.gl/i3s";
import type { FeatureAttributes } from "../../types";

import { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";

import { CloseButton } from "../close-button/close-button";
import { AttributeStats } from "./attributes-stats/attribute-stats";

import { color_brand_tertiary } from "../../constants/colors";

import StatisticsIcon from "../../../public/icons/statistics.svg";
import ArrowLeft from "../../../public/icons/arrow-left.svg";

type RowProps = {
  selectable: boolean;
};

const Container = styled.div`
  position: absolute;
  top: 70px;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-items: center;
  background: ${({ theme }) => theme.colors.mainCanvasColor};
  flex-flow: column;
  width: 360px;
  height: auto;
  min-height: 120px;
  max-height: 75%;
  z-index: 16;
  word-break: break-word;
  border-radius: 8px;
  box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.fontColor};
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  margin: 20px 0px 21px 16px;
`;

const ContentWrapper = styled.div`
  overflow-y: auto;
  padding: 0 16px;
  margin-bottom: 20px;
  width: calc(100% - 32px);
`;

const Row = styled.div<RowProps>`
  display: grid;
  grid-template-columns: 1fr 1fr 24px;
  align-items: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.mainAttibuteItemColor};
  padding: 10px 13px;
  margin-bottom: 4px;
  cursor: ${({ selectable }) => (selectable ? "pointer" : "auto")};

  svg {
    fill: ${({ theme }) => theme.colors.mainToolsPanelIconColor};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.mainAttributeHighlightColor};
  }

  &:hover svg {
    fill: ${color_brand_tertiary};
    opacity: 1;
  }
`;

const RowItem = styled.div`
  display: flex;
  max-width: 80%;
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};

  :nth-child(1) {
    font-weight: 500;
  }

  :nth-child(2n) {
    opacity: 0.8;
  }
`;

const SplitLine = styled.div`
  margin: 0px 15px 16px 15px;
  width: calc(100% - 30px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.mainHiglightColor};
`;

const BackButton = styled(ArrowLeft)`
  margin-left: 16px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const NO_DATA = "No Data";
const STATISTICS_TITLE = "Statistics";

type AttributesPanelProps = {
  title: string;
  tilesetName: string;
  attributes: FeatureAttributes | null;
  tilesetBasePath: string;
  statisticsInfo: StatisticsInfo[] | null;
  onClose: () => void;
};

export const AttributesPanel = ({
  title,
  tilesetName,
  attributes,
  statisticsInfo,
  tilesetBasePath,
  onClose,
}: AttributesPanelProps) => {
  const theme = useTheme();

  const [selectedAttributeStatsInfo, setSelectedAttributeStatsInfo] =
    useState<StatisticsInfo | null>(null);
  const [selectedAttributeName, setSelectedAttributeName] = useState("");

  useEffect(() => {
    setSelectedAttributeStatsInfo(null);
  }, [attributes]);

  const handleRowClick = (
    attributeName: string,
    statisticsInfo: StatisticsInfo | null
  ): void => {
    setSelectedAttributeName(attributeName);
    setSelectedAttributeStatsInfo(statisticsInfo);
  };

  const renderRows = () => {
    const rows: JSX.Element[] = [];

    for (const attributeName in attributes) {
      const attributeValue = formatValue(attributes[attributeName]);
      const attributeStatisticInfo =
        statisticsInfo?.find((stat) => stat.name === attributeName) || null;
      const row = renderItemRow(
        attributeName,
        attributeValue,
        attributeStatisticInfo
      );
      rows.push(row);
    }

    return rows;
  };

  const renderItemRow = (
    key: string,
    value: string,
    attributeStatisticInfo: StatisticsInfo | null
  ): JSX.Element => {
    return (
      <Row
        key={key}
        selectable={Boolean(attributeStatisticInfo)}
        onClick={() => handleRowClick(key, attributeStatisticInfo)}
      >
        <RowItem>{key}</RowItem>
        <RowItem>{value}</RowItem>
        {attributeStatisticInfo && <StatisticsIcon />}
      </Row>
    );
  };

  const formatValue = (value) => {
    return (
      String(value)
        .replace(/[{}']+/g, "")
        .trim() || NO_DATA
    );
  };

  return (
    <Container>
      <HeaderWrapper>
        {selectedAttributeStatsInfo && (
          <BackButton
            data-testid="attributes-panel-back-button"
            fill={theme.colors.fontColor}
            onClick={() => setSelectedAttributeStatsInfo(null)}
          />
        )}
        <Title>
          {(selectedAttributeStatsInfo && STATISTICS_TITLE) || title}
        </Title>
        <CloseButton id="attributes-panel-close-button" onClick={onClose} />
      </HeaderWrapper>
      <SplitLine />
      {!selectedAttributeStatsInfo && (
        <ContentWrapper>{renderRows()}</ContentWrapper>
      )}
      {selectedAttributeStatsInfo && (
        <AttributeStats
          attributeName={selectedAttributeName}
          statisticsInfo={selectedAttributeStatsInfo}
          tilesetName={tilesetName}
          tilesetBasePath={tilesetBasePath}
        />
      )}
    </Container>
  );
};
