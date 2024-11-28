import type {
  ArcGISWebSceneData,
  OperationalLayer,
} from "@loaders.gl/i3s/src/types";

import { useState } from "react";
import styled, { css } from "styled-components";
import { load } from "@loaders.gl/core";

import {
  type LayerExample,
  type ListItemType,
  type BaseMap,
  type LayerViewState,
  type Bookmark,
  type PageId,
  type ComparisonSideMode,
  BaseMapGroup,
} from "../../types";
import { CloseButton } from "../close-button/close-button";
import { InsertPanel, type CustomLayerData } from "./insert-panel/insert-panel";
import { LayersControlPanel } from "./layers-control-panel";
import { ArcGisControlPanel } from "./arcgis-control-panel";
import { MapOptionPanel } from "./map-options-panel";
import {
  PanelContainer,
  PanelHeader,
  PanelContent,
  PanelHorizontalLine,
  Panels,
} from "../common";
import { LayerSettingsPanel } from "./layer-settings-panel";
import { WarningPanel } from "./warning/warning-panel";
import { useClickOutside } from "../../utils/hooks/use-click-outside-hook";
import { ArcGISWebSceneLoader, type LayerError } from "@loaders.gl/i3s";
import { type ActiveSublayer } from "../../utils/active-sublayer";
import { useAppLayout } from "../../utils/hooks/layout";
import { getTilesetType, convertUrlToRestFormat } from "../../utils/url-utils";
import { convertArcGisSlidesToBookmars } from "../../utils/bookmarks-utils";
import { useAppDispatch } from "../../redux/hooks";
import { addBaseMap } from "../../redux/slices/base-maps-slice";
import { getLayerUrl } from "../../utils/layer-utils";

const EXISTING_AREA_ERROR = "You are trying to add an existing area to the map";

const LAYERS_ERROR_UNSUPPORTED = "There are unsupported layers in the scene:";
const LAYERS_ERROR_SUPPORTED = "Supported layer types:";

const NOT_SUPPORTED_CRS_ERROR =
  "There is no supported CRS system. Only WGS84 is supported.";

const DONT_LOAD_SLIDES_IN_ACROSS_LAYER_MODE =
  "Webscene slides cannot be loaded in Across Layers mode";

enum Tabs {
  Layers,
  MapOptions,
}

interface TabProps {
  $active: boolean;
}

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

  ${({ $active, theme }) =>
    $active &&
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

const LayersList = styled.ul`
  margin-top: 16px;
  padding-left: 25px;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LayerItem = styled.li`
  padding-left: 6px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};

  &::marker {
    color: ${({ theme }) => theme.colors.bullet};
  }
`;

const TitleWrapper = styled.div`
  margin-top: 28px;
  margin-left: 32px;
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

interface LayersPanelProps {
  id: string;
  pageId: PageId;
  layers: LayerExample[];
  sublayers: ActiveSublayer[];
  selectedLayerIds: string[];
  type: ListItemType;
  isAddingBookmarksAllowed?: boolean;
  viewWidth?: number;
  viewHeight?: number;
  side?: ComparisonSideMode;
  onLayerInsert: (layer: LayerExample, bookmarks?: Bookmark[]) => void;
  onLayerSelect: (layer: LayerExample, rootLayer?: LayerExample) => void;
  onLayerDelete: (id: string) => void;
  onUpdateSublayerVisibility: (Sublayer) => void;
  onClose: () => void;
  onPointToLayer: (viewState?: LayerViewState) => void;
  onBuildingExplorerOpened: (opened: boolean) => void;
}

const getPath = (url: string | File) => getLayerUrl(url);

export const LayersPanel = ({
  id,
  pageId,
  type,
  layers,
  sublayers,
  selectedLayerIds,
  onLayerInsert,
  onLayerSelect,
  onLayerDelete,
  isAddingBookmarksAllowed = true,
  viewWidth = 1024,
  viewHeight = 768,
  side,
  onUpdateSublayerVisibility,
  onClose,
  onPointToLayer,
  onBuildingExplorerOpened,
}: LayersPanelProps) => {
  const dispatch = useAppDispatch();
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
  const [showAddingSlidesWarning, setShowAddingSlidesWarning] = useState(false);
  const [unsupportedLayers, setUnsupportedLayers] = useState<string[]>([]);

  useClickOutside([warningNode], () => {
    setShowExistedError(false);
  });

  const handleInsertLayer = (layer: CustomLayerData) => {
    const existedLayer = layers.some(
      (exisLayer) => getPath(exisLayer.url).trim() === getPath(layer.url).trim()
    );

    if (existedLayer) {
      setShowExistedError(true);
      return;
    }

    const id = getPath(layer.url).replace(/" "/g, "-");
    const newLayer: LayerExample = {
      ...layer,
      url: layer.url,
      id,
      custom: true,
      type: getTilesetType(getPath(layer.url)),
    };

    onLayerInsert(newLayer);
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

  const saveLayerTypes = (layers: OperationalLayer[]) => {
    const layerTypes: string[] = [];
    if (layers) {
      for (const layer of layers) {
        if (!layerTypes.find((item) => item === layer.layerType)) {
          layerTypes.push(layer.layerType);
        }
      }
    }
    setUnsupportedLayers(layerTypes);
  };

  // TODO Add loader to show webscene loading
  const handleInsertScene = async (scene: CustomLayerData): Promise<void> => {
    scene.url = convertUrlToRestFormat(getPath(scene.url));

    const existedScene = layers.some(
      (exisLayer) => getPath(exisLayer.url).trim() === getPath(scene.url).trim()
    );

    if (existedScene) {
      setShowSceneInsertPanel(false);
      setShowExistedError(true);
      return;
    }

    try {
      const webScene: ArcGISWebSceneData = (await load(
        scene.url,
        ArcGISWebSceneLoader
      )) as ArcGISWebSceneData;

      if (webScene.unsupportedLayers?.length) {
        saveLayerTypes(webScene.unsupportedLayers);
        setShowNoSupportedLayersInSceneError(true);
      }

      const webSceneLayerExamples = prepareLayerExamples(webScene.layers);

      const newLayer: LayerExample = {
        ...scene,
        url: getPath(scene.url),
        id: getPath(scene.url),
        custom: true,
        layers: webSceneLayerExamples,
        type: getTilesetType(scene.url),
      };

      const newLayersExamples = [...layers, newLayer];
      const isWebsceneHasSlides =
        !!webScene.header?.presentation?.slides?.length;
      const bookmarks =
        isAddingBookmarksAllowed && pageId
          ? convertArcGisSlidesToBookmars(
            webScene.header,
            webSceneLayerExamples,
            newLayersExamples,
            pageId,
            viewWidth,
            viewHeight
          )
          : [];

      if (isWebsceneHasSlides && !isAddingBookmarksAllowed) {
        setShowAddingSlidesWarning(true);
      }

      onLayerInsert(newLayer, bookmarks);
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "NO_AVAILABLE_SUPPORTED_LAYERS_ERROR": {
            const layers = (error as LayerError).details;
            saveLayerTypes(layers as OperationalLayer[]);
            setShowNoSupportedLayersInSceneError(true);
            break;
          }
          case "NOT_SUPPORTED_CRS_ERROR": {
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

  const handleInsertMap = (map: CustomLayerData): void => {
    const id = getPath(map.url).replace(/" "/g, "-");
    if (map.group !== undefined) {
      const newMap: BaseMap = {
        id,
        mapUrl: getPath(map.url),
        name: map.name,
        token: map.token,
        iconId: "Custom",
        custom: true,
        group: map.group,
      };
      dispatch(addBaseMap(newMap));
    }
    setShowInsertMapPanel(false);
  };

  return (
    <PanelContainer id={id} $layout={layout}>
      {!showLayerSettings && (
        <>
          <PanelHeader $panel={Panels.Layers}>
            <Tab
              id="layers-tab"
              $active={tab === Tabs.Layers}
              onClick={() => {
                setTab(Tabs.Layers);
              }}
            >
              Layers
            </Tab>
            <Tab
              id="map-options-tab"
              $active={tab === Tabs.MapOptions}
              onClick={() => {
                setTab(Tabs.MapOptions);
              }}
            >
              Map Options
            </Tab>
          </PanelHeader>
          <CloseButtonWrapper>
            <CloseButton id="layers-panel-close-button" onClick={onClose} />
          </CloseButtonWrapper>
          <PanelHorizontalLine />
          <PanelContent>
            {tab === Tabs.Layers && (
              <LayersControlPanel
                layers={layers}
                type={type}
                selectedLayerIds={selectedLayerIds}
                hasSettings={Boolean(sublayers.length)}
                onLayerSelect={onLayerSelect}
                onLayerInsertClick={() => {
                  setShowLayerInsertPanel(true);
                }}
                onSceneInsertClick={() => {
                  setShowSceneInsertPanel(true);
                }}
                onLayerSettingsClick={() => {
                  setShowLayerSettings(true);
                }}
                onPointToLayer={onPointToLayer}
                deleteLayer={onLayerDelete}
              />
            )}
            {tab === Tabs.MapOptions && (
              <MapOptionPanel
                pageId={pageId}
                insertBaseMap={() => {
                  setShowInsertMapPanel(true);
                }}
              />
            )}
          </PanelContent>

          <PanelHorizontalLine $top={0} $bottom={0} />

          <PanelContent>
            <ArcGisControlPanel onArcGisImportClick={handleInsertLayer} />
          </PanelContent>

          {showExistedError && (
            <PanelWrapper
              ref={(element) => {
                setWarningNode(element);
              }}
            >
              <WarningPanel
                title={EXISTING_AREA_ERROR}
                onConfirm={() => {
                  setShowExistedError(false);
                }}
              />
            </PanelWrapper>
          )}
          {showNoSupportedLayersInSceneError && (
            <PanelWrapper
              ref={(element) => {
                setWarningNode(element);
              }}
            >
              <WarningPanel
                title={LAYERS_ERROR_UNSUPPORTED}
                onConfirm={() => {
                  setShowNoSupportedLayersInSceneError(false);
                }}
              >
                <>
                  <LayersList>
                    {unsupportedLayers.map((layer) => {
                      return <LayerItem key={layer}>{layer}</LayerItem>;
                    })}
                  </LayersList>

                  <TitleWrapper>{LAYERS_ERROR_SUPPORTED}</TitleWrapper>

                  <LayersList>
                    <LayerItem>IntegratedMesh</LayerItem>
                    <LayerItem>3DObjects</LayerItem>
                    <LayerItem>Building</LayerItem>
                  </LayersList>
                </>
              </WarningPanel>
            </PanelWrapper>
          )}
          {showNoSupportedCRSInSceneError && (
            <PanelWrapper
              ref={(element) => {
                setWarningNode(element);
              }}
            >
              <WarningPanel
                title={NOT_SUPPORTED_CRS_ERROR}
                onConfirm={() => {
                  setShowNoSupportedCRSInSceneError(false);
                }}
              />
            </PanelWrapper>
          )}

          {showAddingSlidesWarning && (
            <PanelWrapper
              ref={(element) => {
                setWarningNode(element);
              }}
            >
              <WarningPanel
                title={DONT_LOAD_SLIDES_IN_ACROSS_LAYER_MODE}
                onConfirm={() => {
                  setShowAddingSlidesWarning(false);
                }}
              />
            </PanelWrapper>
          )}
          {showLayerInsertPanel && (
            <PanelWrapper>
              <InsertPanel
                title={"Insert Layer"}
                onInsert={(layer) => {
                  handleInsertLayer(layer);
                  setShowLayerInsertPanel(false);
                }}
                onCancel={() => {
                  setShowLayerInsertPanel(false);
                }}
              />
            </PanelWrapper>
          )}
          {showSceneInsertPanel && (
            <PanelWrapper>
              <InsertPanel
                title={"Insert Scene"}
                onInsert={async (scene) => {
                  await handleInsertScene(scene);
                }}
                onCancel={() => {
                  setShowSceneInsertPanel(false);
                }}
              />
            </PanelWrapper>
          )}
        </>
      )}
      {showLayerSettings && (
        <LayerSettingsPanel
          sublayers={sublayers}
          onUpdateSublayerVisibility={onUpdateSublayerVisibility}
          onBackClick={() => {
            setShowLayerSettings(false);
          }}
          onBuildingExplorerOpened={onBuildingExplorerOpened}
          onCloseClick={onClose}
          side={side}
        />
      )}

      {showInsertMapPanel && (
        <PanelWrapper>
          <InsertPanel
            title={"Insert Base Map"}
            groups={[BaseMapGroup.Maplibre]}
            onInsert={(map) => {
              handleInsertMap(map);
            }}
            onCancel={() => {
              setShowInsertMapPanel(false);
            }}
          />
        </PanelWrapper>
      )}
    </PanelContainer>
  );
};
