import type { Tileset3D } from "@loaders.gl/tiles";
import { useTheme } from "styled-components";
import LocationIcon from "../../../../../public/icons/location.svg";
import DeleteIcon from "../../../../../public/icons/delete.svg";
import SettingsIcon from "../../../../../public/icons/settings.svg";
import { color_accent_primary } from "../../../../constants/colors";
import { ReactEventHandler } from "react";
import { LayerExample } from "../../../../types";
import {
  MenuContainer,
  MenuItem,
  MenuSettingsIcon,
  MenuDevider,
} from "../../common";

type LayerOptionsMenuProps = {
  layer: LayerExample;
  selected: boolean;
  showLayerSettings: boolean;
  onPointToLayerClick: (tileset?: Tileset3D) => void;
  onLayerSettingsClick: ReactEventHandler;
  onDeleteLayerClick: (id: string) => void;
};

export const LayerOptionsMenu = ({
  layer,
  selected,
  showLayerSettings,
  onPointToLayerClick,
  onLayerSettingsClick,
  onDeleteLayerClick,
}: LayerOptionsMenuProps) => {
  const theme = useTheme();

  const handleDeleteLayer = (event) => {
    event.stopPropagation();
    onDeleteLayerClick(layer.id);
  };

  const handlePointToLayer = (event) => {
    if (selected) {
      event.stopPropagation();
    }

    onPointToLayerClick(layer.tileset);
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

      {showLayerSettings && (
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
    </MenuContainer>
  );
};
