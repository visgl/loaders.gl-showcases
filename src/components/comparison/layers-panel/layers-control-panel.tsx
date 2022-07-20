import { ReactEventHandler, Fragment, useState } from "react";
import styled from "styled-components";

import { LayerExample, ListItemType } from "../../../types";

import { ListItem } from "./list-item";
import { PlusButton } from "../../plus-button/plus-button";

import { DeleteConfirmation } from "./delete-confirmation";
import { ButtonSize } from "./layers-panel";
import { LayerOptionsMenu } from "./layer-options-menu/layer-options-menu";

type LayersControlPanelProps = {
  layers: LayerExample[];
  selectedLayerIds: string[];
  type: ListItemType;
  hasSettings: boolean;
  onLayerSelect: (id: string) => void;
  onLayerInsertClick: () => void;
  onLayerSettingsClick: ReactEventHandler;
  onPointToLayer: () => void;
  deleteLayer: (id: string) => void;
};

const LayersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
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
  layers,
  type,
  selectedLayerIds,
  onLayerSelect,
  hasSettings = false,
  onLayerInsertClick,
  onLayerSettingsClick,
  onPointToLayer,
  deleteLayer,
}: LayersControlPanelProps) => {
  const [settingsLayerId, setSettingsLayerId] = useState<string>("");
  const [showLayerSettings, setShowLayerSettings] = useState<boolean>(false);
  const [layerToDeleteId, setLayerToDeleteId] = useState<string>("");

  return (
    <LayersContainer>
      <LayersList>
        {layers.map((layer) => {
          const isLayerSelected = selectedLayerIds.includes(layer.id);
          return (
            <Fragment key={layer.id}>
              <ListItem
                id={layer.id}
                title={layer.name}
                type={type}
                selected={isLayerSelected}
                onChange={onLayerSelect}
                onOptionsClick={() => {
                  setShowLayerSettings(true);
                  setSettingsLayerId(layer.id);
                }}
                onClickOutside={() => {
                  setShowLayerSettings(false);
                  setSettingsLayerId("");
                }}
                isOptionsPanelOpen={
                  showLayerSettings && settingsLayerId === layer.id
                }
                optionsContent={
                  <LayerOptionsMenu
                    layerId={settingsLayerId}
                    showDeleteLayer={Boolean(layer?.custom)}
                    showLayerSettings={hasSettings && isLayerSelected}
                    onPointToLayerClick={() => {
                      setShowLayerSettings(false);
                      onPointToLayer();
                    }}
                    onLayerSettingsClick={onLayerSettingsClick}
                    onDeleteLayerClick={() => {
                      setLayerToDeleteId(settingsLayerId);
                      setShowLayerSettings(false);
                    }}
                  />
                }
              />
              {layerToDeleteId === layer.id && (
                <DeleteConfirmation
                  onKeepHandler={() => setLayerToDeleteId("")}
                  onDeleteHandler={() => {
                    deleteLayer(settingsLayerId);
                    setLayerToDeleteId("");
                  }}
                >
                  Delete layer?
                </DeleteConfirmation>
              )}
            </Fragment>
          );
        })}
      </LayersList>
      <InsertButtons>
        <PlusButton buttonSize={ButtonSize.Small} onClick={onLayerInsertClick}>
          Insert layer
        </PlusButton>
        <PlusButton buttonSize={ButtonSize.Small}>Insert scene</PlusButton>
      </InsertButtons>
    </LayersContainer>
  );
};
