import { useState } from "react";
import styled, { css } from "styled-components";

import { useAppLayout } from "../../../utils/layout";
import { LayerExample, ListItemType, Sublayer, BaseMap } from "../../../types";
import { CloseButton } from "../../close-button/close-button";
import { InsertPanel } from "../../insert-panel/insert-panel";
import { LayersControlPanel } from "./layers-control-panel";
import { MapOptionPanel } from "./map-options-panel";
import { Container, PanelHeader, HorizontalLine, Panels } from "../common";
import { LayerSettingsPanel } from "./layer-settings-panel";

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
  sublayers: Sublayer[];
  selectedLayerIds: string[];
  type: ListItemType;
  baseMaps: BaseMap[];
  selectedBaseMapId: string;
  insertBaseMap: (baseMap: BaseMap) => void;
  selectBaseMap: (id: string) => void;
  deleteBaseMap: (id: string) => void;
  onLayerInsert: (layer: LayerExample) => void;
  onLayerSelect: (id: string) => void;
  onLayerDelete: (id: string) => void;
  onUpdateSublayerVisibility: (Sublayer) => void;
  onClose: () => void;
  onPointToLayer: () => void;
};

type TabProps = {
  active: boolean;
};

type CustomItem = {
  name: string;
  url: string;
  token?: string;
};

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

const InsertPanelWrapper = styled.div`
  position: absolute;
  top: 24px;
  // Make insert panel centered related to layers panel.
  // 168px is half insert panel width.
  left: calc(50% - 168px);
`;

const CloseButtonWrapper = styled.div`
  position: absolute;
  right: 6px;
  top: 8px;
  width: 44px;
  height: 44px;
  display: flex;
`;

export const LayersPanel = ({
  id,
  type,
  layers,
  sublayers,
  selectedLayerIds,
  onLayerInsert,
  onLayerSelect,
  onLayerDelete,
  baseMaps,
  selectedBaseMapId,
  insertBaseMap,
  selectBaseMap,
  deleteBaseMap,
  onUpdateSublayerVisibility,
  onClose,
  onPointToLayer,
}: LayersPanelProps) => {
  const [tab, setTab] = useState<Tabs>(Tabs.Layers);

  const [showInsertPanel, setShowInsertPanel] = useState(false);
  const [showLayerSettings, setShowLayerSettings] = useState(false);
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

  const handleInsertMap = (map: CustomItem) => {
    const id = map.url.replace(/" "/g, "-");
    const newMap: BaseMap = {
      id,
      mapUrl: map.url,
      name: map.name,
      token: map.token,
      custom: true,
    };

    insertBaseMap(newMap);
    setShowInsertMapPanel(false);
  };

  return (
    <Container id={id} layout={layout}>
      {!showLayerSettings && (
        <>
          <PanelHeader panel={Panels.Layers}>
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
          </PanelHeader>
          <CloseButtonWrapper>
            <CloseButton id="layers-panel-close-button" onClick={onClose} />
          </CloseButtonWrapper>
          <HorizontalLine />
          <Content>
            {tab === Tabs.Layers && (
              <LayersControlPanel
                layers={layers}
                type={type}
                selectedLayerIds={selectedLayerIds}
                hasSettings={Boolean(sublayers.length)}
                onLayerSelect={onLayerSelect}
                onLayerInsertClick={() => setShowInsertPanel(true)}
                onLayerSettingsClick={() => setShowLayerSettings(true)}
                onPointToLayer={onPointToLayer}
                deleteLayer={onLayerDelete}
              />
            )}
            {tab === Tabs.MapOptions && (
              <MapOptionPanel
                baseMaps={baseMaps}
                selectedBaseMapId={selectedBaseMapId}
                selectBaseMap={selectBaseMap}
                insertBaseMap={() => setShowInsertMapPanel(true)}
                deleteBaseMap={deleteBaseMap}
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
        </>
      )}
      {showLayerSettings && (
        <LayerSettingsPanel
          sublayers={sublayers}
          onUpdateSublayerVisibility={onUpdateSublayerVisibility}
          onBackClick={() => setShowLayerSettings(false)}
          onCloseClick={onClose}
        />
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
