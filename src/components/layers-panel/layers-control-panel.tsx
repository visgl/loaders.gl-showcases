import styled from "styled-components";
import { ListItemType } from "../../types";

import { ListItem } from "../list-item/list-item";
import { PlusButton } from "../plus-button/plus-button";

type LayersControlPanelProps = {
  insertButtonSize: number;
  layers: any[];
  selectedLayerIds: string[];
  type: ListItemType;
  onLayersSelect: (id: string) => void;
  onLayerOptionsClick: (id: string) => void;
  onLayerInsert: () => void;
  onSceneInsert: () => void;
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

export const LayersControlPanel = ({
  insertButtonSize,
  layers,
  type,
  selectedLayerIds,
  onLayersSelect,
  onLayerOptionsClick,
  onLayerInsert,
  onSceneInsert,
}: LayersControlPanelProps) => {
  return (
    <LayersContainer>
      <LayersList>
        {layers.map((layer) => {
          const isLayerSelected = selectedLayerIds.includes(layer.id);

          return (
            <ListItem
              key={layer.id}
              id={layer.id}
              title={layer.name}
              type={type}
              selected={isLayerSelected}
              hasOptions={true}
              onChange={onLayersSelect}
              onOptionsClick={onLayerOptionsClick}
            />
          );
        })}
      </LayersList>
      <InsertButtons>
        <PlusButton buttonSize={insertButtonSize} onClick={onLayerInsert} />
        <PlusButton buttonSize={insertButtonSize} onClick={onSceneInsert} />
      </InsertButtons>
    </LayersContainer>
  );
};
