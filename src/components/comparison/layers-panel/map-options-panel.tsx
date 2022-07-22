import { useCallback, useRef, useState, Fragment } from "react";
import styled from "styled-components";
import { BaseMapListItem } from "./base-map-list-item/base-map-list-item";
import { PlusButton } from "../../plus-button/plus-button";
import { ButtonSize } from "./layers-panel";
import { SettingsMenu } from "./settings-menu";
import { color_accent_primary } from "../../../constants/colors";
import DeleteIcon from "../../../../public/icons/delete.svg";
import { DeleteConfirmation } from "./delete-confirmation";
import { BaseMap } from "../../../types";

type MapOptionPanelProps = {
  baseMaps: BaseMap[];
  selectedBaseMapId: string;
  selectBaseMap: (id: string) => void;
  insertBaseMap: () => void;
  deleteBaseMap: (id: string) => void;
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
  position: relative;
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

const MapSettingsItem = styled.div<{
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

const MapSettingsIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
`;

export const MapOptionPanel = ({
  baseMaps,
  selectedBaseMapId,
  selectBaseMap,
  insertBaseMap,
  deleteBaseMap,
}: MapOptionPanelProps) => {
  const settingsForItemRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [settingsMapId, setSettingsMapId] = useState<string>("");
  const [showMapSettings, setShowMapSettings] = useState<boolean>(false);
  const [mapToDeleteId, setMapToDeleteId] = useState<string>("");

  const addRefNode = useCallback(
    (node: HTMLDivElement | null, mapId: string) => {
      if (node !== null) {
        settingsForItemRef.current.set(mapId, node);
      }
    },
    []
  );

  const renderSettingsMenu = () => {
    if (!showMapSettings || !settingsMapId) {
      return null;
    }
    return (
      <SettingsMenu
        onCloseHandler={() => setShowMapSettings(false)}
        forElementNode={settingsForItemRef.current.get(settingsMapId)}
      >
        <MapSettingsItem
          customColor={color_accent_primary}
          opacity={0.8}
          onClick={() => {
            setMapToDeleteId(settingsMapId);
            setShowMapSettings(false);
          }}
        >
          <MapSettingsIcon>
            <DeleteIcon fill={color_accent_primary} />
          </MapSettingsIcon>
          Delete map
        </MapSettingsItem>
      </SettingsMenu>
    );
  };
  return (
    <MapOptionsContainer>
      <MapOptionTitle>Base Map</MapOptionTitle>
      <MapList>
        {baseMaps.map((baseMap) => {
          const isMapSelected = selectedBaseMapId === baseMap.id;
          const isCustomMap = baseMap.custom || false;

          return (
            <Fragment key={baseMap.id}>
              <BaseMapListItem
                ref={(node) => addRefNode(node, baseMap.id)}
                id={baseMap.id}
                title={baseMap.name}
                selected={isMapSelected}
                hasOptions={isCustomMap}
                onOptionsClick={() => {
                  setShowMapSettings(true);
                  setSettingsMapId(baseMap.id);
                }}
                onMapsSelect={selectBaseMap}
              />
              {mapToDeleteId === baseMap.id && (
                <DeleteConfirmation
                  onKeepHandler={() => setMapToDeleteId("")}
                  onDeleteHandler={() => {
                    deleteBaseMap(settingsMapId);
                    setMapToDeleteId("");
                  }}
                >
                  Delete map?
                </DeleteConfirmation>
              )}
            </Fragment>
          );
        })}
      </MapList>
      <InsertButtons>
        <PlusButton buttonSize={ButtonSize.Big} onClick={insertBaseMap}>
          Insert Base Map
        </PlusButton>
      </InsertButtons>
      {renderSettingsMenu()}
    </MapOptionsContainer>
  );
};
