import { Fragment, ReactEventHandler, useState } from "react";
import styled from "styled-components";

import { SelectionState, LayerExample, LayerViewState, ListItemType } from "../../types";

import { ListItem } from "./list-item/list-item";
import PlusIcon from "../../../public/icons/plus.svg";
import ImportIcon from "../../../public/icons/import.svg";
import EsriImage from "../../../public/images/esri.svg";
import { ActionIconButton } from "../action-icon-button/action-icon-button";
import { AcrGisUser } from "../arcgis-user/arcgis-user";

import { DeleteConfirmation } from "./delete-confirmation";
import { LayerOptionsMenu } from "./layer-options-menu/layer-options-menu";
import { handleSelectAllLeafsInGroup } from "../../utils/layer-utils";
import { ButtonSize } from "../../types";
import { PanelHorizontalLine } from "../common";

type LayersControlPanelProps = {
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
`;

const InsertButtons = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  margin-top: 8px;
`;

const ChildrenContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${({ theme }) => theme.colors.mainDimColor};
  margin-left: 22px;
  padding-left: 12px;
`;

const ActionIconButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
`;

const EsriStyledImage = styled(EsriImage)`
  margin-left: 16px;
  fill: ${({ theme }) => theme.colors.esriImageColor};
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

  /// Stab {
  const username = 'Michael-g';
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const onArcGisActionClick = () => { !isLoggedIn && setIsLoggedIn(true) };
  const onArcGisLogoutClick = () => { setIsLoggedIn(false) };
  /// Stab }

  const isListItemSelected = (
    layer: LayerExample,
    parentLayer?: LayerExample
  ): SelectionState => {
    const childLayers = layer.layers || [];
    const groupLeafs = handleSelectAllLeafsInGroup(layer);
    let selectedState = SelectionState.unselected;

    if (!childLayers.length) {
      selectedState = selectedLayerIds.includes(layer.id) ? SelectionState.selected : SelectionState.unselected;
    }

    if (childLayers.length && !parentLayer) {
      selectedState = groupLeafs.some((leaf) => selectedLayerIds.includes(leaf.id)) ? SelectionState.selected : SelectionState.unselected;
    }

    if (childLayers.length && parentLayer) {
      const isAllChildLayersSelected = !groupLeafs.some(
        (leaf) => !selectedLayerIds.includes(leaf.id));
      const isAnyChildLayerSelected = groupLeafs.some(
        (leaf) => selectedLayerIds.includes(leaf.id));

      if (isAllChildLayersSelected) {
        selectedState = SelectionState.selected;
      } else if (isAnyChildLayerSelected) {
        selectedState = SelectionState.indeterminate
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
      const childLayers = layer.layers || [];
      const isSelected = isListItemSelected(layer, parentLayer);

      rootLayer = rootLayer || parentLayer;

      return (
        <Fragment key={layer.id}>
          <ListItem
            id={layer.id}
            title={layer.name}
            subtitle={layer.type}
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
        <ActionIconButton Icon={PlusIcon} size={ButtonSize.Small} onClick={onLayerInsertClick}>
          Insert layer
        </ActionIconButton>
        <ActionIconButton Icon={PlusIcon} size={ButtonSize.Small} onClick={onSceneInsertClick}>
          Insert scene
        </ActionIconButton>

        <PanelHorizontalLine top={0} bottom={0} />

        <ActionIconButtonContainer>
          <ActionIconButton Icon={ImportIcon} style={isLoggedIn ? 'active' : 'disabled'} size={ButtonSize.Small} onClick={onArcGisActionClick}>
            {!isLoggedIn && "Login to ArcGIS"}
            {isLoggedIn && "Import from ArcGIS"}
          </ActionIconButton>
          <EsriStyledImage />
        </ActionIconButtonContainer>

        {isLoggedIn && (
          <AcrGisUser onClick={onArcGisLogoutClick}>
            {username}
          </AcrGisUser>
        )}
      </InsertButtons>
    </LayersContainer>
  );
};
