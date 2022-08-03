import { useState } from "react";
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
  padding: 0 16px 8px 0;
  margin-bottom: ${({ bottom = 0 }) => `${bottom}px`};
`;

type ComparisonParamsProps = {
  id: string;
  onClose: () => void;
};

export const MemoryUsagePanel = ({ id, onClose }: ComparisonParamsProps) => {
  const [expandState, setExpandState] = useState<ExpandState>(
    ExpandState.expanded
  );
  const theme = useTheme();
  const layout = useAppLayout();

  const LINK =
    "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0";

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
        <StatSection>
          <Title bottom={12}>Memory Usage</Title>
          <StatContainer>
            <StatTitle>Buffer Memory</StatTitle>
            <Title>0 Bytes</Title>
          </StatContainer>
          <StatContainer>
            <StatTitle>Texture Memory</StatTitle>
            <Title>13.82 MB</Title>
          </StatContainer>
          <StatContainer>
            <StatTitle>Renderbuffer Memory</StatTitle>
            <Title>0 bytes</Title>
          </StatContainer>
          <StatContainer>
            <StatTitle>GPU Memory</StatTitle>
            <Title>92.18MB</Title>
          </StatContainer>
        </StatSection>
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
                <StatTitle>{`${LINK.substring(0, 37)}...`}</StatTitle>
                <LinkIcon
                  fill={theme.colors.fontColor}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigator.clipboard.writeText(LINK);
                  }}
                />
              </StatContainer>
              <StatContainer>
                <StatTitle>Tiles In Tileset(s)</StatTitle>
                <Title>0</Title>
              </StatContainer>
              <StatContainer>
                <StatTitle>Tiles Loading</StatTitle>
                <Title>0</Title>
              </StatContainer>
              <StatContainer>
                <StatTitle>Tiles In Memory</StatTitle>
                <Title>55</Title>
              </StatContainer>
              <StatContainer>
                <StatTitle>Tiles In View</StatTitle>
                <Title>55</Title>
              </StatContainer>
              <StatContainer>
                <StatTitle>Tiles To Render</StatTitle>
                <Title>55</Title>
              </StatContainer>
              <StatContainer>
                <StatTitle>Tiles Loaded</StatTitle>
                <Title>55</Title>
              </StatContainer>
              <StatContainer>
                <StatTitle>Tiles Unloaded</StatTitle>
                <Title>0</Title>
              </StatContainer>
              <StatContainer>
                <StatTitle>Failed Tile Loads</StatTitle>
                <Title>0</Title>
              </StatContainer>
              <StatContainer>
                <StatTitle>Points/Verticles</StatTitle>
                <Title>0</Title>
              </StatContainer>
              <StatContainer>
                <StatTitle>Tile Memory Use</StatTitle>
                <Title>0 bytes</Title>
              </StatContainer>
            </>
          )}
        </StatSection>
      </Content>
    </Container>
  );
};
