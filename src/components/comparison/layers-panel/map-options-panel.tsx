import { useState, Fragment } from "react";
import styled from "styled-components";
import { BaseMapListItem } from "./base-map-list-item/base-map-list-item";
import { PlusButton } from "../../plus-button/plus-button";
import { ButtonSize } from "./layers-panel";
import { DeleteConfirmation } from "./delete-confirmation";
import { BaseMap, SelectionState } from "../../../types";
import { BaseMapOptionsMenu } from "./basemap-options-menu/basemap-options-menu";

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

export const MapOptionPanel = ({
  baseMaps,
  selectedBaseMapId,
  selectBaseMap,
  insertBaseMap,
  deleteBaseMap,
}: MapOptionPanelProps) => {
  const [settingsMapId, setSettingsMapId] = useState<string>("");
  const [showMapSettings, setShowMapSettings] = useState<boolean>(false);
  const [mapToDeleteId, setMapToDeleteId] = useState<string>("");

  return (
    <MapOptionsContainer>
      <MapOptionTitle>Base Map</MapOptionTitle>
      <MapList>
        {baseMaps.map((baseMap) => {
          const isMapSelected = selectedBaseMapId === baseMap.id;

          return (
            <Fragment key={baseMap.id}>
              <BaseMapListItem
                id={baseMap.id}
                title={baseMap.name}
                selected={isMapSelected ? SelectionState.selected : SelectionState.unselected}
                onOptionsClick={() => {
                  setShowMapSettings(true);
                  setSettingsMapId(baseMap.id);
                }}
                onMapsSelect={selectBaseMap}
                isOptionsPanelOpen={
                  showMapSettings && settingsMapId === baseMap.id
                }
                optionsContent={
                  <BaseMapOptionsMenu
                    onDeleteBasemap={() => {
                      setMapToDeleteId(settingsMapId);
                      setShowMapSettings(false);
                    }}
                  />
                }
                onClickOutside={() => {
                  setShowMapSettings(false);
                  setSettingsMapId("");
                }}
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
    </MapOptionsContainer>
  );
};
