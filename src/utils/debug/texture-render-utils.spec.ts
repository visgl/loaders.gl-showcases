import { drawBitmapTexture } from "./texture-render-utils";

const mockDrawImage = jest.fn();

Object.defineProperty(window, "createImageBitmap", {
  writable: true,
  value: jest.fn().mockImplementation((image) => image),
});

Object.defineProperty(window, "ImageBitmap", {
  writable: true,
  value: jest.fn().mockImplementation((name) => ({ name: name })),
});

describe("Texture Selector Utils - selectDebugTextureForTileset", () => {
  beforeAll(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      drawImage: mockDrawImage,
    });
    HTMLCanvasElement.prototype.toDataURL = jest.fn().mockReturnValue({});
  });

  test("Should return new width and height of bitmap image", async () => {
    const { width, height } = await drawBitmapTexture(
      { width: 64, height: 128 } as ImageData,
      512
    );
    expect(width).toBe(256);
    expect(height).toBe(512);
  });
});
