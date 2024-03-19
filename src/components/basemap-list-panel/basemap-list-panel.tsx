import styled, { css } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

// import {
//   setIconItemPicked,
//   selectIconList,
//   selectIconItemPickedId,
// } from "../../redux/slices/icon-list-slice";

// import { IconListSetName } from "../../types";
import { OptionsIcon, Panels } from "../common";
import {
  selectBaseMaps,
  deleteBaseMaps,
  selectSelectedBaseMapId,
  setSelectedBaseMaps,
  selectBaseMapsByGroup
} from "../../redux/slices/base-maps-slice";
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
  //  margin-left: 0;
`;

const BasemapTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
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
  //  height: number;
}>`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

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
  cursor: pointer;
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

type BasemapListPanelProps = {
  group: string;
  optionsMapId: string;
  optionsContent?: JSX.Element;
  onOptionsClick?: (id: string) => void;
  onOptionsClickOutside?: () => void;
};

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
        {imageArray.map((item) => (
          <BasemapImageWrapper
            active={imagePickedKey === item.id}
            width={BASEMAP_ICON_WIDTH}
          >
            <BasemapIcon
              key={`${item.id}`}
              icon={`${item.icon}`}
              width={BASEMAP_ICON_WIDTH}
              height={BASEMAP_ICON_HEIGHT}
              onClick={() => {
                dispatch(setSelectedBaseMaps(item.id));
              }}
            />
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
        ))}
      </BasemapPanel>
    </BasemapContainer>
  );
};
