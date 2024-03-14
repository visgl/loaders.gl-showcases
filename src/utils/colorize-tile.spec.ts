import { colorizeTile } from "./colorize-tile";
import { customizeColors } from "@loaders.gl/i3s";
import { getTile3d } from "../test/tile-stub";
import type { COLOR } from "../types";

const CUSTOM_COLORS1 = {
  attributeName: "HEIGHTROOF",
  minValue: 0,
  maxValue: 100,
  minColor: [146, 146, 252, 255] as COLOR,
  maxColor: [44, 44, 175, 255] as COLOR,
  mode: "replace",
};

const CUSTOM_COLORS2 = {
  attributeName: "HEIGHTROOF",
  minValue: 0,
  maxValue: 100,
  minColor: [146, 146, 252, 255] as COLOR,
  maxColor: [44, 44, 175, 255] as COLOR,
  mode: "multiply",
};

const mockTile = getTile3d();
const originalColors = new Uint8Array([255, 255, 255, 255]);
mockTile.content.attributes = {
  colors: { value: originalColors },
};
mockTile.tileset.loadOptions = { i3s: {} };

jest.mock("@loaders.gl/i3s");
const mockReturnColors = { value: new Uint8Array([100, 100, 100, 255]) };
(customizeColors as unknown as jest.Mock<any>).mockReturnValue(
  Promise.resolve(mockReturnColors)
);

describe("colorizeTile", () => {
  it("Should colorize tile", async () => {
    const result1 = await colorizeTile(mockTile, CUSTOM_COLORS1);
    expect(result1.isColored).toEqual(true);
    expect(mockTile.content.originalColorsAttributes).toEqual({
      value: originalColors,
    });
    expect(mockTile.content.customColors).toEqual(CUSTOM_COLORS1);
    expect(mockTile.content.attributes.colors).toEqual(mockReturnColors);

    const result2 = await colorizeTile(mockTile, CUSTOM_COLORS2);
    expect(result2.isColored).toEqual(true);
    expect(mockTile.content.originalColorsAttributes).toEqual({
      value: originalColors,
    });
    expect(mockTile.content.customColors).toEqual(CUSTOM_COLORS2);
    expect(mockTile.content.attributes.colors).toEqual(mockReturnColors);

    const result3 = await colorizeTile(mockTile, null);
    expect(result3.isColored).toEqual(true);
    expect(mockTile.content.originalColorsAttributes).toEqual({
      value: originalColors,
    });
    expect(mockTile.content.customColors).toEqual(null);
    expect(mockTile.content.attributes.colors).toEqual({
      value: originalColors,
    });
  });

  it("Should not colorize tile", async () => {
    const result1 = await colorizeTile(mockTile, null);
    expect(result1.isColored).toEqual(false);

    await colorizeTile(mockTile, CUSTOM_COLORS1);
    mockTile.content.originalColorsAttributes = null;
    const result2 = await colorizeTile(mockTile, null);
    expect(result2.isColored).toEqual(false);

    const result = await colorizeTile(mockTile, CUSTOM_COLORS2);
    expect(result.isColored).toEqual(true);
    mockTile.content.customColors = null;
  });
});
