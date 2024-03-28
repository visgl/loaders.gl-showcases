import styled, { css, useTheme } from "styled-components";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

import { OptionsIcon, Panels } from "../../common";
import {
  selectSelectedBaseMap,
  setSelectedBaseMap,
  selectBaseMapsByGroup,
  deleteBaseMap,
} from "../../../redux/slices/base-maps-slice";
import { basemapIcons } from "../../../constants/map-styles";
import { Popover } from "react-tiny-popover";
import { DeleteConfirmation } from "../delete-confirmation";
import { BaseMapOptionsMenu } from "../basemap-options-menu/basemap-options-menu";

const BASEMAP_ICON_WIDTH = "100px";
const BASEMAP_ICON_HEIGHT = "70px";

const BasemapContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  border-width: 0;
  margin: 0;
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
`;

const BasemapImageWrapper = styled.div<{
  active?: boolean;
}>`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  border-width: 0;
  border-radius: 8px;

  width: ${BASEMAP_ICON_WIDTH};
  padding: 4px;

  ${({ active = false }) =>
    active &&
    css`
      background-color: ${({ theme }) => theme.colors.mainHiglightColor};
    `}
`;

const BasemapCustomIcon = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  height: ${BASEMAP_ICON_HEIGHT};
  width: ${BASEMAP_ICON_WIDTH};
  margin: 0;
  border-width: 0;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.customIconBackground};
`;

const BasemapIcon = styled.div<{
  icon: string;
}>`
  display: flex;
  position: relative;
  height: ${BASEMAP_ICON_HEIGHT};
  width: ${BASEMAP_ICON_WIDTH};
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
  onOptionsClickOutside?: () => void;
}

export const BasemapListPanel = ({ group }: BasemapListPanelProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const baseMapArray = useAppSelector((state) =>
    selectBaseMapsByGroup(state, group)
  );
  const baseMapPicked = useAppSelector(selectSelectedBaseMap);

  const [optionsMapId, setOptionsMapId] = useState<string>("");
  const [mapToDeleteId, setMapToDeleteId] = useState<string>("");

  return (
    <>
      <BasemapContainer>
        {baseMapArray.length && <BasemapTitle>{group}</BasemapTitle>}
        <BasemapPanel>
          {baseMapArray.map((item) => {
            const basemapIcon = basemapIcons[item.iconId];
            const iconUrl = basemapIcon?.iconUrl;
            const IconComponent = basemapIcon?.IconComponent;
            return (
              <BasemapImageWrapper
                key={item.id}
                active={baseMapPicked?.id === item.id}
                onClick={() => {
                  dispatch(setSelectedBaseMap(item.id));
                }}
              >
                {iconUrl && (
                  <BasemapIcon key={`${item.id}`} icon={`${iconUrl}`} />
                )}

                {IconComponent && (
                  <BasemapCustomIcon key={`${item.id}`}>
                    <IconComponent fill={theme.colors.buttonDimIconColor} />
                  </BasemapCustomIcon>
                )}

                <BasemapImageName>{item.name || ""}</BasemapImageName>
                {item.custom && (
                  <Popover
                    isOpen={optionsMapId === item.id}
                    reposition={false}
                    positions={["left", "top", "bottom"]}
                    align="start"
                    content={
                      <BaseMapOptionsMenu
                        onDeleteBasemap={() => {
                          setMapToDeleteId(optionsMapId);
                          setOptionsMapId("");
                        }}
                      />
                    }
                    containerStyle={{ zIndex: "2" }}
                    onClickOutside={() => {
                      setOptionsMapId("");
                    }}
                  >
                    <OptionsButton
                      onClick={(event) => {
                        event.stopPropagation();
                        setOptionsMapId(item.id);
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
      {mapToDeleteId && (
        <DeleteConfirmation
          onKeepHandler={() => {
            setMapToDeleteId("");
          }}
          onDeleteHandler={() => {
            dispatch(deleteBaseMap(mapToDeleteId));
            setMapToDeleteId("");
          }}
        >
          Delete map?
        </DeleteConfirmation>
      )}
    </>
  );
};
