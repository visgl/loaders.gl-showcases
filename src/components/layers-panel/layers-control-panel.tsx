import { useCallback, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { ListItemType } from "../../types";

import { ListItem } from "../list-item/list-item";
import { ListItemSettingsPanel } from "../list-item/list-item-settings-panel";
import { PlusButton } from "../plus-button/plus-button";

import LocationIcon from "../../../public/icons/location.svg?svgr";
import DeleteIcon from "../../../public/icons/delete.svg?svgr";
import SettingsIcon from "../../../public/icons/settings.svg?svgr";
import { color_accent_primary } from "../../constants/colors";

type LayersControlPanelProps = {
  layers: any[];
  selectedLayerIds: string[];
  type: ListItemType;
  baseMaps: any[];
  onLayersSelect: (id: string) => void;
};

const LayersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
`;

const LayersList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
`;

const InsertButtons = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 10px;

  > * {
    &:first-child {
      margin-bottom: 28px;
    }
  }
`;

const LayerSettingsItem = styled.div<{
  customColor?: string;
  opacity?: number;
}>`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  padding: 10px 0px;
  color: ${({ theme, customColor }) =>
    customColor ? customColor : theme.colors.fontColor};
  opacity: ${({ opacity = 1 }) => opacity};
  display: flex;
  gap: 10px;
  cursor: pointer;
`;

const LayerSettingsIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
`;

const Devider = styled.div`
  height: 1px;
  width: 100%;
  border-top: 1px solid #393a45;
`;

export const LayersControlPanel = ({
  layers,
  type,
  selectedLayerIds,
  onLayersSelect,
}: LayersControlPanelProps) => {
  const settingsForItemRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [settingsLayerId, setSettingsLayerId] = useState<string>("");
  const [showLayerSettings, setShowLayerSettings] = useState<boolean>(false);
  const theme = useTheme();

  const addRefNode = useCallback(
    (node: HTMLDivElement | null, layerId: string) => {
      if (node !== null) {
        settingsForItemRef.current.set(layerId, node);
      }
    },
    []
  );

  return (
    <LayersContainer>
      <LayersList>
        {layers.map((layer) => {
          const isLayerSelected = selectedLayerIds.includes(layer.id);

          return (
            <ListItem
              ref={(node) => addRefNode(node, layer.id)}
              key={layer.id}
              id={layer.id}
              title={layer.name}
              type={type}
              selected={isLayerSelected}
              hasOptions={true}
              onChange={onLayersSelect}
              onOptionsClick={() => {
                setShowLayerSettings(true);
                setSettingsLayerId(layer.id);
              }}
            />
          );
        })}
      </LayersList>
      <InsertButtons>
        <PlusButton>Insert layer</PlusButton>
        <PlusButton>Insert scene</PlusButton>
      </InsertButtons>
      {showLayerSettings && (
        <ListItemSettingsPanel
          onCloseHandler={() => setShowLayerSettings(false)}
          forElementNode={settingsForItemRef.current.get(settingsLayerId)}
        >
          <LayerSettingsItem>
            <LayerSettingsIcon>
              <LocationIcon fill={theme.colors.fontColor} />
            </LayerSettingsIcon>
            Point to layer
          </LayerSettingsItem>
          <LayerSettingsItem>
            <LayerSettingsIcon>
              <SettingsIcon fill={theme.colors.fontColor} />
            </LayerSettingsIcon>
            Layer settings
          </LayerSettingsItem>
          <Devider />
          <LayerSettingsItem customColor={color_accent_primary} opacity={0.8}>
            <LayerSettingsIcon>
              <DeleteIcon fill={color_accent_primary} />
            </LayerSettingsIcon>
            Delete layer
          </LayerSettingsItem>
        </ListItemSettingsPanel>
      )}
    </LayersContainer>
  );
};
