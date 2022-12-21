import { useTheme } from "styled-components";
import LocationIcon from "../../../../public/icons/location.svg";
import DeleteIcon from "../../../../public/icons/delete.svg";
import SettingsIcon from "../../../../public/icons/settings.svg";
import InfoIcon from '../../../../public/icons/info.svg'
import { color_accent_primary } from "../../../constants/colors";
import { ReactEventHandler } from "react";
import { LayerExample, LayerViewState } from "../../../types";
import {
  MenuContainer,
  MenuItem,
  MenuSettingsIcon,
  MenuDevider,
  MenuLink
} from "../../common";

type LayerOptionsMenuProps = {
  layer: LayerExample;
  selected: boolean;
  hasSettings: boolean;
  onPointToLayerClick: (viewState?: LayerViewState) => void;
  onLayerSettingsClick: ReactEventHandler;
  onDeleteLayerClick: (id: string) => void;
};

export const LayerOptionsMenu = ({
  layer,
  selected,
  hasSettings,
  onPointToLayerClick,
  onLayerSettingsClick,
  onDeleteLayerClick,
}: LayerOptionsMenuProps) => {
  const theme = useTheme();

  const handleDeleteLayer = (event) => {
    event.stopPropagation();
    onDeleteLayerClick(layer.id);
  };

  const getChildLayerViewState = (
    layer: LayerExample
  ): LayerViewState | undefined => {
    let viewState: LayerViewState | undefined;

    // Try to find across nearest children;
    for (const childLayer of layer?.layers || []) {
      if (childLayer.viewState) {
        viewState = childLayer.viewState;
        break;
      }
    }
    // If didn't find across children we should check deeply.
    if (!viewState) {
      for (const childLayer of layer?.layers || []) {
        viewState = getChildLayerViewState(childLayer);
      }
    }

    return viewState;
  };

  const handlePointToLayer = (event) => {
    if (selected) {
      event.stopPropagation();
    }

    const viewState = layer.viewState || getChildLayerViewState(layer);

    onPointToLayerClick(viewState);
  };

  const handleShowLayerSettings = (event) => {
    event.stopPropagation();
    onLayerSettingsClick(event);
  };

  return (
    <MenuContainer>
      <MenuItem onClick={handlePointToLayer}>
        <MenuSettingsIcon>
          <LocationIcon fill={theme.colors.fontColor} />
        </MenuSettingsIcon>
        Point to layer
      </MenuItem>

      {hasSettings && (
        <MenuItem onClick={handleShowLayerSettings}>
          <MenuSettingsIcon>
            <SettingsIcon fill={theme.colors.fontColor} />
          </MenuSettingsIcon>
          Layer settings
        </MenuItem>
      )}

      {layer.custom && (
        <>
          <MenuDevider />
          <MenuItem
            customColor={color_accent_primary}
            opacity={0.8}
            onClick={handleDeleteLayer}
          >
            <MenuSettingsIcon>
              <DeleteIcon fill={color_accent_primary} />
            </MenuSettingsIcon>
            Delete layer
          </MenuItem>
        </>
      )}

      {layer.mapInfo && (
        <>
          <MenuDevider />
          <MenuLink href={layer.mapInfo} target="_blank">
            <MenuSettingsIcon>
              <InfoIcon />
            </MenuSettingsIcon>
            Map Info
          </MenuLink>
        </>
      )}
    </MenuContainer>
  );
};
