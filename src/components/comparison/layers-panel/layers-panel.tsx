import { useState } from "react";
import styled, { css } from "styled-components";

import { useAppLayout } from "../../../utils/layout";
import { LayerExample, ListItemType, Sublayer, BaseMap } from "../../../types";
import { CloseButton } from "../../close-button/close-button";
import { InsertPanel } from "../../insert-panel/insert-panel";
import { LayersControlPanel } from "./layers-control-panel";
import { MapOptionPanel } from "./map-options-panel";
import {
  Container,
  PanelHeader,
  Content,
  HorizontalLine,
  Panels,
} from "../common";
import { LayerSettingsPanel } from "./layer-settings-panel";
import { WarningPanel } from "./warning/warning-panel";
import { useClickOutside } from "../../../utils/hooks/use-click-outside-hook";
import { ActiveSublayer } from "../../../utils/active-sublayer";

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
  sublayers: ActiveSublayer[];
  selectedLayerIds: string[];
  type: ListItemType;
  baseMaps: BaseMap[];
  selectedBaseMapId: string;
  insertBaseMap: (baseMap: BaseMap) => void;
  selectBaseMap: (id: string) => void;
  deleteBaseMap: (id: string) => void;
  onLayerInsert: (layer: LayerExample) => void;
  onLayerSelect: (id: string, parentId?: string) => void;
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

const PanelWrapper = styled.div`
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

const EXISTING_AREA_WARNING =
  "You are trying to add an existing area to the map";

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
  const [showExistedLayerWarning, setShowExistedLayerWarning] = useState(false);
  const layout = useAppLayout();
  const [warningNode, setWarningNode] = useState<HTMLDivElement | null>(null);
  useClickOutside([warningNode], () => setShowExistedLayerWarning(false));

  const handleInsertLayer = (layer: {
    name: string;
    url: string;
    token?: string;
  }) => {
    const existedLayer = layers.some(
      (exisLayer) => exisLayer.url.trim() === layer.url.trim()
    );

    if (existedLayer) {
      setShowInsertPanel(false);
      setShowExistedLayerWarning(true);
      return;
    }

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

          {showExistedLayerWarning && (
            <PanelWrapper ref={(element) => setWarningNode(element)}>
              <WarningPanel
                title={EXISTING_AREA_WARNING}
                onConfirm={() => setShowExistedLayerWarning(false)}
              />
            </PanelWrapper>
          )}

          {showInsertPanel && (
            <PanelWrapper>
              <InsertPanel
                title={"Insert Layer"}
                onInsert={(layer) => handleInsertLayer(layer)}
                onCancel={() => setShowInsertPanel(false)}
              />
            </PanelWrapper>
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
        <PanelWrapper>
          <InsertPanel
            title={"Insert Base Map"}
            onInsert={(map) => handleInsertMap(map)}
            onCancel={() => setShowInsertMapPanel(false)}
          />
        </PanelWrapper>
      )}
    </Container>
  );
};
