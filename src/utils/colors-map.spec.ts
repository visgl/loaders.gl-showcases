import ColorMap, { getRGBValueFromColorObject, makeRGBObjectFromColor } from './colors-map';

const DEFAULT_COLOR = [255, 255, 255];
const DEFAULT_HIGLIGHT_COLOR = [0, 100, 255];

describe("Color Map", () => {
  test("Should create color Map", () => {
    const colorMap = new ColorMap();

    expect(colorMap).toBeDefined();
    expect(colorMap.randomColorMap).toBeDefined();
    expect(colorMap.colorMap).toBeDefined();
  });

  test("Should return default color", () => {
    const colorMap = new ColorMap();

    const tile = {
      id: 'test'
    };

    const randomColor = colorMap.getColor(tile, {});
    expect(randomColor).toEqual(DEFAULT_COLOR);
  });

  test("Should return default color", () => {
    const colorMap = new ColorMap();

    const tile = {
      id: 'test'
    };

    const randomColor = colorMap.getColor(tile, {});
    expect(randomColor).toEqual(DEFAULT_COLOR);

    const defaultColor = colorMap.getColor(tile, { coloredBy: 0 });
    expect(defaultColor).toEqual(DEFAULT_COLOR);
  });

  test("Should return random color", () => {
    const colorMap = new ColorMap();

    const tile = {
      id: 'test'
    };

    const randomColor = colorMap.getColor(tile, { coloredBy: 1 });
    expect(randomColor).toBeDefined();
    const colorForTheSameTile = colorMap.getColor(tile, { coloredBy: 1 });

    expect(randomColor).toEqual(colorForTheSameTile);
  });

  test("Should return color by depth", () => {
    const colorMap = new ColorMap();

    const tile = {
      id: 'test',
      depth: 1
    };

    const colorByDepth = colorMap.getColor(tile, { coloredBy: 2 });
    expect(colorByDepth).toBeDefined();
    const colorForTheSameTile = colorMap.getColor(tile, { coloredBy: 2 });

    expect(colorByDepth).toEqual(colorForTheSameTile);
  });

  test("Should return DEFAULT color in _getColorByTile method if colorMap isEmpty", () => {
    const colorMap = new ColorMap();

    const tile = {
      id: 'test'
    };

    const colorByTile = colorMap.getColor(tile, { coloredBy: 4 });
    expect(colorByTile).toEqual(DEFAULT_COLOR);
  });

  test("Should return existing tile color in _getColorByTile method", () => {
    const colorMap = new ColorMap();

    const tile = {
      id: 'test'
    };

    const colorByDepth = colorMap.getColor(tile, { coloredBy: 2 });
    const colorByTile = colorMap.getColor(tile, { coloredBy: 4 });

    expect(colorByDepth).toEqual(colorByTile);
  });

  test("Should return DEFAULT tile color in _getCustomColor if coloredTilesMap is not provided", () => {
    const colorMap = new ColorMap();

    const tile = {
      id: 'test',
      coloredTilesMap: null
    };

    const customColor = colorMap.getColor(tile, { coloredBy: 3 });

    expect(customColor).toEqual(DEFAULT_COLOR);
  });

  test("Should return DEFAULT tile color in _getCustomColor if no tileId in coloredTilesMap", () => {
    const colorMap = new ColorMap();

    const tile = {
      id: 'test',
      coloredTilesMap: {}
    };

    const customColor = colorMap.getColor(tile, { coloredBy: 3 });

    expect(customColor).toEqual(DEFAULT_COLOR);
  });

  test("Should return custom color in _getCustomColor", () => {
    const colorMap = new ColorMap();

    const tile = {
      id: 'test',
    };

    const customColor = colorMap.getColor(tile, { coloredBy: 3, coloredTilesMap: { 'test': [128, 128, 128] } });

    expect(customColor).toEqual([128, 128, 128]);
  });

  test("Should return selection color in _getCustomColor", () => {
    const colorMap = new ColorMap();

    const tile = {
      id: 'test',
    };

    const customColor = colorMap.getColor(tile, { coloredBy: 3, selectedTileId: 'test' });
    const map = colorMap.colorMap
    const isCustomColorExistInColorMap = Boolean(map['test']);

    expect(customColor).toEqual(DEFAULT_HIGLIGHT_COLOR);
    expect(isCustomColorExistInColorMap).toBe(true);
  });


  test("Should reset colors map", () => {
    const colorMap = new ColorMap();

    const tile = {
      id: 'test',
    };

    colorMap.getColor(tile, { coloredBy: 1 });
    const map = colorMap.colorMap;
    expect(Boolean(map['test'])).toBe(true);

    colorMap._resetColorsMap();

    const updatedMap = colorMap.colorMap;

    expect(Boolean(updatedMap['test'])).toBe(false);

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
