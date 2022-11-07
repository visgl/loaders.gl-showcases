import type { OperationalLayer } from "@loaders.gl/i3s/src/types";

import { useState } from "react";
import styled, { css } from "styled-components";
import { load } from "@loaders.gl/core";

import {
  LayerExample,
  ListItemType,
  BaseMap,
  LayerViewState,
} from "../../../types";
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
import { color_brand_senary } from "../../../constants/colors";
import { LayerSettingsPanel } from "./layer-settings-panel";
import { WarningPanel } from "./warning/warning-panel";
import { useClickOutside } from "../../../utils/hooks/use-click-outside-hook";
import { ArcGisWebSceneLoader } from "@loaders.gl/i3s";
import { ActiveSublayer } from "../../../utils/active-sublayer";
import { useAppLayout } from "../../../utils/hooks/layout";
import { getTilesetType } from "../../../utils/url-utils";

const EXISTING_AREA_ERROR = "You are trying to add an existing area to the map";

const NOT_SUPPORTED_LAYERS_ERROR =
  "There are no supported layers in the scene. Supported layers:";

const NOT_SUPPORTED_CRS_ERROR =
  "There is no supported CRS system. Only WGS84 is supported.";

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
  onLayerSelect: (layer: LayerExample, rootLayer?: LayerExample) => void;
  onLayerDelete: (id: string) => void;
  onUpdateSublayerVisibility: (Sublayer) => void;
  onClose: () => void;
  onPointToLayer: (viewState?: LayerViewState) => void;
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

const SupportedLayersList = styled.ul`
  margin-top: 28px;
  padding-left: 25px;
  margin-bottom: 0;
`;

const SupportedLayerItem = styled.li`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
  margin-bottom: 13px;

  &::marker {
    color: ${color_brand_senary};
  }

  &:last-child {
    margin-bottom: 0px;
  }
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
  const layout = useAppLayout();

  const [tab, setTab] = useState<Tabs>(Tabs.Layers);
  const [showLayerInsertPanel, setShowLayerInsertPanel] = useState(false);
  const [showSceneInsertPanel, setShowSceneInsertPanel] = useState(false);
  const [showLayerSettings, setShowLayerSettings] = useState(false);
  const [showInsertMapPanel, setShowInsertMapPanel] = useState(false);
  const [showExistedError, setShowExistedError] = useState(false);
  const [
    showNoSupportedLayersInSceneError,
    setShowNoSupportedLayersInSceneError,
  ] = useState(false);
  const [showNoSupportedCRSInSceneError, setShowNoSupportedCRSInSceneError] =
    useState(false);
  const [warningNode, setWarningNode] = useState<HTMLDivElement | null>(null);

  useClickOutside([warningNode], () => setShowExistedError(false));

  const handleInsertLayer = (layer: {
    name: string;
    url: string;
    token?: string;
  }) => {
    const existedLayer = layers.some(
      (exisLayer) => exisLayer.url.trim() === layer.url.trim()
    );

    if (existedLayer) {
      setShowLayerInsertPanel(false);
      setShowExistedError(true);
      return;
    }

    const id = layer.url.replace(/" "/g, "-");
    const newLayer: LayerExample = {
      ...layer,
      id,
      custom: true,
      type: getTilesetType(layer.url),
    };

    onLayerInsert(newLayer);
    setShowLayerInsertPanel(false);
  };

  const prepareLayerExamples = (layers: OperationalLayer[]): LayerExample[] => {
    const layersList: LayerExample[] = [];

    for (let index = 0; index < layers.length; index++) {
      const layer = layers[index];

      const layerItem: LayerExample = {
        id: layer.id,
        name: layer.title,
        url: layer.url || "",
        type: getTilesetType(layer.url),
      };

      if (layer?.layers?.length) {
        layerItem.layers = prepareLayerExamples(layer?.layers);
      }

      layersList.push(layerItem);
    }

    return layersList;
  };

  // TODO Add loader to show webscene loading
  const handleInsertScene = async (scene: {
    name: string;
    url: string;
    token?: string;
  }) => {
    const existedScene = layers.some(
      (exisLayer) => exisLayer.url.trim() === scene.url.trim()
    );

    if (existedScene) {
      setShowSceneInsertPanel(false);
      setShowExistedError(true);
      return;
    }

    try {
      const webScene = await load(scene.url, ArcGisWebSceneLoader);
      const layers = prepareLayerExamples(webScene.layers);

      const newLayer: LayerExample = {
        ...scene,
        id: scene.url,
        custom: true,
        layers,
        type: getTilesetType(scene.url),
      };

      // TODO Check unsupported layers inside webScene to show warning about some layers are not included to the webscene.
      onLayerInsert(newLayer);
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "NO_AVAILABLE_SUPPORTED_LAYERS_ERROR": {
            setShowSceneInsertPanel(false);
            setShowNoSupportedLayersInSceneError(true);
            break;
          }
          case "NOT_SUPPORTED_CRS_ERROR": {
            setShowSceneInsertPanel(false);
            setShowNoSupportedCRSInSceneError(true);
            break;
          }
          default: {
            console.error(error.message);
          }
        }
      }
    } finally {
      setShowSceneInsertPanel(false);
    }
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
                onLayerInsertClick={() => setShowLayerInsertPanel(true)}
                onSceneInsertClick={() => setShowSceneInsertPanel(true)}
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
          {showExistedError && (
            <PanelWrapper ref={(element) => setWarningNode(element)}>
              <WarningPanel
                title={EXISTING_AREA_ERROR}
                onConfirm={() => setShowExistedError(false)}
              />
            </PanelWrapper>
          )}
          {showNoSupportedLayersInSceneError && (
            <PanelWrapper ref={(element) => setWarningNode(element)}>
              <WarningPanel
                title={NOT_SUPPORTED_LAYERS_ERROR}
                onConfirm={() => setShowNoSupportedLayersInSceneError(false)}
              >
                <SupportedLayersList>
                  <SupportedLayerItem>IntegratedMesh</SupportedLayerItem>
                  <SupportedLayerItem>3DObjects</SupportedLayerItem>
                  <SupportedLayerItem>Building</SupportedLayerItem>
                </SupportedLayersList>
              </WarningPanel>
            </PanelWrapper>
          )}
          {showNoSupportedCRSInSceneError && (
            <PanelWrapper ref={(element) => setWarningNode(element)}>
              <WarningPanel
                title={NOT_SUPPORTED_CRS_ERROR}
                onConfirm={() => setShowNoSupportedCRSInSceneError(false)}
              />
            </PanelWrapper>
          )}
          {showLayerInsertPanel && (
            <PanelWrapper>
              <InsertPanel
                title={"Insert Layer"}
                onInsert={(layer) => handleInsertLayer(layer)}
                onCancel={() => setShowLayerInsertPanel(false)}
              />
            </PanelWrapper>
          )}
          {showSceneInsertPanel && (
            <PanelWrapper>
              <InsertPanel
                title={"Insert Scene"}
                onInsert={(scene) => handleInsertScene(scene)}
                onCancel={() => setShowSceneInsertPanel(false)}
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
