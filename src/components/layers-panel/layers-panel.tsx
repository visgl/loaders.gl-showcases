import { useState } from "react";
import styled, { css } from "styled-components";
import { lineGrey, senaryGrey } from "../../constants/colors";
import { ListItemType } from "../../utils/enums";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import { BaseMapList } from "../base-map-list/base-map-list";
import { ListItem } from "../list-item/list-item";
import { PlusButton } from "../plus-button/plus-button";

enum Tabs {
  Layers,
  MapOptions,
}

type LayersPanelProps = {
  id: string;
  layers: any[];
  type: ListItemType;
  baseMaps: any[];
  multipleSelection: boolean;
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
  background: ${(props) => props.theme.colors.panelBackgroundColor};
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
    color: ${senaryGrey};
    &::after {
      background: ${senaryGrey};
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
      background-color: ${senaryGrey};
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
  margin-top: 35px;
  margin-bottom: 16px;
  border: 1px solid ${lineGrey};
  border-radius: 1px;
  background: ${lineGrey};
  width: 100%;
`;

const LayersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 100px);
  overflow: auto;
`;

const LayersList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
`;

const InsertButtons = styled.div<{ item: number }>`
  display: flex;
  flex-direction: column;
  padding-left: 10px;

  > * {
    &:first-child {
      margin-bottom: ${(props) => (props.item === Tabs.Layers ? "28px" : "0px")};
    }
  }
`;

const MapOptionTitle = styled.div`
width: 100;
height: 19px;
font-style: normal;
font-weight: 700;
font-size: 16px;
line-height: 19px;
color: ${({ theme }) => theme.colors.fontColor};
margin-bottom: 24px;
`;


const LayersControlPanel = ({ layers, type }) => {
  return (
    <LayersContainer>
      <LayersList>
        {layers.map((layer) => {
          return (
            <ListItem
              key={layer.id}
              id={layer.id}
              title={layer.name}
              type={type}
              selected={false}
              hasOptions={true}
              onSelect={function (id: string): void {
                throw new Error("Function not implemented.");
              }}
              onOptionsClick={function (id: string): void {
                throw new Error("Function not implemented.");
              }}
            />
          );
        })}
      </LayersList>
      <InsertButtons item={Tabs.Layers}>
        <PlusButton
          text={"Insert layer"}
          tab={Tabs.Layers}
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <PlusButton
          text={"Insert scene"}
          tab={Tabs.Layers}
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </InsertButtons>
    </LayersContainer>
  );
};

const LayersMapOption = ({ baseMaps }) => {
    return (
      <LayersContainer>
        <MapOptionTitle>
          Base Map
        </MapOptionTitle>
        <LayersList>
          {baseMaps.map((baseMap) => {
            return (
              <BaseMapList
                key={baseMap.id}
                id={baseMap.id}
                title={baseMap.name}
                iconUrl={baseMap.url}
                hasOptions={true}
                onOptionsClick={function (id: string): void {
                  throw new Error("Function not implemented.");
                }}
              />
            );
          })}
        </LayersList>
        <InsertButtons item={Tabs.MapOptions}>
          <PlusButton
            tab={Tabs.MapOptions}
            text={"Insert Base Map"}
            onClick={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </InsertButtons>
      </LayersContainer>
    );
  };

export const LayersPanel = ({
  id,
  layers,
  type,
  baseMaps,
  multipleSelection = false,
  onLayerInsert,
  onSceneInsert,
  onBaseMapInsert,
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
      <Content>
        <HorizontalLine />
        {tab === Tabs.Layers ? (
          <LayersControlPanel layers={layers} type={type} />
        ) : (
          <LayersMapOption baseMaps={baseMaps} />
        )}
      </Content>
    </Container>
  );
};
