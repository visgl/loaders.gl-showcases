import styled, { useTheme } from "styled-components";
import LocationIcon from "../../../../../public/icons/location.svg";
import DeleteIcon from "../../../../../public/icons/delete.svg";
import SettingsIcon from "../../../../../public/icons/settings.svg";
import { color_accent_primary } from "../../../../constants/colors";
import { ReactEventHandler } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 202px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.mainColor};
  color: ${({ theme }) => theme.colors.fontColor};
`;

const Item = styled.div<{
  customColor?: string;
  opacity?: number;
}>`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  padding: 10px 0px;
  color: ${({ theme, customColor }) =>
    customColor ? customColor : theme.colors.fontColor};
  opacity: ${({ opacity = 1 }) => opacity};
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const LayerSettingsIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  margin-right: 10px;
`;

const Devider = styled.div`
  height: 1px;
  width: 100%;
  border-top: 1px solid #393a45;
`;

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
    <Container>
      <Item onClick={onPointToLayerClick}>
        <LayerSettingsIcon>
          <LocationIcon fill={theme.colors.fontColor} />
        </LayerSettingsIcon>
        Point to layer
      </Item>

      {showLayerSettings && (
        <Item onClick={onLayerSettingsClick}>
          <LayerSettingsIcon>
            <SettingsIcon fill={theme.colors.fontColor} />
          </LayerSettingsIcon>
          Layer settings
        </Item>
      )}

      {showDeleteLayer && (
        <>
          <Devider />
          <Item
            customColor={color_accent_primary}
            opacity={0.8}
            onClick={() => onDeleteLayerClick(layerId)}
          >
            <LayerSettingsIcon>
              <DeleteIcon fill={color_accent_primary} />
            </LayerSettingsIcon>
            Delete layer
          </Item>
        </>
      )}
    </Container>
  );
};
