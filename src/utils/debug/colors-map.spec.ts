import ColorMap, {
  getRGBValueFromColorObject,
  makeRGBObjectFromColor,
} from "./colors-map";

const DEFAULT_COLOR = [255, 255, 255];
const DEFAULT_HIGLIGHT_COLOR = [0, 100, 255];

let colorMap;

beforeEach(() => {
  colorMap = new ColorMap();
});

describe("Color Map", () => {
  test("Should create color Map", () => {
    expect(colorMap).toBeDefined();
    expect(colorMap.randomColorMap).toBeDefined();
    expect(colorMap.colorMap).toBeDefined();
  });

  test("Should return default color", () => {
    const tile = {
      id: "test",
    };

    const randomColor = colorMap.getTileColor(tile, {});
    expect(randomColor).toEqual(DEFAULT_COLOR);
  });

  test("Should return default color", () => {
    const tile = {
      id: "test",
    };

    const randomColor = colorMap.getTileColor(tile, {});
    expect(randomColor).toEqual(DEFAULT_COLOR);

    const defaultColor = colorMap.getTileColor(tile, { coloredBy: "Original" });
    expect(defaultColor).toEqual(DEFAULT_COLOR);
  });

  test("Should return random color", () => {
    const tile = {
      id: "test",
    };

    const randomColor = colorMap.getTileColor(tile, {
      coloredBy: "Random by tile",
    });
    expect(randomColor).toBeDefined();
    const colorForTheSameTile = colorMap.getTileColor(tile, {
      coloredBy: "Random by tile",
    });

    expect(randomColor).toEqual(colorForTheSameTile);
  });

  test("Should return color by depth", () => {
    const tile = {
      id: "test",
      depth: 1,
    };

    const colorByDepth = colorMap.getTileColor(tile, { coloredBy: "By depth" });
    expect(colorByDepth).toBeDefined();
    const colorForTheSameTile = colorMap.getTileColor(tile, {
      coloredBy: "By depth",
    });

    expect(colorByDepth).toEqual(colorForTheSameTile);
  });

  test("Should return DEFAULT color in _getColorByTile method if colorMap isEmpty", () => {
    const tile = {
      id: "test",
    };

    const colorByTile = colorMap.getTileColor(tile, {
      coloredBy: "User selected",
    });
    expect(colorByTile).toEqual(DEFAULT_COLOR);
  });

  test("Should return DEFAULT tile color in _getCustomColor if coloredTilesMap is not provided", () => {
    const tile = {
      id: "test",
      coloredTilesMap: null,
    };

    const customColor = colorMap.getTileColor(tile, {
      coloredBy: "User selected",
    });

    expect(customColor).toEqual(DEFAULT_COLOR);
  });

  test("Should return DEFAULT tile color in _getCustomColor if no tileId in coloredTilesMap", () => {
    const tile = {
      id: "test",
      coloredTilesMap: {},
    };

    const customColor = colorMap.getTileColor(tile, {
      coloredBy: "User selected",
    });

    expect(customColor).toEqual(DEFAULT_COLOR);
  });

  test("Should return custom color in _getCustomColor", () => {
    const tile = {
      id: "test",
    };

    const customColor = colorMap.getTileColor(tile, {
      coloredBy: "User selected",
      coloredTilesMap: { test: [128, 128, 128] },
    });

    expect(customColor).toEqual([128, 128, 128]);
  });

  test("Should return selection color in _getCustomColor", () => {
    const tile = {
      id: "test",
    };

    const customColor = colorMap.getTileColor(tile, {
      coloredBy: "User selected",
      selectedTileId: "test",
    });
    const isCustomColorExistInColorMap = Boolean(colorMap.colorMap.test);

    expect(customColor).toEqual(DEFAULT_HIGLIGHT_COLOR);
    expect(isCustomColorExistInColorMap).toBe(true);
  });

  test("Should return default bounding volume color", () => {
    const boundingVolumeTile = {
      id: "test",
    };

    const defaultColor = colorMap.getBoundingVolumeColor(boundingVolumeTile, {
      coloredBy: "Original",
    });

    expect(defaultColor).toEqual(DEFAULT_COLOR);
  });

  test("Should return default bounding volume color if provided wrong coloredBy prop", () => {
    const boundingVolumeTile = {
      id: "test",
    };

    const defaultColor = colorMap.getBoundingVolumeColor(boundingVolumeTile, {
      coloredBy: "Wrong",
    });

    expect(defaultColor).toEqual(DEFAULT_COLOR);
  });

  test("Should return default color if colored by tile option is provided and no any colors in map", () => {
    const tile = {
      id: "test",
    };

    const colorByDepth = colorMap.getBoundingVolumeColor(tile, {
      coloredBy: "By tile",
    });

    expect(colorByDepth).toEqual(DEFAULT_COLOR);
  });

  test("Should return tile color if color bounding volume tile id exists in colors map and colorsMap is not empty", () => {
    const tile = {
      id: "test",
    };

    const colorByDepth = colorMap.getTileColor(tile, { coloredBy: "By depth" });
    const colorByTile = colorMap.getBoundingVolumeColor(tile, {
      coloredBy: "By tile",
    });

    expect(colorByDepth).toEqual(colorByTile);
  });

  test("Should reset colors map", () => {
    const tile = {
      id: "test",
    };

    colorMap.getTileColor(tile, { coloredBy: "Random by tile" });
    const map = colorMap.colorMap;
    expect(Boolean(map.test)).toBe(true);

    colorMap._resetColorsMap();

    const updatedMap = colorMap.colorMap;

    expect(Boolean(updatedMap.test)).toBe(false);

    expect(colorMap.colorMap).toStrictEqual({});
    expect(colorMap.randomColorMap).toStrictEqual({});
  });

  test("Should return rgb value from color object", () => {
    const rgbObject = { rgb: { r: 121, g: 122, b: 123 } };
    const color = getRGBValueFromColorObject(rgbObject);

    expect(color).toStrictEqual([121, 122, 123]);
  });

  test("Should make default rgb object if no color", () => {
    const rgbObject = { r: 0, g: 100, b: 255 };
    const color = makeRGBObjectFromColor(null);

    expect(color).toStrictEqual(rgbObject);
  });

  test("Should make rgb object from color", () => {
    const rgbObject = { r: 121, g: 122, b: 123 };
    const color = makeRGBObjectFromColor([121, 122, 123]);

    expect(color).toStrictEqual(rgbObject);
  });
});
