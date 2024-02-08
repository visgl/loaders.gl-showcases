import styled from "styled-components";
import { Title, TileInfoSectionWrapper } from "../common";
import { useEffect, useState } from "react";
import { Tile3D } from "@loaders.gl/tiles";
import { ModalDialog } from "../modal-dialog/modal-dialog";
import {
  getSupportedGPUTextureFormats,
  GL_EXTENSIONS_CONSTANTS,
} from "@loaders.gl/textures";
import { Texture2D, instrumentGLContext, Program } from "@luma.gl/core";

const {
  COMPRESSED_RGB_S3TC_DXT1_EXT,
  COMPRESSED_RGBA_S3TC_DXT1_EXT,
  COMPRESSED_RGBA_S3TC_DXT3_EXT,
  COMPRESSED_RGBA_S3TC_DXT5_EXT,
  COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
  COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
  COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
  COMPRESSED_RGBA_PVRTC_2BPPV1_IMG,
  COMPRESSED_RGB_ATC_WEBGL,
  COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL,
  COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL,
  COMPRESSED_RGB_ETC1_WEBGL,
  COMPRESSED_RGBA_ASTC_4X4_KHR,
  COMPRESSED_RGBA_ASTC_5X4_KHR,
  COMPRESSED_RGBA_ASTC_5X5_KHR,
  COMPRESSED_RGBA_ASTC_6X5_KHR,
  COMPRESSED_RGBA_ASTC_6X6_KHR,
  COMPRESSED_RGBA_ASTC_8X5_KHR,
  COMPRESSED_RGBA_ASTC_8X6_KHR,
  COMPRESSED_RGBA_ASTC_8X8_KHR,
  COMPRESSED_RGBA_ASTC_10X5_KHR,
  COMPRESSED_RGBA_ASTC_10X6_KHR,
  COMPRESSED_RGBA_ASTC_10X8_KHR,
  COMPRESSED_RGBA_ASTC_10X10_KHR,
  COMPRESSED_RGBA_ASTC_12X10_KHR,
  COMPRESSED_RGBA_ASTC_12X12_KHR,
  COMPRESSED_SRGB8_ALPHA8_ASTC_4X4_KHR,
  COMPRESSED_SRGB8_ALPHA8_ASTC_5X4_KHR,
  COMPRESSED_SRGB8_ALPHA8_ASTC_5X5_KHR,
  COMPRESSED_SRGB8_ALPHA8_ASTC_6X5_KHR,
  COMPRESSED_SRGB8_ALPHA8_ASTC_6X6_KHR,
  COMPRESSED_SRGB8_ALPHA8_ASTC_8X5_KHR,
  COMPRESSED_SRGB8_ALPHA8_ASTC_8X6_KHR,
  COMPRESSED_SRGB8_ALPHA8_ASTC_8X8_KHR,
  COMPRESSED_SRGB8_ALPHA8_ASTC_10X5_KHR,
  COMPRESSED_SRGB8_ALPHA8_ASTC_10X6_KHR,
  COMPRESSED_SRGB8_ALPHA8_ASTC_10X8_KHR,
  COMPRESSED_SRGB8_ALPHA8_ASTC_10X10_KHR,
  COMPRESSED_SRGB8_ALPHA8_ASTC_12X10_KHR,
  COMPRESSED_SRGB8_ALPHA8_ASTC_12X12_KHR,
  COMPRESSED_R11_EAC,
  // COMPRESSED_SIGNED,
  COMPRESSED_RG11_EAC,
  COMPRESSED_SIGNED_RG11_EAC,
  COMPRESSED_RGB8_ETC2,
  COMPRESSED_RGBA8_ETC2_EAC,
  COMPRESSED_SRGB8_ETC2,
  COMPRESSED_SRGB8_ALPHA8_ETC2_EAC,
  COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2,
  COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2,
  COMPRESSED_RED_RGTC1_EXT,
  COMPRESSED_SIGNED_RED_RGTC1_EXT,
  COMPRESSED_RED_GREEN_RGTC2_EXT,
  COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT,
  COMPRESSED_SRGB_S3TC_DXT1_EXT,
  COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT,
  COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT,
  COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT,
} = GL_EXTENSIONS_CONSTANTS;

// eslint-disable-next-line complexity
const isFormatSupported = (gl, format) => {
  if (typeof format !== "number") {
    throw new Error("Invalid internal format of compressed texture");
  }
  const supportedFormats = getSupportedGPUTextureFormats(gl);

  switch (format) {
    case COMPRESSED_RGB_S3TC_DXT1_EXT:
    case COMPRESSED_RGBA_S3TC_DXT3_EXT:
    case COMPRESSED_RGBA_S3TC_DXT5_EXT:
    case COMPRESSED_RGBA_S3TC_DXT1_EXT:
      return supportedFormats.has("dxt");

    case COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
    case COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
    case COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
    case COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
      return supportedFormats.has("pvrtc");

    case COMPRESSED_RGB_ATC_WEBGL:
    case COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL:
    case COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL:
      return supportedFormats.has("atc");

    case COMPRESSED_RGB_ETC1_WEBGL:
      return supportedFormats.has("etc1");

    case COMPRESSED_RGBA_ASTC_4X4_KHR:
    case COMPRESSED_RGBA_ASTC_5X4_KHR:
    case COMPRESSED_RGBA_ASTC_5X5_KHR:
    case COMPRESSED_RGBA_ASTC_6X5_KHR:
    case COMPRESSED_RGBA_ASTC_6X6_KHR:
    case COMPRESSED_RGBA_ASTC_8X5_KHR:
    case COMPRESSED_RGBA_ASTC_8X6_KHR:
    case COMPRESSED_RGBA_ASTC_8X8_KHR:
    case COMPRESSED_RGBA_ASTC_10X5_KHR:
    case COMPRESSED_RGBA_ASTC_10X6_KHR:
    case COMPRESSED_RGBA_ASTC_10X8_KHR:
    case COMPRESSED_RGBA_ASTC_10X10_KHR:
    case COMPRESSED_RGBA_ASTC_12X10_KHR:
    case COMPRESSED_RGBA_ASTC_12X12_KHR:
    case COMPRESSED_SRGB8_ALPHA8_ASTC_4X4_KHR:
    case COMPRESSED_SRGB8_ALPHA8_ASTC_5X4_KHR:
    case COMPRESSED_SRGB8_ALPHA8_ASTC_5X5_KHR:
    case COMPRESSED_SRGB8_ALPHA8_ASTC_6X5_KHR:
    case COMPRESSED_SRGB8_ALPHA8_ASTC_6X6_KHR:
    case COMPRESSED_SRGB8_ALPHA8_ASTC_8X5_KHR:
    case COMPRESSED_SRGB8_ALPHA8_ASTC_8X6_KHR:
    case COMPRESSED_SRGB8_ALPHA8_ASTC_8X8_KHR:
    case COMPRESSED_SRGB8_ALPHA8_ASTC_10X5_KHR:
    case COMPRESSED_SRGB8_ALPHA8_ASTC_10X6_KHR:
    case COMPRESSED_SRGB8_ALPHA8_ASTC_10X8_KHR:
    case COMPRESSED_SRGB8_ALPHA8_ASTC_10X10_KHR:
    case COMPRESSED_SRGB8_ALPHA8_ASTC_12X10_KHR:
    case COMPRESSED_SRGB8_ALPHA8_ASTC_12X12_KHR:
      return supportedFormats.has("astc");

    case COMPRESSED_R11_EAC:
    case COMPRESSED_RG11_EAC:
    case COMPRESSED_SIGNED_RG11_EAC:
    case COMPRESSED_RGB8_ETC2:
    case COMPRESSED_RGBA8_ETC2_EAC:
    case COMPRESSED_SRGB8_ETC2:
    case COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:
    case COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2:
    case COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2:
      return supportedFormats.has("etc2");

    case COMPRESSED_RED_RGTC1_EXT:
    case COMPRESSED_SIGNED_RED_RGTC1_EXT:
    case COMPRESSED_RED_GREEN_RGTC2_EXT:
    case COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT:
      return supportedFormats.has("rgtc");

    case COMPRESSED_SRGB_S3TC_DXT1_EXT:
    case COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT:
    case COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT:
    case COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT:
      return supportedFormats.has("dxt-srgb");
    default:
      return false;
  }
};

type SIZE = {
  width: number;
  height: number;
};

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

const createCompressedTexture2D = (gl, images) => {
  const texture = new Texture2D(gl, {
    data: images,
    compressed: true,
    mipmaps: false,
    parameters: {
      [gl.TEXTURE_MAG_FILTER]: gl.LINEAR,
      [gl.TEXTURE_MIN_FILTER]:
        images.length > 1 ? gl.LINEAR_MIPMAP_NEAREST : gl.LINEAR,
      [gl.TEXTURE_WRAP_S]: gl.CLAMP_TO_EDGE,
      [gl.TEXTURE_WRAP_T]: gl.CLAMP_TO_EDGE,
    },
  });

  return texture.handle;
};

const renderCompressedTexture = (gl, program, images) => {
  // We take the first image because it has main propeties of compressed image.
  const { format } = images[0];

  if (!isFormatSupported(gl, format)) {
    throw new Error(`Texture format ${format} not supported by this GPU`);
  }

  const texture = createCompressedTexture2D(gl, images);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

const createAndFillBufferObject = (gl) => {
  const data = new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]);
  const startingArrayIndex = 0;
  const bufferId = gl.createBuffer();

  if (!bufferId) {
    console.error("Failed to create the buffer object"); // eslint-disable-line
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.enableVertexAttribArray(startingArrayIndex);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.vertexAttribPointer(startingArrayIndex, 2, gl.FLOAT, false, 0, 0);
};

// TEXTURE SHADERS

const vs = `
precision highp float;

attribute vec2 position;
varying vec2 uv;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
  uv = vec2(position.x * .5, -position.y * .5) + vec2(.5, .5);
}
`;

const fs = `
precision highp float;

uniform sampler2D tex;
varying vec2 uv;

void main() {
  gl_FragColor = vec4(texture2D(tex, uv).rgb, 1.);
}
`;

const AREA_SIZE = 149;
const PREVIEW_AREA_SIZE = 592;

const drawBitmapTexture = async (
  image: ImageData | HTMLCanvasElement,
  maxAreaSize: number
): Promise<{ url: string; width: number; height: number } | null> => {
  const bitmap = await createImageBitmap(image);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }
  const imageWidth = image.width;
  const imageHeight = image.height;

  canvas.width = imageWidth;
  canvas.height = imageHeight;

  const imageSizeMax = imageWidth > imageHeight ? imageWidth : imageHeight;
  const coeff = imageSizeMax / maxAreaSize;
  const areaWidth = imageWidth / coeff;
  const areaHeight = imageHeight / coeff;

  // Position the image on the canvas (0, 0), and specify width and height of the image (areaWidth, areaHeight)
  ctx.drawImage(bitmap, 0, 0, areaWidth, areaHeight);

  return {
    url: canvas.toDataURL("image/png"),
    width: areaWidth,
    height: areaHeight,
  };
};

const drawCompressedTexture = async (
  data,
  maxAreaSize: number
): Promise<{ url: string; width: number; height: number } | null> => {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl");
  instrumentGLContext(gl);
  if (!gl) {
    return null;
  }
  createAndFillBufferObject(gl);
  const program = new Program(gl, { vs, fs });

  const images = [data.data[0]]; // The first image only
  // const images = data.data;       // All images
  const imageWidth = data.width;
  const imageHeight = data.height;

  canvas.width = imageWidth;
  canvas.height = imageHeight;
  renderCompressedTexture(gl, program.handle, images);

  return await drawBitmapTexture(canvas, maxAreaSize);
};

type TextureSectionProps = {
  tile: Tile3D;
};

export const TextureSection = ({ tile }: TextureSectionProps) => {
  // TODO: { To debug only. Remove it for release.
  const [hint, setHint] = useState<string>("");
  // TODO: } To debug only. Remove it for release.

  const [texture, setTexture] = useState<string>("");
  const [previewTexture, setPreviewTexture] = useState<string>("");
  const [showPreviewTexture, setShowPreviewTexture] = useState<boolean>(false);

  const [size, setSize] = useState<SIZE>({
    width: AREA_SIZE,
    height: AREA_SIZE,
  });
  const [previewSize, setPreviewSize] = useState<SIZE>({
    width: PREVIEW_AREA_SIZE,
    height: PREVIEW_AREA_SIZE,
  });

  const contentImage =
    tile.content?.material?.pbrMetallicRoughness?.baseColorTexture?.texture
      ?.source?.image;

  const originalTexture = tile.userData?.originalTexture;
  const image = originalTexture || contentImage;

  useEffect(() => {
    if (image) {
      // TODO: { To debug only. Remove it for release.
      const hintStr =
        `${tile.header.textureFormat}, ${image.width}x${image.height}, ` +
        tile.header.textureUrl;
      setHint(hintStr);
      // TODO: } To debug only. Remove it for release.

      if (image.compressed) {
        drawCompressedTexture(image, AREA_SIZE).then((ret) => {
          const dataUrl = ret?.url || "";
          const canvasWidth = ret?.width || 0;
          const canvasHeight = ret?.height || 0;
          setSize({ width: canvasWidth, height: canvasHeight });
          setTexture(dataUrl);
        });

        drawCompressedTexture(image, PREVIEW_AREA_SIZE).then((ret) => {
          const dataUrl = ret?.url || "";
          const canvasWidth = ret?.width || 0;
          const canvasHeight = ret?.height || 0;

          setPreviewSize({
            width: canvasWidth,
            height: canvasHeight,
          });
          setPreviewTexture(dataUrl);
        });
      } else {
        drawBitmapTexture(image, AREA_SIZE).then((ret) => {
          const dataUrl = ret?.url || "";
          const canvasWidth = ret?.width || 0;
          const canvasHeight = ret?.height || 0;
          setSize({ width: canvasWidth, height: canvasHeight });
          setTexture(dataUrl);
        });

        drawBitmapTexture(image, PREVIEW_AREA_SIZE).then((ret) => {
          const dataUrl = ret?.url || "";
          const canvasWidth = ret?.width || 0;
          const canvasHeight = ret?.height || 0;
          setPreviewSize({ width: canvasWidth, height: canvasHeight });
          setPreviewTexture(dataUrl);
        });
      }
    }
  }, [image]);

  return (
    <>
      <TileInfoSectionWrapper>
        <Title left={16}>Texture:</Title>
        <TextureContainer
          onClick={() => {
            setShowPreviewTexture(true);
          }}
        >
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
          <div>{hint}</div>
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
