import { useState } from "react";
import styled, { css } from "styled-components";
import { EXAMPLES } from "../../constants/i3s-examples";
import { LayerExample, ListItemType, Theme } from "../../types";

import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import { InsertPanel } from "../insert-panel/insert-panel";
import { LayersControlPanel } from "./layers-control-panel";
import { MapOptionPanel } from "./map-options-panel";
import DarkMap from "../../../public/icons/dark-map.png";
import LightMap from "../../../public/icons/light-map.png";
import TerrainMap from "../../../public/icons/terrain-map.png";

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
  onMapsSelect: (maps) => void;
  onLayersSelect: (ids: LayerExample[]) => void;
  onClose: () => void;
  onPointToLayer: () => void;
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

const BASE_MAPS = [
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
  const [maps] = useState(BASE_MAPS);
  const [layers, setLayers] = useState<LayerExample[]>(() =>
    getLayerExamples()
  );
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  const [selectedMap, setSelectedMap] = useState<string>("Dark");
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

  const handleSelectMaps = (id: string): void => {
    setSelectedMap(id);
    onMapsSelect(maps.find((map) => map.id === id));
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

  const deleteLayer = (id: string) => {
    setLayers((prevValues) => {
      handleSelectLayers("");
      return prevValues.filter(({ id: layerId }) => layerId !== id);
    });
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
            onBaseMapInsert={function (): void {
              throw new Error("Function not implemented.");
            }}
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
