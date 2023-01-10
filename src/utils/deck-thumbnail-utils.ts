import html2canvas from "html2canvas";

const BOOKMARK_THUMBNAIL_WIDTH = 144;
const BOOKMARK_THUMBNAIL_HEIGHT = 81;

/**
 * Create a thumbnail from comparison side canvas elements
 * @param leftContainerId - html id of left canvas container
 * @param rightContainerId - html id of right canvas container
 * @returns base64 image
 */
export const createComparisonBookmarkThumbnail = async (
  leftContainerId,
  rightContainerId
): Promise<string | null> => {
  const leftThumbnailCanvas = await createBookmarkThumbnail(
    leftContainerId,
    BOOKMARK_THUMBNAIL_WIDTH / 2,
    BOOKMARK_THUMBNAIL_HEIGHT
  );
  const rightThumbnailCanvas = await createBookmarkThumbnail(
    rightContainerId,
    BOOKMARK_THUMBNAIL_WIDTH / 2,
    BOOKMARK_THUMBNAIL_HEIGHT
  );
  if (!leftThumbnailCanvas || !rightThumbnailCanvas) {
    return null;
  }
  return mergeComparisonThumbnails(leftThumbnailCanvas, rightThumbnailCanvas);
};

/**
 * Create a thumbnail from canvas element
 * @param containerId - html id of canvas container
 * @returns base64 image
 */
export const createViewerBookmarkThumbnail = async (
  containerId
): Promise<string | null> => {
  // If only one canvas is presented just use it's image.
  const canvas = await createBookmarkThumbnail(
    containerId,
    BOOKMARK_THUMBNAIL_WIDTH,
    BOOKMARK_THUMBNAIL_HEIGHT
  );

  if (!canvas) {
    return null;
  }

  const outputCanvas = document.createElement("canvas");
  const ctx = outputCanvas.getContext("2d");
  if (!ctx) {
    return null;
  }
  outputCanvas.width = canvas.width + canvas.width;
  outputCanvas.height = canvas.height;
  ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

  return outputCanvas.toDataURL("image/png");
};

/**
 * Create a thumbnail image from comparison side canvas.
 * Taking screenshots from deck.gl is a tricky task. The current implementation relies
 * on the comment:
 * https://github.com/visgl/deck.gl/issues/4436#issuecomment-1138796168
 * @param canvasLeft - left hand side canvas
 * @param canvasRight - right hand side canvas
 * @returns - base64 image
 */
const createBookmarkThumbnail = async (
  containerId: string,
  width: number,
  height: number
): Promise<HTMLCanvasElement | null> => {
  const domElement = document.querySelector(containerId);
  if (!domElement) {
    return null;
  }
  const canvas = await html2canvas(domElement as HTMLElement);
  const thumbnail = createThumbnail(canvas, width, height);
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
  ctx.drawImage(
    rightCanvas,
    leftCanvas.width + 1,
    0,
    rightCanvas.width,
    rightCanvas.height
  );
  return outputCanvas.toDataURL("image/png");
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
