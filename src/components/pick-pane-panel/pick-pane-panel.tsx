import styled, { css } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  setPickPanePicked,
  selectPickPaneArray,
  selectPickPanePickedId,
} from "../../redux/slices/pick-pane-slice";

import { IPickPane, PickPaneSetName } from "../../types";

const TexturePanel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  border-width: 0;
  border-radius: 8px;
  gap: 8px;
  margin-top: 10px;
  margin-left: 10px;
`;

const TextureImageWrapper = styled.div<{
  imageName: string;
  active?: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border-width: 0;
  border-radius: 8px;

  ${({ imageName }) =>
    imageName &&
    css`
      padding: 4px 14px 4px 14px;
    `}

  ${({ active = false, imageName }) =>
    active &&
    imageName &&
    css`
      background-color: #393a45;
    `}
`;

const TextureImageName = styled.div<{
  imageName: string;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme }) => theme.colors.fontColor};

  margin-bottom: 4px;
`;

const TextureImage = styled.div<{
  image: string;
  width: number;
  height: number;
  active?: boolean;
}>`
  display: flex;
  position: relative;
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
  margin: 0;
  background-image: ${({ image }) => `url(${image})`};
  background-size: auto;
  background-repeat: no-repeat;
  cursor: pointer;
  border-width: 0;
  border-radius: 8px;

  ${({ active = false }) =>
    active &&
    css`
      box-shadow: 0 0 0 2px #000000, 0 0 0 4px #ffffff;
      // -moz-box-shadow: 0 0 0 2px #000000, 0 0 0 4px #ffffff;
      // -webkit-shadow: 0 0 0 2px #000000, 0 0 0 4px #ffffff;
    `}
`;

interface PickPanePanelOptions {
  panelLength: number;
  selectedKey: string;
}

type PickPanePanelProps = {
  pickPaneSetName: PickPaneSetName;
  group: string;
  panelLength: number;
  imageWidth: number;
  imageHeight: number;
};

export const PickPanePanel = ({
  pickPaneSetName,
  group,
  panelLength,
  imageWidth,
  imageHeight,
}: PickPanePanelProps) => {
  const dispatch = useAppDispatch();

  const imageArray = useAppSelector(selectPickPaneArray(pickPaneSetName));
  const imagePickedKey = useAppSelector(
    selectPickPanePickedId(pickPaneSetName)
  );

  const renderTextureArray = (
    array: IPickPane[],
    options: PickPanePanelOptions
  ): JSX.Element[] => {
    let elements: JSX.Element[] = [];
    for (let i = 0; i < array.length; i += options.panelLength) {
      elements = elements.concat(renderTexturePanel(array, i, options));
    }
    return elements;
  };

  const renderTexturePanel = (
    array: IPickPane[],
    start: number,
    options: PickPanePanelOptions
  ): JSX.Element => {
    const elements: JSX.Element[] = [];

    const startIndex = start >= array.length ? array.length - 1 : start;
    const endIndex =
      startIndex + options.panelLength >= array.length
        ? array.length
        : startIndex + options.panelLength;

    for (let i = startIndex; i < endIndex; i++) {
      const item = array[i];
      if (item.group === group) {
        elements.push(
          <TextureImageWrapper
            imageName={item.name || ""}
            active={!!item.name && imagePickedKey === item.id}
          >
            <TextureImage
              key={`${item.id}`}
              image={`${item.icon}`}
              width={imageWidth}
              height={imageHeight}
              active={!item.name && imagePickedKey === item.id}
              onClick={() => {
                dispatch(
                  setPickPanePicked({
                    pickPaneSetName: pickPaneSetName,
                    id: item.id,
                  })
                );
              }}
            ></TextureImage>
            <TextureImageName imageName={item.name || ""}>
              {item.name || ""}
            </TextureImageName>
          </TextureImageWrapper>
        );
      }
    }

    return <TexturePanel>{elements}</TexturePanel>;
  };

  return (
    <>
      {renderTextureArray(imageArray, {
        panelLength: panelLength,
        selectedKey: imagePickedKey,
      })}
    </>
  );
};
