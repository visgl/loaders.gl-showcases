import { useState } from "react";
import styled, { css } from "styled-components";
import { EXAMPLES } from "../../constants/i3s-examples";
import { LayerExample, ListItemType, Theme } from "../../types";

import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import { InsertPanel } from "../insert-panel/insert-panel";
import { LayersControlPanel } from "./layers-control-panel";

enum Tabs {
  Layers,
  MapOptions,
}

type LayersPanelProps = {
  id: string;
  type: ListItemType;
  baseMaps: any[];
  onLayersSelect: (ids: LayerExample[]) => void;
  onClose: () => void;
};

type TabProps = {
  active: boolean;
};

type LayoutProps = {
  layout: string;
};

const Container = styled.div<LayoutProps>`
  display: flex;
  flex-direction: column;
  width: 359px;
  background: ${({ theme }) => theme.colors.mainCanvasColor};
  opacity: ${({ theme }) => (theme.name === Theme.Dark ? 0.9 : 1)};
  border-radius: 8px;
  padding-bottom: 26px;
  position: relative;

  max-height: ${getCurrentLayoutProperty({
    desktop: "408px",
    tablet: "408px",
    mobile: "calc(50vh - 110px)",
  })};
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  position: relative;
  border-radius: 8px;
  margin-top: 20px;
  gap: 32px;
`;

const Tab = styled.div<TabProps>`
  position: relative;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.fontColor};

  &:hover {
    color: ${({ theme }) => theme.colors.mainHiglightColorInverted};
    &::after {
      border-color: ${({ theme }) => theme.colors.mainHiglightColorInverted};
      background: ${({ theme }) => theme.colors.mainHiglightColorInverted};
    }
  }

  ${({ active, theme }) =>
    active &&
    css`
      &::after {
        content: "";
        position: absolute;
        top: calc(100% + 11px);
        left: -10%;
        border: 1px solid ${theme.colors.fontColor};
        border-radius: 1px;
        background: ${theme.colors.fontColor};
        width: 120%;
      }
    `}
`;

const CloseButton = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  top: 0;
  right: 20px;
  width: 16px;
  height: 16px;
  cursor: pointer;

  &::after,
  &::before {
    content: "";
    position: absolute;
    height: 16px;
    width: 2px;
    background-color: ${({ theme }) => theme.colors.fontColor};
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }

  &:hover {
    &::before,
    &::after {
      background-color: ${({ theme }) => theme.colors.mainDimColorInverted};
    }
  }
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 16px 8px 16px;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
`;

const HorizontalLine = styled.div`
  margin: 35px 16px 16px 16px;
  border: 1px solid ${({ theme }) => theme.colors.mainHiglightColorInverted};
  border-radius: 1px;
  background: ${({ theme }) => theme.colors.mainHiglightColorInverted};
  opacity: 0.12;
`;

const InsertPanelWrapper = styled.div`
  position: absolute;
  top: 24px;
  // Make insert panel centered related to layers panel.
  // 168px is half insert panel width.
  left: calc(50% - 168px);
`;

const getLayerExamples = (): LayerExample[] => Object.values(EXAMPLES);

export const LayersPanel = ({
  id,
  type,
  onLayersSelect,
  onClose,
}: LayersPanelProps) => {
  const [tab, setTab] = useState<Tabs>(Tabs.Layers);
  const [layers, setLayers] = useState<LayerExample[]>(() =>
    getLayerExamples()
  );
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  const [showInsertPanel, setShowInsertPanel] = useState(false);
  const layout = useAppLayout();

  const handleSelectLayers = (id: string, examples?: LayerExample[]): void => {
    let newSelectedLayersIds = selectedLayerIds;
    switch (type) {
      case ListItemType.Radio: {
        newSelectedLayersIds = [id];
        break;
      }
      case ListItemType.Checkbox:
      default: {
        if (selectedLayerIds.includes(id)) {
          newSelectedLayersIds = selectedLayerIds.filter(
            (existedId) => existedId !== id
          );
        } else {
          newSelectedLayersIds = [...selectedLayerIds, id];
        }
      }
    }
    setSelectedLayerIds(newSelectedLayersIds);
    onLayersSelect(
      (examples || layers).filter(({ id }) =>
        newSelectedLayersIds.includes(id || "")
      )
    );
  };

  const handleInsertLayer = (layer: LayerExample) => {
    const id = layer.url.replace(/" "/g, "-");
    const newLayer: LayerExample = {
      ...layer,
      id,
    };

    setLayers((prevValues) => {
      const newLayers = [...prevValues, newLayer];
      handleSelectLayers(id, newLayers);
      return newLayers;
    });
    setShowInsertPanel(false);
  };

  return (
    <Container id={id} layout={layout}>
      <PanelHeader>
        <Tab
          id="layers-tab"
          active={tab === Tabs.Layers}
          onClick={() => setTab(Tabs.Layers)}
        >
          Layers
        </Tab>
        <Tab
          id="map-options-tab"
          active={tab === Tabs.MapOptions}
          onClick={() => setTab(Tabs.MapOptions)}
        >
          Map Options
        </Tab>
        <CloseButton id="layers-panel-close-button" onClick={onClose} />
      </PanelHeader>
      <HorizontalLine />
      <Content>
        {tab === Tabs.Layers && (
          <LayersControlPanel
            layers={layers}
            baseMaps={[]}
            type={type}
            selectedLayerIds={selectedLayerIds}
            onLayersSelect={handleSelectLayers}
            onLayerInsertClick={() => setShowInsertPanel(true)}
          />
        )}
      </Content>

      {showInsertPanel && (
        <InsertPanelWrapper>
          <InsertPanel
            title={"Insert Layer"}
            onInsert={(layer) => handleInsertLayer(layer)}
            onCancel={() => setShowInsertPanel(false)}
          />
        </InsertPanelWrapper>
      )}
    </Container>
  );
};
