import { useState, Fragment } from "react";
import styled from "styled-components";
import { BaseMapListItem } from "./base-map-list-item/base-map-list-item";
import PlusIcon from "../../../public/icons/plus.svg";
import { ActionIconButton } from "../action-icon-button/action-icon-button";
import { DeleteConfirmation } from "./delete-confirmation";
import { SelectionState } from "../../types";
import { BaseMapOptionsMenu } from "./basemap-options-menu/basemap-options-menu";
import { ButtonSize } from "../../types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectBaseMaps,
  deleteBaseMaps,
  selectSelectedBaseMapId,
  setSelectedBaseMaps,
} from "../../redux/slices/base-maps-slice";

type MapOptionPanelProps = {
  insertBaseMap: () => void;
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
`;

const InsertButtons = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

export const MapOptionPanel = ({ insertBaseMap }: MapOptionPanelProps) => {
  const dispatch = useAppDispatch();
  const baseMaps = useAppSelector(selectBaseMaps);
  const selectedBaseMapId = useAppSelector(selectSelectedBaseMapId);
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
                selected={
                  isMapSelected
                    ? SelectionState.selected
                    : SelectionState.unselected
                }
                onOptionsClick={() => {
                  setShowMapSettings(true);
                  setSettingsMapId(baseMap.id);
                }}
                onMapsSelect={() => {
                  dispatch(setSelectedBaseMaps(baseMap.id));
                }}
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
                    dispatch(deleteBaseMaps(settingsMapId));
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
        <ActionIconButton Icon={PlusIcon} size={ButtonSize.Big} onClick={insertBaseMap}>
          Insert Base Map
        </ActionIconButton>
      </InsertButtons>
    </MapOptionsContainer>
  );
};
