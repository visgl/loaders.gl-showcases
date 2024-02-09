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

const createAndFillBufferObject = (gl, program) => {
  const data = new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]);
  const positionArrayLocation =
    program.configuration.attributeInfosByName.position.location;
  const bufferId = gl.createBuffer();

  if (!bufferId) {
    console.error("Failed to create the buffer object"); // eslint-disable-line
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.enableVertexAttribArray(positionArrayLocation);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionArrayLocation, 2, gl.FLOAT, false, 0, 0);
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

const createWebglElement = (
  data,
  maxAreaSize: number
): HTMLCanvasElement | null => {
  const images = [data.data[0]];
  const imageWidth = data.width;
  const imageHeight = data.height;

  const imageSizeMax = imageWidth > imageHeight ? imageWidth : imageHeight;

  const coeff = imageSizeMax / maxAreaSize;
  const areaWidth = imageWidth / coeff;
  const areaHeight = imageHeight / coeff;

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = areaWidth;
  outputCanvas.height = areaHeight;

  const gl = outputCanvas.getContext("webgl");
  instrumentGLContext(gl);
  if (!gl) {
    return null;
  }

  gl.viewport(0, 0, areaWidth, areaHeight);

  const program = new Program(gl, { vs, fs });
  createAndFillBufferObject(gl, program);

  renderCompressedTexture(gl, program.handle, images);

  return outputCanvas;
};

type TextureSectionProps = {
  tile: Tile3D;
};

export const TextureSection = ({ tile }: TextureSectionProps) => {
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
    if (image?.compressed) {
      const canvas = createWebglElement(image, AREA_SIZE);
      const dataUrl = canvas?.toDataURL() || "";
      const canvasWidth = canvas?.width || 0;
      const canvasHeight = canvas?.height || 0;
      setSize({ width: canvasWidth, height: canvasHeight });
      setTexture(dataUrl);

      const previewCanvas = createWebglElement(image, PREVIEW_AREA_SIZE);
      const previewDataUrl = previewCanvas?.toDataURL() || "";
      const previewCanvasWidth = previewCanvas?.width || 0;
      const previewCanvasHeight = previewCanvas?.height || 0;
      setPreviewSize({
        width: previewCanvasWidth,
        height: previewCanvasHeight,
      });
      setPreviewTexture(previewDataUrl);
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
