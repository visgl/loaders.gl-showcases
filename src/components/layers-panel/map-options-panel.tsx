import styled from "styled-components";
import { BaseMapList } from "../base-map-list/base-map-item";
import { PlusButton } from "../plus-button/plus-button";

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

const LayersContainer = styled.div`
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

export const LayersMapOption = ({ baseMaps }) => {
    return (
      <LayersContainer>
        <MapOptionTitle>
          Base Map
        </MapOptionTitle>
        <MapList>
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
        </MapList>
        <InsertButtons item={Tabs.MapOptions}>
          <PlusButton
            tab={Tabs.MapOptions}
            onClick={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </InsertButtons>
      </LayersContainer>
    );
  };