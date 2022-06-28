import { useState } from "react";
import styled, { css } from "styled-components";
import { EXAMPLES } from "../../../constants/i3s-examples";
import { LayerExample, ListItemType, BaseMap } from "../../../types";

import { useAppLayout } from "../../../utils/layout";
import { InsertPanel } from "../../insert-panel/insert-panel";
import { LayersControlPanel } from "./layers-control-panel";
import { MapOptionPanel } from "./map-options-panel";
import DarkMap from "../../../../public/icons/dark-map.png";
import LightMap from "../../../../public/icons/light-map.png";
import TerrainMap from "../../../../public/icons/terrain-map.png";
import CustomMap from "../../../../public/icons/custom-map.svg";
import { Container, PanelHeader, CloseButton, HorizontalLine, Panels } from "../common";

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
  type: ListItemType;
  onMapsSelect: (map: BaseMap) => void;
  onLayersSelect: (ids: LayerExample[]) => void;
  onClose: () => void;
  onPointToLayer: () => void;
};

type TabProps = {
  active: boolean;
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

const BASE_MAPS: BaseMap[] = [
  {
    id: "Dark",
    name: "Dark",
    iconUrl: DarkMap,
    mapUrl:
      "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
  },
  {
    id: "Light",
    name: "Light",
    iconUrl: LightMap,
    mapUrl:
      "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
  },
  { id: "Terrain", name: "Terrain", iconUrl: TerrainMap, mapUrl: null },
];
const getLayerExamples = (): LayerExample[] => Object.values(EXAMPLES);

export const LayersPanel = ({
  id,
  type,
  onLayersSelect,
  onMapsSelect,
  onClose,
  onPointToLayer,
}: LayersPanelProps) => {
  const [tab, setTab] = useState<Tabs>(Tabs.Layers);
  const [maps, setMaps] = useState<BaseMap[]>(BASE_MAPS);
  const [layers, setLayers] = useState<LayerExample[]>(() =>
    getLayerExamples()
  );
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  const [selectedMap, setSelectedMap] = useState<string>("Dark");
  const [showInsertPanel, setShowInsertPanel] = useState(false);
  const [showInsertMapPanel, setShowInsertMapPanel] = useState(false);
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

  const handleSelectMaps = (id: string, baseMaps?: BaseMap[]): void => {
    setSelectedMap(id);
    const baseMap = (baseMaps || maps).find((map) => map.id === id);
    baseMap && onMapsSelect(baseMap);
  };

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

    setLayers((prevValues) => {
      const newLayers = [...prevValues, newLayer];
      handleSelectLayers(id, newLayers);
      return newLayers;
    });
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

    setMaps((prevValues) => {
      const newMaps = [...prevValues, newMap];
      handleSelectMaps(id, newMaps);
      return newMaps;
    });
    setShowInsertMapPanel(false);
  };

  const deleteLayer = (id: string) => {
    setLayers((prevValues) => {
      handleSelectLayers("");
      return prevValues.filter(({ id: layerId }) => layerId !== id);
    });
  };

  return (
    <Container id={id} layout={layout}>
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
        <CloseButton id="layers-panel-close-button" onClick={onClose} />
      </PanelHeader>
      <HorizontalLine />
      <Content>
        {tab === Tabs.Layers && (
          <LayersControlPanel
            layers={layers}
            type={type}
            selectedLayerIds={selectedLayerIds}
            onLayersSelect={handleSelectLayers}
            onLayerInsertClick={() => setShowInsertPanel(true)}
            onPointToLayer={onPointToLayer}
            deleteLayer={deleteLayer}
          />
        )}
        {tab === Tabs.MapOptions && (
          <MapOptionPanel
            baseMaps={maps}
            selectedMap={selectedMap}
            onMapsSelect={handleSelectMaps}
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
