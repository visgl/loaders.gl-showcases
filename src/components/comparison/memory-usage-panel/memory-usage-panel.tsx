import { useState } from "react";
import { Stats, Stat } from "@probe.gl/stats";
import styled, { useTheme } from "styled-components";
import { useAppLayout } from "../../../utils/layout";
import {
  Container,
  PanelHeader,
  Content,
  HorizontalLine,
  Panels,
  Title,
  ItemContainer,
} from "../common";
import { CloseButton } from "../../close-button/close-button";
import { ExpandIcon } from "../../expand-icon/expand-icon";
import { ExpandState, CollapseDirection } from "../../../types";
import { formatMemory } from "../../../utils/format-memory";
import LinkIcon from "../../../../public/icons/link.svg";

const StatSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
`;

const StatTitle = styled(Title)`
  color: ${({ theme }) => theme.colors.mainDimColorInverted};
  font-weight: 400;
`;

const StatContainer = styled(ItemContainer)<{ bottom?: number }>`
  padding: 0 0 8px 0;
  margin-bottom: ${({ bottom = 0 }) => `${bottom}px`};
`;

const StatTimeContainer = styled.div`
  display: flex;
  justify-content: row;
  align-items: center;
  padding: 0 0 8px 0;
  margin-bottom: 16px;
  margin-top: 14px;
`;

type MemoryUsageProps = {
  id: string;
  memoryStats: Stats | null;
  tilesetStats?: Stats | null;
  loadingTime: number;
  onClose: () => void;
};

export const MemoryUsagePanel = ({
  id,
  memoryStats,
  tilesetStats,
  loadingTime,
  onClose,
}: MemoryUsageProps) => {
  const [expandState, setExpandState] = useState<ExpandState>(
    ExpandState.expanded
  );
  const theme = useTheme();
  const layout = useAppLayout();

  const onExpandClickHandler = () => {
    setExpandState((prev) => {
      if (prev === ExpandState.expanded) {
        return ExpandState.collapsed;
      }
      return ExpandState.expanded;
    });
  };

  return (
    <Container id={id} layout={layout}>
      <PanelHeader panel={Panels.MemoryUsage}>
        <Title left={16}>Memory</Title>
        <CloseButton id="memory-usage-panel-close-button" onClick={onClose} />
      </PanelHeader>
      <HorizontalLine top={10} />
      <Content>
        <StatTimeContainer>
          <StatTitle>Loading time: </StatTitle>
          <Title left={6}>{`${loadingTime} ms`}</Title>
        </StatTimeContainer>
        {memoryStats && (
          <StatSection>
            <Title bottom={12}>{memoryStats.id}</Title>
            {Object.values(memoryStats.stats).map((stat: Stat) => (
              <StatContainer key={stat.name}>
                <StatTitle>{stat.name}</StatTitle>
                <Title>{formatMemory(stat.count)}</Title>
              </StatContainer>
            ))}
          </StatSection>
        )}

        {tilesetStats && (
          <StatSection>
            <StatContainer>
              <Title>Layer Used</Title>
              <ExpandIcon
                expandState={expandState}
                collapseDirection={CollapseDirection.bottom}
                onClick={onExpandClickHandler}
              />
            </StatContainer>
            {expandState === ExpandState.expanded && (
              <>
                <StatContainer bottom={12}>
                  <StatTitle>{`${tilesetStats.id.substring(
                    0,
                    37
                  )}...`}</StatTitle>
                  <LinkIcon
                    fill={theme.colors.fontColor}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(tilesetStats.id);
                    }}
                  />
                </StatContainer>
                {Object.values(tilesetStats.stats).map((stat: Stat) => (
                  <StatContainer key={stat.name}>
                    <StatTitle>{stat.name}</StatTitle>
                    <Title>
                      {stat.type === "count"
                        ? stat.count
                        : formatMemory(stat.count)}
                    </Title>
                  </StatContainer>
                ))}
              </>
            )}
          </StatSection>
        )}
      </Content>
    </Container>
  );
};
