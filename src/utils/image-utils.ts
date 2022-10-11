import html2canvas from "html2canvas";

const THUMBNAIL_WIDTH = 144;
const THUMBNAIL_HEIGHT = 81;

/**
 * Create a thumbnail image for bookmark from comparison sides
 * @param canvasLeft - left hand side canvas
 * @param canvasRight - right hand side canvas
 * @returns - base64 image
 */
export const createComparisonBookmarkImage = async (
  containerId: string
): Promise<HTMLCanvasElement | null> => {
  const domElement = document.querySelector(containerId);
  if (!domElement) {
    return null;
  }
  const canvas = await html2canvas(domElement as HTMLElement);
  const thumbnail = createThumbnail(
    canvas,
    THUMBNAIL_WIDTH / 2,
    THUMBNAIL_HEIGHT
  );
  if (!thumbnail) {
    return null;
  }
  return thumbnail;
};

/**
 * Merge 2 sides thumbnails into one thumbnail
 * @param leftCanvas Left side map thumbnail
 * @param rightCanvas Right side map thumbnail
 * @returns base64 image
 */
export const mergeComparisonThumbnails = (
  leftCanvas: HTMLCanvasElement,
  rightCanvas: HTMLCanvasElement
): string | null => {
  const outputCanvas = document.createElement("canvas");
  const ctx = outputCanvas.getContext("2d");
  if (!ctx) {
    return null;
  }
  outputCanvas.width = leftCanvas.width + rightCanvas.width;
  outputCanvas.height = leftCanvas.height;
  ctx.drawImage(leftCanvas, 0, 0, leftCanvas.width, leftCanvas.height);
  ctx.drawImage(rightCanvas, leftCanvas.width + 1, 0, rightCanvas.width, rightCanvas.height);
  return outputCanvas.toDataURL('image/png');
};

/**
 * Creates thumbnail from canvas element
 * @param canvas - input canvas
 * @param width - output width
 * @param height - output height
 * @returns Canvas element with required size
 */
const createThumbnail = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): HTMLCanvasElement | null => {
  const { width: inputWidth, height: inputHeight } = canvas;
  const inputAspectRatio = inputWidth / inputHeight;
  const outputAspectRatio = width / height;
  let cropWidth, cropHeight, cropX, cropY;
  if (inputAspectRatio > outputAspectRatio) {
    cropHeight = inputHeight;
    cropWidth = (inputHeight / height) * width;
    cropX = (inputWidth - cropWidth) / 2;
    cropY = 0;
  } else {
    cropHeight = (inputWidth / width) * height;
    cropWidth = inputWidth;
    cropX = 0;
    cropY = (inputHeight - cropHeight) / 2;
  }
  const outputCanvas = document.createElement("canvas");
  const ctx = outputCanvas.getContext("2d");
  if (!ctx) {
    return null;
  }
  outputCanvas.width = width;
  outputCanvas.height = height;
  ctx.drawImage(
    canvas,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    width,
    height
  );
  return outputCanvas;
};
