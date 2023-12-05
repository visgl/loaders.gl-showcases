import { Fragment, ReactEventHandler, useState } from "react";
import styled from "styled-components";

import { SelectionState, LayerExample, LayerViewState, ListItemType } from "../../types";

import { ListItem } from "./list-item/list-item";
import PlusIcon from "../../../public/icons/plus.svg";
import ImportIcon from "../../../public/icons/import.svg";
import EsriImage from "../../../public/images/esri.svg";
import { ActionIconButton } from "../action-icon-button/action-icon-button";
import { LogoutButton } from "../logout-button/logout-button";

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

const EsriStyledImage = styled(EsriImage)`
  display: flex;
  position: relative;
  top: 0.37px;
  width: 41.9px;
  height: 15.65px;
  fill: ${({ theme }) => theme.colors.esriImageColor};
`;

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

const ActionIconButtonContainer = styled.div<{ bottom?: number }>`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  margin-bottom: ${({ bottom = 0 }) => `${bottom}px`};
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
  const username = 'Michael';
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const onArcGisLoginClick = () => { setIsLoggedIn(true) };
  const onArcGisLogoutClick = () => { setIsLoggedIn(false) };
  const onArcGisImportClick = () => { return true; };
  const showLogin = !isLoggedIn;
  const showLogout = isLoggedIn;
  const showImport = isLoggedIn;
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
        <ActionIconButton icon={PlusIcon} buttonSize={ButtonSize.Small} onClick={onLayerInsertClick}>
          Insert layer
        </ActionIconButton>
        <ActionIconButton icon={PlusIcon} buttonSize={ButtonSize.Small} onClick={onSceneInsertClick}>
          Insert scene
        </ActionIconButton>

        <PanelHorizontalLine />

        {showLogin && (
          <ActionIconButtonContainer>
            <ActionIconButton icon={ImportIcon} style={'disabled'} buttonSize={ButtonSize.Small} onClick={onArcGisLoginClick}>
              Login to ArcGIS
            </ActionIconButton>
            <EsriStyledImage />
          </ActionIconButtonContainer>
        )}
        {showImport && (
          <ActionIconButtonContainer>
            <ActionIconButton icon={ImportIcon} style={'active'} buttonSize={ButtonSize.Small} onClick={onArcGisImportClick}>
              Import from ArcGIS
            </ActionIconButton>
            <EsriStyledImage />
          </ActionIconButtonContainer>
        )}
        {showLogout && (
          <LogoutButton onClick={onArcGisLogoutClick}>
            {username}
          </LogoutButton>
        )}
      </InsertButtons>
    </LayersContainer>
  );
};
