import { drawBitmapTexture } from "./texture-render-utils";

const mockDrawImage = jest.fn();

Object.defineProperty(window, "createImageBitmap", {
  writable: true,
  value: jest.fn().mockImplementation((image) => image),
});

Object.defineProperty(window, "ImageBitmap", {
  writable: true,
  value: jest.fn().mockImplementation((name) => ({ name })),
});

describe("Texture Selector Utils - selectDebugTextureForTileset", () => {
  beforeAll(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      drawImage: mockDrawImage,
    });
    HTMLCanvasElement.prototype.toDataURL = jest.fn().mockReturnValue({});
  });

  test("Should return new width and height of bitmap image", async () => {
    const image = { width: 64, height: 128 };
    const { width, height } = await drawBitmapTexture(image as ImageData, 512);
    expect(width).toBe(256);
    expect(height).toBe(512);
  });
});
