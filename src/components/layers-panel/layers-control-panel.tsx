import { Fragment, type ReactEventHandler, useState } from "react";
import styled from "styled-components";
import {
  SelectionState,
  type LayerExample,
  type LayerViewState,
  ListItemType,
  ButtonSize,
} from "../../types";
import { ListItem } from "./list-item/list-item";
import PlusIcon from "../../../public/icons/plus.svg";
import { ActionIconButton } from "../action-icon-button/action-icon-button";
import { DeleteConfirmation } from "./delete-confirmation";
import { LayerOptionsMenu } from "./layer-options-menu/layer-options-menu";
import { handleSelectAllLeafsInGroup } from "../../utils/layer-utils";

interface LayersControlPanelProps {
  layers: LayerExample[];
  selectedLayerIds: string[];
  type: ListItemType;
  hasSettings: boolean;
  onLayerSelect: (layer: LayerExample, rootLayer?: LayerExample) => void;
  onLayerInsertClick: () => void;
  onSceneInsertClick: () => void;
  onLayerSettingsClick: ReactEventHandler;
  onPointToLayer: (viewState?: LayerViewState) => void;
  deleteLayer: (id: string) => void;
}

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
`;

const InsertButtons = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
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

  const isListItemSelected = (
    layer: LayerExample,
    parentLayer?: LayerExample
  ): SelectionState => {
    const childLayers = layer.layers ?? [];
    const groupLeafs = handleSelectAllLeafsInGroup(layer);
    let selectedState = SelectionState.unselected;

    if (!childLayers.length) {
      selectedState = selectedLayerIds.includes(layer.id)
        ? SelectionState.selected
        : SelectionState.unselected;
    }

    if (childLayers.length && !parentLayer) {
      selectedState = groupLeafs.some((leaf) =>
        selectedLayerIds.includes(leaf.id)
      )
        ? SelectionState.selected
        : SelectionState.unselected;
    }

    if (childLayers.length && parentLayer) {
      const isAllChildLayersSelected = !groupLeafs.some(
        (leaf) => !selectedLayerIds.includes(leaf.id)
      );
      const isAnyChildLayerSelected = groupLeafs.some((leaf) =>
        selectedLayerIds.includes(leaf.id)
      );

      if (isAllChildLayersSelected) {
        selectedState = SelectionState.selected;
      } else if (isAnyChildLayerSelected) {
        selectedState = SelectionState.indeterminate;
      }
    }

    return selectedState;
  };

  const renderLayers = (
    layers: LayerExample[],
    parentLayer?: LayerExample,
    rootLayer?: LayerExample
  ) => {
    return layers.map((layer: LayerExample) => {
      const childLayers = layer?.layers ?? [];
      const isSelected = isListItemSelected(layer, parentLayer);

      rootLayer = rootLayer ?? parentLayer;

      return (
        <Fragment key={layer.id}>
          <ListItem
            id={layer.id}
            title={layer.name}
            subtitle={layer.type}
            type={parentLayer ? ListItemType.Checkbox : type}
            selected={isSelected}
            onChange={() => { onLayerSelect(layer, rootLayer); }}
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
                selected={isSelected === SelectionState.selected}
                hasSettings={hasSettings}
                onPointToLayerClick={(viewState) => {
                  setShowLayerSettings(false);
                  onPointToLayer(viewState);
                }}
                onLayerSettingsClick={onLayerSettingsClick}
                onDeleteLayerClick={() => {
                  setLayerToDeleteId(settingsLayerId);
                  setShowLayerSettings(false);
                }}
              />
            }
          />
          {childLayers.length
            ? (
            <ChildrenContainer>
              {renderLayers(childLayers, layer, rootLayer)}
            </ChildrenContainer>
              )
            : null}
          {layerToDeleteId === layer.id && (
            <DeleteConfirmation
              onKeepHandler={() => { setLayerToDeleteId(""); }}
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
        <ActionIconButton
          Icon={PlusIcon}
          size={ButtonSize.Small}
          onClick={onLayerInsertClick}
        >
          Insert layer
        </ActionIconButton>
        <ActionIconButton
          Icon={PlusIcon}
          size={ButtonSize.Small}
          onClick={onSceneInsertClick}
        >
          Insert scene
        </ActionIconButton>
      </InsertButtons>
    </LayersContainer>
  );
};
