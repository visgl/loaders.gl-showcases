import styled, { css } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  setIconItemPicked,
  selectIconList,
  selectIconItemPickedId,
} from "../../redux/slices/icon-list-slice";

import { IconListSetName } from "../../types";

const TexturePanel = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  align-items: center;
  border-width: 0;
  border-radius: 8px;
  gap: 8px;
  margin-top: 10px;
  margin-left: 10px;
`;

const TextureIcon = styled.div<{
  icon: string;
  size: number;
  active?: boolean;
}>`
  display: flex;
  position: relative;
  height: ${({ size }) => `${size}px`};
  width: ${({ size }) => `${size}px`};
  margin: 0;
  background-image: ${({ icon }) => `url(${icon})`};
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  border-width: 0;
  border-radius: 8px;

  ${({ active = false }) =>
    active &&
    css`
      box-shadow: 0 0 0 2px #000000, 0 0 0 4px #ffffff;
    `}
`;

type IconListPanelProps = {
  iconListSetName: IconListSetName;
  group?: string;
  iconSize: number;
};

export const IconListPanel = ({
  iconListSetName,
  group,
  iconSize,
}: IconListPanelProps) => {
  const dispatch = useAppDispatch();

  const imageArray = useAppSelector(selectIconList(iconListSetName, group));
  const imagePickedKey = useAppSelector(
    selectIconItemPickedId(iconListSetName)
  );

  return (
    <TexturePanel>
      {imageArray.map((item) => (
        <TextureIcon
          key={`${item.id}`}
          icon={`${item.icon}`}
          size={iconSize}
          active={imagePickedKey === item.id}
          onClick={() => {
            dispatch(
              setIconItemPicked({
                iconListSetName: iconListSetName,
                id: item.id,
              })
            );
          }}
        />
      ))}
    </TexturePanel>
  );
};
