import { useState } from "react";
import styled, { css } from "styled-components";
import { EXAMPLES } from "../../constants/i3s-examples";
import { EXAMPLES_BASE_MAP } from "../../constants/map-styles";
import { ListItemType, Theme } from "../../types";

import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import { LayersControlPanel } from "./layers-control-panel";
import { MapOptionPanel } from "./map-options-panel";

enum Tabs {
  Layers,
  MapOptions,
}

enum ButtonSizes {
  Small,
  Big,
}

type LayersPanelProps = {
  id: string;
  type: ListItemType;
  onLayersSelect: (ids: string[]) => void;
  onMapClick: ({ selectedMapStyle }) => void;
  onTerrainClick: () => void;
  onClose: () => void;
};

type TabProps = {
  active: boolean;
};

type LayoutProps = {
  layout: string;
};

type LayersIds = string[];

const Container = styled.div<LayoutProps>`
  display: flex;
  flex-direction: column;
  width: 359px;
  background: ${({ theme }) => theme.colors.mainCanvasColor};
  opacity: ${({ theme }) => (theme.name === Theme.Dark ? 0.9 : 1)};
  border-radius: 8px;
  padding-bottom: 26px;

  max-height: ${getCurrentLayoutProperty({
    desktop: "408px",
    tablet: "408px",
    mobile: "calc(50vh - 82px)",
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

const getLayerExamples = () => Object.values(EXAMPLES);

export const LayersPanel = ({
  id,
  type,
  onLayersSelect,
  onMapClick,
  onTerrainClick,
  onClose,
}: LayersPanelProps) => {
  const [tab, setTab] = useState<Tabs>(Tabs.Layers);
  const [layers] = useState(() => getLayerExamples());
  const [maps] = useState(EXAMPLES_BASE_MAP);
  const [selectedLayerIds, setSelectedLayerIds] = useState<LayersIds>([]);
  const layout = useAppLayout();

  const handleSelectLayers = (id: string): void => {
    switch (type) {
      case ListItemType.Radio: {
        setSelectedLayerIds([id]);
        break;
      }
      case ListItemType.Checkbox: {
        if (selectedLayerIds.includes(id)) {
          setSelectedLayerIds((prevValues) =>
            prevValues.filter((existedId) => existedId !== id)
          );
        } else {
          setSelectedLayerIds((prevValues) => [...prevValues, id]);
        }
      }
    }
    onLayersSelect(selectedLayerIds);
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
            insertButtonSize={ButtonSizes.Small}
            layers={layers}
            type={type}
            selectedLayerIds={selectedLayerIds}
            onLayersSelect={handleSelectLayers}
            onLayerOptionsClick={function (): void {
              throw new Error("Function not implemented.");
            }}
            onLayerInsert={function (): void {
              throw new Error("Function not implemented.");
            }}
            onSceneInsert={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
        {tab === Tabs.MapOptions && (
          <MapOptionPanel
            insertButtonSize={ButtonSizes.Big}
            baseMaps={maps}
            onMapClick={onMapClick}
            onTerrainClick={onTerrainClick}
            onMapOptionsClick={function (): void {
              throw new Error("Function not implemented.");
            }}
            onBaseMapInsert={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
      </Content>
    </Container>
  );
};
