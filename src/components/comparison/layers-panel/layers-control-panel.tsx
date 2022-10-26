import type { Tileset3D } from "@loaders.gl/tiles";

import { Fragment, ReactEventHandler, useState } from "react";
import styled from "styled-components";

import { LayerExample, ListItemType } from "../../../types";

import { ListItem } from "./list-item/list-item";
import { PlusButton } from "../../plus-button/plus-button";

import { DeleteConfirmation } from "./delete-confirmation";
import { ButtonSize } from "./layers-panel";
import { LayerOptionsMenu } from "./layer-options-menu/layer-options-menu";

type LayersControlPanelProps = {
  layers: LayerExample[];
  selectedLayerIds: string[];
  type: ListItemType;
  hasSettings: boolean;
  onLayerSelect: (layer: LayerExample, rootLayer?: LayerExample) => void;
  onLayerInsertClick: () => void;
  onSceneInsertClick: () => void;
  onLayerSettingsClick: ReactEventHandler;
  onPointToLayer: (tileset?: Tileset3D) => void;
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
  margin-left: 22px;
  padding-left: 12px;
`;

export const LayersControlPanel = ({
  layers,
  type,
  selectedLayerIds,
  onLayerSelect,
  hasSettings = false,
  onLayerInsertClick,
  onSceneInsertClick,
  onLayerSettingsClick,
  onPointToLayer,
  deleteLayer,
}: LayersControlPanelProps) => {
  const [settingsLayerId, setSettingsLayerId] = useState<string>("");
  const [showLayerSettings, setShowLayerSettings] = useState<boolean>(false);
  const [layerToDeleteId, setLayerToDeleteId] = useState<string>("");

  const handleSelectAllLeafsInGroup = (
    layer: LayerExample,
    leafs: LayerExample[] = []
  ) => {
    if (layer?.layers?.length) {
      for (const childLayer of layer.layers) {
        leafs = handleSelectAllLeafsInGroup(childLayer, leafs);
      }
    } else {
      leafs.push(layer);
    }

    return leafs;
  };

  const renderLayers = (
    layers: LayerExample[],
    parentLayer?: LayerExample,
    rootLayer?: LayerExample
  ) => {
    return layers.map((layer: LayerExample) => {
      const childLayers = layer.layers || [];
      const isLayerSelected = selectedLayerIds.includes(layer.id);
      const groupLeafs = handleSelectAllLeafsInGroup(layer);
      const isGroupSelected = groupLeafs.some((leaf) =>
        selectedLayerIds.includes(leaf.id)
      );
      const isSelected = childLayers.length ? isGroupSelected : isLayerSelected;

      rootLayer = rootLayer || parentLayer;

      return (
        <Fragment key={layer.id}>
          <ListItem
            id={layer.id}
            title={layer.name}
            type={parentLayer ? ListItemType.Checkbox : type}
            selected={isSelected}
            onChange={() => onLayerSelect(layer, rootLayer)}
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
                layer={layer}
                selected={isLayerSelected}
                showLayerSettings={hasSettings && isLayerSelected}
                onPointToLayerClick={(tileset) => {
                  setShowLayerSettings(false);
                  onPointToLayer(tileset);
                }}
                onLayerSettingsClick={onLayerSettingsClick}
                onDeleteLayerClick={() => {
                  setLayerToDeleteId(settingsLayerId);
                  setShowLayerSettings(false);
                }}
              />
            }
          />
          {childLayers.length ? (
            <ChildrenContainer>
              {renderLayers(childLayers, layer, rootLayer)}
            </ChildrenContainer>
          ) : null}
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
    });
  };

  return (
    <LayersContainer>
      <LayersList>{renderLayers(layers)}</LayersList>
      <InsertButtons>
        <PlusButton buttonSize={ButtonSize.Small} onClick={onLayerInsertClick}>
          Insert layer
        </PlusButton>
        <PlusButton buttonSize={ButtonSize.Small} onClick={onSceneInsertClick}>
          Insert scene
        </PlusButton>
      </InsertButtons>
    </LayersContainer>
  );
};
