import {
  getSupportedGPUTextureFormats,
  GL_EXTENSIONS_CONSTANTS,
} from "@loaders.gl/textures";

import type { TextureLevel } from "@loaders.gl/schema";
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
const isFormatSupported = (
  gl: WebGLRenderingContext,
  format: number | undefined
) => {
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

/**
 * Creates Texture2D from the images provided
 * @param gl - GL context
 * @param images - compressed images used to create Texture2D
 * @returns texture handle
 */
const createCompressedTexture2D = (
  gl: WebGLRenderingContext,
  images: unknown[]
): WebGLTexture => {
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

/**
 * Renders the images provided
 * @param gl - GL context
 * @param program - GL program
 * @param images - compressed images to render
 */
const renderCompressedTexture = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  images: TextureLevel[]
) => {
  // We take the first image because it has main properties of compressed image.
  const { format } = images[0];

  if (!isFormatSupported(gl, format)) {
    throw new Error(`Texture format ${format} not supported by this GPU`);
  }

  const texture = createCompressedTexture2D(gl, images);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

const createAndFillBufferObject = (gl: WebGLRenderingContext, program: any) => {
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

/**
 * Draws and rescales the image provided
 * @param image - image to draw
 * @param size - size of the image drawn
 * @returns texture drawn and its size
 */
export const drawBitmapTexture = async (
  image: ImageData | HTMLCanvasElement,
  size: number
): Promise<{ url: string; width: number; height: number }> => {
  const bitmap = await createImageBitmap(image);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }
  const imageWidth = image.width;
  const imageHeight = image.height;

  canvas.width = imageWidth;
  canvas.height = imageHeight;

  const imageSizeMax = imageWidth > imageHeight ? imageWidth : imageHeight;
  const coeff = imageSizeMax / size;
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

/**
 * Draws and rescales the compressed image provided
 * @param data - object containing the compressed image
 * @param size - size of the image drawn
 * @returns texture drawn and its size
 */
export const drawCompressedTexture = async (
  data: {
    compressed: boolean;
    mipmaps: boolean;
    width: number;
    height: number;
    data: TextureLevel[];
  },
  size: number
): Promise<{ url: string; width: number; height: number }> => {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl");
  instrumentGLContext(gl);
  if (!gl) {
    throw new Error("No webgl context");
  }

  const program = new Program(gl, { vs, fs });
  createAndFillBufferObject(gl, program);

  const images = [data.data[0]]; // The first image only
  const imageWidth = data.width;
  const imageHeight = data.height;

  canvas.width = imageWidth;
  canvas.height = imageHeight;

  gl.viewport(0, 0, imageWidth, imageHeight);
  renderCompressedTexture(gl, program.handle, images);

  return await drawBitmapTexture(canvas, size);
};
