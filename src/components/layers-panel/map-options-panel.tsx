import { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { BaseMapListItem } from "./base-map-list-item";
import { PlusButton } from "../plus-button/plus-button";
import { ButtonSize } from "./layers-panel";
import { LayerSettingsMenu } from "./layer-settings-menu";
import { color_accent_primary } from "../../constants/colors";
import DeleteIcon from "../../../public/icons/delete.svg?svgr";

type MapOptionPanelProps = {
  baseMaps: any[];
  selectedMap: string;
  onMapsSelect: (id: string) => void;
  onBaseMapInsert: () => void;
};

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

const MapOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
`;

const MapList = styled.div`
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
      margin-bottom: 0px;
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

export const MapOptionPanel = ({
  baseMaps,
  selectedMap,
  onMapsSelect,
  onBaseMapInsert,
}: MapOptionPanelProps) => {
  const settingsForItemRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [settingsMapId, setSettingsMapId] = useState<string>("");
  const [showMapSettings, setShowMapSettings] = useState<boolean>(false);

  const addRefNode = useCallback(
    (node: HTMLDivElement | null, layerId: string) => {
      if (node !== null) {
        settingsForItemRef.current.set(layerId, node);
      }
    },
    []
  );

  const renderSettingsMenu = () => {
    if (!showMapSettings || !settingsMapId) {
      return null;
    }
    return (
      <LayerSettingsMenu
        onCloseHandler={() => setShowMapSettings(false)}
        forElementNode={settingsForItemRef.current.get(settingsMapId)}
      >
        <LayerSettingsItem
          customColor={color_accent_primary}
          opacity={0.8}
          onClick={() => {
            setShowMapSettings(false);
          }}
        >
          <LayerSettingsIcon>
            <DeleteIcon fill={color_accent_primary} />
          </LayerSettingsIcon>
          Delete layer
        </LayerSettingsItem>
      </LayerSettingsMenu>
    );
  };
  return (
    <MapOptionsContainer>
      <MapOptionTitle>Base Map</MapOptionTitle>
      <MapList>
        {baseMaps.map((baseMap) => {
          const isMapSelected = selectedMap === baseMap.id;
          return (
            <BaseMapListItem
              ref={(node) => addRefNode(node, baseMap.id)}
              key={baseMap.id}
              id={baseMap.id}
              title={baseMap.name}
              iconUrl={baseMap.iconUrl}
              selected={isMapSelected}
              hasOptions={true}
              onOptionsClick={() => {
                setShowMapSettings(true);
                setSettingsMapId(baseMap.id);
              }}
              onMapsSelect={onMapsSelect}
            />
          );
        })}
      </MapList>
      <InsertButtons>
        <PlusButton buttonSize={ButtonSize.Big} onClick={onBaseMapInsert}>
          Insert Base Map
        </PlusButton>
      </InsertButtons>
      {renderSettingsMenu()}
    </MapOptionsContainer>
  );
};
