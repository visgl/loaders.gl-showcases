import { useState } from "react";
import styled, { css } from "styled-components";
import { LayerExample, ListItemType, Theme, BaseMap } from "../../types";

import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import { InsertPanel } from "../insert-panel/insert-panel";
import { LayersControlPanel } from "./layers-control-panel";
import { MapOptionPanel } from "./map-options-panel";

import CustomMap from "../../../public/icons/custom-map.svg";

enum Tabs {
  Layers,
  MapOptions,
}

export enum ButtonSize {
  Small,
  Big,
}

type LayersPanelProps = {
  id: string;
  layers: LayerExample[];
  selectedLayerIds: string[];
  type: ListItemType;
  baseMaps: BaseMap[];
  selectedBaseMapId: string;
  onBaseMapInsert: (baseMap: BaseMap) => void;
  onBaseMapSelect: (id: string) => void;
  onBaseMapDelete: (id: string) => void;
  onMapsSelect: (map: BaseMap) => void;
  onLayerSelect: (id: string) => void;
  onLayerInsert: (layer: LayerExample) => void;
  onClose: () => void;
  onPointToLayer: () => void;
  onLayerDelete: (id: string) => void;
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

export const LayersPanel = ({
  id,
  type,
  layers,
  selectedLayerIds,
  onLayerInsert,
  onLayerSelect,
  onLayerDelete,
  baseMaps,
  selectedBaseMapId,
  onBaseMapInsert,
  onBaseMapSelect,
  onClose,
  onPointToLayer,
}: LayersPanelProps) => {
  const [tab, setTab] = useState<Tabs>(Tabs.Layers);

  const [showInsertPanel, setShowInsertPanel] = useState(false);
  const [showInsertMapPanel, setShowInsertMapPanel] = useState(false);
  const layout = useAppLayout();

  const handleInsertLayer = (layer: {
    name: string;
    url: string;
    token?: string;
  }) => {
    const id = layer.url.replace(/" "/g, "-");
    const newLayer: LayerExample = {
      ...layer,
      id,
      custom: true,
    };

    onLayerInsert(newLayer);
    setShowInsertPanel(false);
  };

  const handleInsertMap = (map) => {
    const id = map.url.replace(/" "/g, "-");
    const newMap = {
      id,
      mapUrl: map.url,
      name: map.name,
      token: map.token,
      iconUrl: CustomMap,
    };

    onBaseMapInsert(newMap);
    setShowInsertMapPanel(false);
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
            type={type}
            selectedLayerIds={selectedLayerIds}
            onLayerSelect={onLayerSelect}
            onLayerInsertClick={() => setShowInsertPanel(true)}
            onPointToLayer={onPointToLayer}
            deleteLayer={onLayerDelete}
          />
        )}
        {tab === Tabs.MapOptions && (
          <MapOptionPanel
            baseMaps={baseMaps}
            selectedBaseMapId={selectedBaseMapId}
            onMapsSelect={onBaseMapSelect}
            onMapOptionsClick={function (): void {
              throw new Error("Function not implemented.");
            }}
            onBaseMapInsert={() => setShowInsertMapPanel(true)}
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

      {showInsertMapPanel && (
        <InsertPanelWrapper>
          <InsertPanel
            title={"Insert Base Map"}
            onInsert={(map) => handleInsertMap(map)}
            onCancel={() => setShowInsertMapPanel(false)}
          />
        </InsertPanelWrapper>
      )}
    </Container>
  );
};
