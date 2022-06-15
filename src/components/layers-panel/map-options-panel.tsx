import styled from "styled-components";
import {BaseMapListItem} from "../base-map-list-item/base-map-list-item";
import {PlusButton} from "../plus-button/plus-button";

type MapOptionPanelProps = {
  insertButtonSize: number;
  baseMaps: any[];
  onMapClick: ({ selectedMapStyle }) => void;
  onTerrainClick: () => void;
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
  color: ${({theme}) => theme.colors.fontColor};
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
  insertButtonSize,
  onMapClick,
  onMapOptionsClick,
  onTerrainClick,
  onBaseMapInsert
}: MapOptionPanelProps) => {
  return (
    <MapOptionsContainer>
      <MapOptionTitle>Base Map</MapOptionTitle>
      <MapList>
        {baseMaps.map(baseMap => {
          return (
            <BaseMapListItem
              key={baseMap.id}
              id={baseMap.id}
              title={baseMap.name}
              iconUrl={baseMap.url}
              hasOptions={true}
              onOptionsClick={onMapOptionsClick}
              onTerrainClick={onTerrainClick}
              onMapClick={onMapClick}
            />
          );
        })}
      </MapList>
      <InsertButtons>
        <PlusButton
          buttonSize={insertButtonSize}
          onClick={onBaseMapInsert}>
          Insert Base Map
        </PlusButton>
      </InsertButtons>
    </MapOptionsContainer>
  );
};
