import { Fragment, ReactEventHandler, useState, useEffect } from "react";
import styled from "styled-components";

import { SelectionState, LayerExample, LayerViewState, ListItemType } from "../../types";

import { ListItem } from "./list-item/list-item";
import { PlusButton } from "../plus-button/plus-button";

import { DeleteConfirmation } from "./delete-confirmation";
import { LayerOptionsMenu } from "./layer-options-menu/layer-options-menu";
import { handleSelectAllLeafsInGroup } from "../../utils/layer-utils";
import { ButtonSize } from "../../types";
import {
  PanelHorizontalLine,
} from "../common";

import { arcGisLogin, arcGisLogout, selectUser } from "../../redux/slices/arcgis-auth-slice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

type LayersControlPanelProps = {
  layers: LayerExample[];
  selectedLayerIds: string[];
  type: ListItemType;
  hasSettings: boolean;
  onLayerSelect: (layer: LayerExample, rootLayer?: LayerExample) => void;
  onLayerInsertClick: () => void;
  onSceneInsertClick: () => void;
  onArcGisImportClick: () => void;
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
  onArcGisImportClick,
  onLayerSettingsClick,
  onPointToLayer,
  deleteLayer,
}: LayersControlPanelProps) => {
  const dispatch = useAppDispatch();

  const [settingsLayerId, setSettingsLayerId] = useState<string>("");
  const [showLayerSettings, setShowLayerSettings] = useState<boolean>(false);
  const [layerToDeleteId, setLayerToDeleteId] = useState<string>("");

  const username = useAppSelector(selectUser);

  const [showLogin, setShowLoginButton] = useState<boolean>(!username);
  const [showLogout, setShowLogoutButton] = useState<boolean>(!!username);
  const [showImport, setShowImportButton] = useState<boolean>(!!username);

  useEffect(() => {
    setShowLoginButton(!username);
    setShowLogoutButton(!!username);
    setShowImportButton(!!username);
  }, [username]);

  const handleArcGisLogin = () => {
    dispatch(arcGisLogin());
  };

  const handleArcGisLogout = () => {
    dispatch(arcGisLogout());
  };

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
        <PlusButton buttonSize={ButtonSize.Small} onClick={onLayerInsertClick}>
          Insert layer
        </PlusButton>
        <PlusButton buttonSize={ButtonSize.Small} onClick={onSceneInsertClick}>
          Insert scene
        </PlusButton>
        <PanelHorizontalLine />
        { showLogin && (
        <PlusButton buttonSize={ButtonSize.Small} onClick={handleArcGisLogin}>
          Login to ArcGIS
        </PlusButton>
        ) }
        { showImport && (
          <PlusButton buttonSize={ButtonSize.Small} onClick={onArcGisImportClick}>
          Import from ArcGIS
        </PlusButton>
        ) }
        { showLogout && (
        <PlusButton buttonSize={ButtonSize.Small} onClick={handleArcGisLogout}>
          {username} Logout
        </PlusButton>
        ) }
        </InsertButtons>
    </LayersContainer>
  );
};
