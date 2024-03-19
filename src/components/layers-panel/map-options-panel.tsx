import { useState } from "react";
import styled from "styled-components";
import PlusIcon from "../../../public/icons/plus.svg";
import { ActionIconButton } from "../action-icon-button/action-icon-button";
import { DeleteConfirmation } from "./delete-confirmation";
import { ButtonSize } from "../../types";
import { BaseMapOptionsMenu } from "./basemap-options-menu/basemap-options-menu";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectBaseMaps,
  deleteBaseMaps,
  setSelectedBaseMaps,
} from "../../redux/slices/base-maps-slice";
import { BasemapListPanel } from "../basemap-list-panel/basemap-list-panel";

interface MapOptionPanelProps {
  insertBaseMap: () => void;
}

const MapOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  position: relative;
  gap: 16px;
  margin-bottom: 8px;
`;

const InsertButtons = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

export const MapOptionPanel = ({ insertBaseMap }: MapOptionPanelProps) => {
  const dispatch = useAppDispatch();
  const baseMaps = useAppSelector(selectBaseMaps);
  const [optionsMapId, setOptionsMapId] = useState<string>("");
  const [mapToDeleteId, setMapToDeleteId] = useState<string>("");
  const [mapToDeleteGroup, setMapToDeleteGroup] = useState<string>("");

  return (
    <MapOptionsContainer>
      {["Maplibre", "ArcGIS", "Terrain"].map((mapGroup) => {
        return (
          <>
            <BasemapListPanel
              group={mapGroup}
              optionsMapId={optionsMapId}
              onOptionsClick={(id) => {
                setOptionsMapId(id);
                setMapToDeleteGroup(mapGroup);
              }}
              onOptionsClickOutside={() => { setOptionsMapId(""); }}
              optionsContent={
                <BaseMapOptionsMenu
                  onDeleteBasemap={() => {
                    setMapToDeleteId(optionsMapId);
                    setOptionsMapId("");
                  }}
                  onCancel={() => {
                    setOptionsMapId("");
                  }}
                />
              }
            />
            {mapToDeleteId && mapToDeleteGroup === mapGroup && (
              <DeleteConfirmation
                onKeepHandler={() => { setMapToDeleteId(""); }}
                onDeleteHandler={() => {
                  dispatch(deleteBaseMaps(mapToDeleteId));
                  // Pick the first item of the list
                  if (baseMaps.length) {
                    const item = baseMaps[0];
                    dispatch(setSelectedBaseMaps(item.id));
                  }
                  setMapToDeleteId("");
                }}
              >
                Delete map?
              </DeleteConfirmation>
            )}
          </>
        );
      })}

      <InsertButtons>
        <ActionIconButton
          Icon={PlusIcon}
          size={ButtonSize.Small}
          onClick={insertBaseMap}
        >
          Insert Base Map
        </ActionIconButton>
      </InsertButtons>
    </MapOptionsContainer>
  );
};
