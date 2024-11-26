import styled from "styled-components";
import { Title, TileInfoSectionWrapper } from "../common";
import { useEffect, useState } from "react";
import { type Tile3D } from "@loaders.gl/tiles";
import { ModalDialog } from "../modal-dialog/modal-dialog";

import {
  drawCompressedTexture,
  drawBitmapTexture,
} from "../../utils/debug/texture-render-utils";

interface Size {
  width: number;
  height: number;
}

const TextureContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: top;
  border-radius: 4px;
  margin-right: 16px;
  cursor: pointer;
`;

const TextureButton = styled.button<{
  image: string;
  width: number;
  height: number;
}>`
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
  position: relative;
  margin: 0;
  border: 0;
  background-image: ${({ image }) => `${image}`};
  background-repeat: no-repeat;
  cursor: inherit;
`;

const SIZE = 149;
const PREVIEW_SIZE = 592;

interface TextureSectionProps {
  tile: Tile3D;
}

export const TextureSection = ({ tile }: TextureSectionProps) => {
  const [texture, setTexture] = useState<string>("");
  const [previewTexture, setPreviewTexture] = useState<string>("");
  const [showPreviewTexture, setShowPreviewTexture] = useState<boolean>(false);

  const [size, setSize] = useState<Size>({
    width: SIZE,
    height: SIZE,
  });
  const [previewSize, setPreviewSize] = useState<Size>({
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
  });

  const contentImage =
    tile.content?.material?.pbrMetallicRoughness?.baseColorTexture?.texture
      ?.source?.image;
  const originalTexture = tile.userData?.originalTexture;
  const image = originalTexture || contentImage;

  useEffect(() => {
    if (image) {
      if (image.compressed) {
        void drawCompressedTexture(image, SIZE).then((result) => {
          const { url, width, height } = result;
          setSize({ width, height });
          setTexture(url);
        });
      } else {
        void drawBitmapTexture(image, SIZE).then((result) => {
          const { url, width, height } = result;
          setSize({ width, height });
          setTexture(url);
        });
      }
    }
  }, [image]);

  const onClickHandler = () => {
    if (image) {
      if (image.compressed) {
        void drawCompressedTexture(image, PREVIEW_SIZE).then((result) => {
          const { url, width, height } = result;
          setPreviewSize({ width, height });
          setPreviewTexture(url);
        });
      } else {
        void drawBitmapTexture(image, PREVIEW_SIZE).then((result) => {
          const { url, width, height } = result;
          setPreviewSize({ width, height });
          setPreviewTexture(url);
        });
      }
    }

    setShowPreviewTexture(true);
  };

  return (
    <>
      <TileInfoSectionWrapper>
        <Title $left={16}>Texture:</Title>
        <TextureContainer onClick={onClickHandler}>
          <TextureButton
            image={`url(${texture})`}
            width={size.width}
            height={size.height}
          ></TextureButton>
        </TextureContainer>
      </TileInfoSectionWrapper>

      {showPreviewTexture && (
        <ModalDialog
          title={"Preview texture"}
          okButtonText={""}
          cancelButtonText={""}
          onConfirm={() => {
            setShowPreviewTexture(false);
          }}
          onCancel={() => {
            setShowPreviewTexture(false);
          }}
        >
          <TextureButton
            image={`url(${previewTexture})`}
            width={previewSize.width}
            height={previewSize.height}
          ></TextureButton>
        </ModalDialog>
      )}
    </>
  );
};
