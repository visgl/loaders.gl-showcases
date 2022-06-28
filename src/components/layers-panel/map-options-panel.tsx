import styled from "styled-components";
import { BaseMapListItem } from "./base-map-list-item";
import { PlusButton } from "../plus-button/plus-button";
import { ButtonSize } from "./layers-panel";

type MapOptionPanelProps = {
  baseMaps: any[];
  selectedBaseMapId: string;
  onMapsSelect: (id: string) => void;
  onMapOptionsClick: (id: string) => void;
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

export const MapOptionPanel = ({
  baseMaps,
  selectedBaseMapId,
  onMapsSelect,
  onMapOptionsClick,
  onBaseMapInsert,
}: MapOptionPanelProps) => {
  return (
    <MapOptionsContainer>
      <MapOptionTitle>Base Map</MapOptionTitle>
      <MapList>
        {baseMaps.map((baseMap) => {
          const isMapSelected = selectedBaseMapId === baseMap.id;
          return (
            <BaseMapListItem
              key={baseMap.id}
              id={baseMap.id}
              title={baseMap.name}
              iconUrl={baseMap.iconUrl}
              selected={isMapSelected}
              hasOptions={true}
              onOptionsClick={onMapOptionsClick}
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
    </MapOptionsContainer>
  );
};
