import { ReactEventHandler, Fragment, useState } from "react";
import styled, { useTheme } from "styled-components";

import { LayerExample, ListItemType } from "../../../types";

import { PlusButton } from "../../plus-button/plus-button";

import { DeleteConfirmation } from "./delete-confirmation";
import { ButtonSize } from "./layers-panel";
import { LayerOptionsMenu } from "./layer-options-menu/layer-options-menu";
import { ListItem } from "./list-item/list-item";

import LocationIcon from "../../../../public/icons/location.svg";

type LayersControlPanelProps = {
  layers: LayerExample[];
  selectedLayerIds: string[];
  type: ListItemType;
  hasSettings: boolean;
  onLayerSelect: (id: string, parentId?: string) => void;
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

const ChildrenContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${({ theme }) => theme.colors.mainDimColor};
  margin-left: 12px;
  margin-top: 10px;
  padding-left: 12px;
  width: 100%;
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
  const theme = useTheme();
  const [settingsLayerId, setSettingsLayerId] = useState<string>("");
  const [showLayerSettings, setShowLayerSettings] = useState<boolean>(false);
  const [layerToDeleteId, setLayerToDeleteId] = useState<string>("");

  const handlePointToLayer = (event) => {
    event.stopPropagation();
    onPointToLayer();
  };

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
                listItemType={type}
                selected={isLayerSelected}
                onClick={onLayerSelect}
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
              >
                {layer.children?.length && (
                  <ChildrenContainer>
                    {layer.children.map((childLayer) => (
                      <ListItem
                        key={childLayer.id}
                        id={childLayer.id}
                        parentId={layer.id}
                        title={childLayer.name}
                        listItemType={ListItemType.Checkbox}
                        selected={selectedLayerIds.includes(childLayer.id)}
                        onClick={onLayerSelect}
                        usePopoverForOptions={false}
                        optionsContent={
                          <LocationIcon
                            opacity="0.6"
                            width={24}
                            height={24}
                            fill={theme.colors.fontColor}
                            onClick={handlePointToLayer}
                          />
                        }
                      />
                    ))}
                  </ChildrenContainer>
                )}
              </ListItem>
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
