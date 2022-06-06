import { useState } from "react";
import styled, { css } from "styled-components";
import {
  color_canvas_inverted,
  color_brand_tertiary,
} from "../../constants/colors";
import { ListItemType, Theme } from "../../types";

import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import { LayersControlPanel } from "./layers-control-panel";

enum Tabs {
  Layers,
  MapOptions,
}

type LayersPanelProps = {
  id: string;
  layers: any[];
  selectedLayerIds: string[];
  type: ListItemType;
  baseMaps: any[];
  onLayersSelect: (id: string) => void;
  onLayerInsert: () => void;
  onSceneInsert: () => void;
  onBaseMapInsert: () => void;
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
  background: ${({ theme }) => theme.colors.panelBgColor};
  opacity: ${({ theme }) => (theme.name === Theme.Dark ? 0.9 : 1)};
  border-radius: 8px;
  padding-bottom: 26px;

  max-height: ${getCurrentLayoutProperty({
    default: "408px",
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
    color: ${({ theme }) => theme.colors.tabHover};
    &::after {
      border-color: ${({ theme }) => theme.colors.tabHover};
      background: ${({ theme }) => theme.colors.tabHover};
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
      background-color: ${color_brand_tertiary};
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
  border: 1px solid ${color_canvas_inverted};
  border-radius: 1px;
  background: ${color_canvas_inverted};
  opacity: 0.12;
`;

export const LayersPanel = ({
  id,
  layers,
  selectedLayerIds,
  type,
  onLayersSelect,
  onClose,
}: LayersPanelProps) => {
  const [tab, setTab] = useState<Tabs>(Tabs.Layers);
  const layout = useAppLayout();

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
            onLayersSelect={onLayersSelect}
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
      </Content>
    </Container>
  );
};
