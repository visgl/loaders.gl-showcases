import styled, { css } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { OptionsIcon, Panels } from "../common";
import {
  selectSelectedBaseMapId,
  setSelectedBaseMaps,
  selectBaseMapsByGroup,
} from "../../redux/slices/base-maps-slice";
import { basemapIcons } from "../../constants/map-styles";
import { Popover } from "react-tiny-popover";

const BASEMAP_ICON_WIDTH = 100;
const BASEMAP_ICON_HEIGHT = 70;

const BasemapContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  border-width: 0;
  margin: 0 0 0 0;
`;

const BasemapTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme }) => theme.colors.fontColor};

  margin-bottom: 13px;
`;

const BasemapPanel = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  align-items: center;
  border-width: 0;
  border-radius: 8px;
  gap: 0px;
`;

const BasemapImageWrapper = styled.div<{
  active?: boolean;
  width: number;
}>`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  border-width: 0;
  border-radius: 8px;

  width: ${({ width }) => `${width}px`};
  padding: 4px 4px 4px 4px;

  ${({ active = false }) =>
    active &&
    css`
      background-color: #393a45;
    `}
`;

const BasemapCustomIcon = styled.div<{
  width: number;
  height: number;
}>`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
  margin: 0;
  border-width: 0;
  border-radius: 8px;
`;

const BasemapIcon = styled.div<{
  icon: string;
  width: number;
  height: number;
}>`
  display: flex;
  position: relative;
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
  margin: 0;
  background-image: ${({ icon }) => `url(${icon})`};
  background-size: cover;
  background-repeat: no-repeat;
  border-width: 0;
  border-radius: 8px;
`;

const BasemapImageName = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme }) => theme.colors.fontColor};

  margin: 4px 0 0 0;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

const OptionsButton = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.mainDimColor};
  }
`;

interface BasemapListPanelProps {
  group: string;
  optionsMapId: string;
  optionsContent?: JSX.Element;
  onOptionsClick?: (id: string) => void;
  onOptionsClickOutside?: () => void;
}

export const BasemapListPanel = ({
  group,
  optionsMapId,
  optionsContent,
  onOptionsClick,
  onOptionsClickOutside,
}: BasemapListPanelProps) => {
  const dispatch = useAppDispatch();

  const imageArray = useAppSelector(selectBaseMapsByGroup(group));
  const imagePickedKey = useAppSelector(selectSelectedBaseMapId);

  return (
    <BasemapContainer>
      <BasemapTitle>{group}</BasemapTitle>
      <BasemapPanel>
        {imageArray.map((item) => {
          const basemapIcon = item.iconName
            ? basemapIcons[item.iconName]
            : null;
          const iconUrl = basemapIcon?.icon;
          const IconComponent = basemapIcon?.Icon;
          return (
            <BasemapImageWrapper
              key={item.id}
              active={imagePickedKey === item.id}
              width={BASEMAP_ICON_WIDTH}
              onClick={() => {
                dispatch(setSelectedBaseMaps(item.id));
              }}
            >
              {iconUrl && (
                <BasemapIcon
                  key={`${item.id}`}
                  icon={`${iconUrl}`}
                  width={BASEMAP_ICON_WIDTH}
                  height={BASEMAP_ICON_HEIGHT}
                />
              )}

              {IconComponent && (
                <BasemapCustomIcon
                  key={`${item.id}`}
                  width={BASEMAP_ICON_WIDTH}
                  height={BASEMAP_ICON_HEIGHT}
                >
                  <IconComponent></IconComponent>
                </BasemapCustomIcon>
              )}

              <BasemapImageName>{item.name || ""}</BasemapImageName>
              {item.custom && onOptionsClick && optionsContent && (
                <Popover
                  isOpen={optionsMapId === item.id}
                  reposition={false}
                  positions={["left", "top", "bottom"]}
                  align="start"
                  content={optionsContent}
                  containerStyle={{ zIndex: "2" }}
                  onClickOutside={onOptionsClickOutside}
                >
                  <OptionsButton
                    onClick={(event) => {
                      event.stopPropagation();
                      onOptionsClick(item.id);
                    }}
                  >
                    <OptionsIcon $panel={Panels.Bookmarks} />
                  </OptionsButton>
                </Popover>
              )}
            </BasemapImageWrapper>
          );
        })}
      </BasemapPanel>
    </BasemapContainer>
  );
};
