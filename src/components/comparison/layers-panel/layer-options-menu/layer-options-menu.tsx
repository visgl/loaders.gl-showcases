import { useTheme } from "styled-components";
import LocationIcon from "../../../../../public/icons/location.svg";
import DeleteIcon from "../../../../../public/icons/delete.svg";
import SettingsIcon from "../../../../../public/icons/settings.svg";
import { color_accent_primary } from "../../../../constants/colors";
import { ReactEventHandler } from "react";
import {
  MenuContainer,
  MenuItem,
  MenuSettingsIcon,
  MenuDevider,
} from "../../common";

type LayerOptionsMenuProps = {
  layerId: string;
  showLayerSettings: boolean;
  showDeleteLayer: boolean;
  onPointToLayerClick: ReactEventHandler;
  onLayerSettingsClick: ReactEventHandler;
  onDeleteLayerClick: (id: string) => void;
};

export const LayerOptionsMenu = ({
  layerId,
  showLayerSettings,
  showDeleteLayer,
  onPointToLayerClick,
  onLayerSettingsClick,
  onDeleteLayerClick,
}: LayerOptionsMenuProps) => {
  const theme = useTheme();

  return (
    <MenuContainer>
      <MenuItem onClick={onPointToLayerClick}>
        <MenuSettingsIcon>
          <LocationIcon fill={theme.colors.fontColor} />
        </MenuSettingsIcon>
        Point to layer
      </MenuItem>

      {showLayerSettings && (
        <MenuItem onClick={onLayerSettingsClick}>
          <MenuSettingsIcon>
            <SettingsIcon fill={theme.colors.fontColor} />
          </MenuSettingsIcon>
          Layer settings
        </MenuItem>
      )}

      {showDeleteLayer && (
        <>
          <MenuDevider />
          <MenuItem
            customColor={color_accent_primary}
            opacity={0.8}
            onClick={() => onDeleteLayerClick(layerId)}
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
