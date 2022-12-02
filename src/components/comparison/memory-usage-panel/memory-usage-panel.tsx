import { Stats, Stat } from "@probe.gl/stats";
import styled, { useTheme } from "styled-components";
import {
  PanelContainer,
  PanelHeader,
  PanelContent,
  PanelHorizontalLine,
  Panels,
  Title,
} from "../../common";
import { CloseButton } from "../../close-button/close-button";
import { ExpandIcon } from "../../expand-icon/expand-icon";
import { ExpandState, CollapseDirection, ContentFormats, LayerExample } from "../../../types";
import LinkIcon from "../../../../public/icons/link.svg";
import { useExpand } from "../../../utils/hooks/use-expand";
import { useAppLayout } from "../../../utils/hooks/layout";
import { formatMemory } from "../../../utils/format/format-memory";
import { formatBoolean } from "../../../utils/format/format-utils";

const contentFormatsMap = {
  draco: "Draco",
  meshopt: "Meshopt",
  dds: "DDS",
  ktx2: "KTX2",
};

const StatSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
`;

const StatTitle = styled(Title)`
  color: ${({ theme }) => theme.colors.mainDimColorInverted};
  overflow: hidden; 
  white-space: nowrap;
  max-width: 90%;
  text-overflow: ellipsis;
  font-weight: 400;
`;

const StatContainer = styled.div<{ bottom?: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  activeLayers: LayerExample[];
  tilesetStats?: Stats | null;
  contentFormats?: ContentFormats | null;
  loadingTime: number;
  updateNumber: number;
  onClose: () => void;
};

export const MemoryUsagePanel = ({
  id,
  memoryStats,
  activeLayers,
  tilesetStats,
  contentFormats,
  loadingTime,
  onClose,
}: MemoryUsageProps) => {
  const [expandState, expand] = useExpand(ExpandState.expanded);
  const theme = useTheme();
  const layout = useAppLayout();

  return (
    <PanelContainer id={id} layout={layout}>
      <PanelHeader panel={Panels.MemoryUsage}>
        <Title left={16}>Memory</Title>
        <CloseButton id="memory-usage-panel-close-button" onClick={onClose} />
      </PanelHeader>
      <PanelHorizontalLine top={10} />
      <PanelContent>
        {contentFormats && (
          <StatSection>
            <Title bottom={12}>Content Formats</Title>
            {Object.entries(contentFormats).map(([formatName, isPresented]) => (
              <StatContainer key={formatName}>
                <StatTitle>{contentFormatsMap[formatName]}</StatTitle>
                <Title>{formatBoolean(isPresented)}</Title>
              </StatContainer>
            ))}
          </StatSection>
        )}
      </PanelContent>

      <PanelHorizontalLine top={0} />

      <PanelContent>
        <StatTimeContainer>
          <StatTitle>Loading time: </StatTitle>
          <Title left={6}>{`${loadingTime} ms`}</Title>
        </StatTimeContainer>

        {memoryStats && (
          <StatSection>
            <Title bottom={12}>Memory Usage</Title>
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
              <Title>Layer(s) Used</Title>
              <ExpandIcon
                expandState={expandState}
                collapseDirection={CollapseDirection.bottom}
                onClick={expand}
              />
            </StatContainer>
            {expandState === ExpandState.expanded && (
              <>
                {
                  tilesetStats.id.split('<-tileset->').map(tilesetUrl => {
                    const activeLayer = activeLayers.find(layer => layer.url === tilesetUrl);
                    const activeLayerName = activeLayer?.name || tilesetUrl;

                    return activeLayerName && (
                      <StatContainer bottom={12} key={tilesetUrl}>
                        <StatTitle>{activeLayerName}</StatTitle>
                        <LinkIcon
                          fill={theme.colors.fontColor}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            navigator.clipboard.writeText(tilesetUrl);
                          }}
                        />
                      </StatContainer>
                    );
                  })
                }
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
      </PanelContent>
    </PanelContainer>
  );
};
