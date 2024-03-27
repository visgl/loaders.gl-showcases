import styled from "styled-components";
import PlusIcon from "../../../public/icons/plus.svg";
import { ActionIconButton } from "../action-icon-button/action-icon-button";
import { ButtonSize } from "../../types";
import { BasemapListPanel } from "../layers-panel/basemap-list-panel/basemap-list-panel";

interface MapOptionPanelProps {
  insertBaseMap: () => void;
}

const MapOptionTitle = styled.div`
  width: 100;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

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
  return (
    <MapOptionsContainer id="map-options-container">
      <MapOptionTitle>Base Map</MapOptionTitle>
      {["Maplibre", "ArcGIS", "Terrain"].map((mapGroup) => {
        return (
          <>
            <BasemapListPanel group={mapGroup} />
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
