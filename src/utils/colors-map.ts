export const COLORED_BY = {
  ORIGINAL: 0,
  RANDOM: 1,
  DEPTH: 2,
  CUSTOM: 3,
  TILE: 4,
};

export const DEPTH_COLOR_MAP = {
  1: [72, 149, 239],
  2: [67, 97, 238],
  3: [72, 12, 168],
  4: [86, 11, 173],
  5: [114, 9, 183],
  6: [181, 23, 158],
  7: [247, 37, 133],
  8: [236, 125, 16],
  9: [255, 188, 10],
  10: [251, 86, 7],
  11: [255, 190, 11],
  12: [255, 255, 0],
};

const DEPTH_MAX_LEVEL = 12;
const DEFAULT_COLOR = [255, 255, 255];
const DEFAULT_HIGLIGHT_COLOR = [0, 100, 255];

export default class ColorMap {
  randomColorMap: { [id: string]: number[] };
  colorMap: { [id: string]: number[] };

  constructor() {
    this.randomColorMap = {};
    this.colorMap = {};
  }

  /**
   * Returns color in RGB format depends on coloredBy param.
   * @param {object} tile
   * @param {object} options
   */
  getColor(tile, options) {
    switch (options.coloredBy) {
      case COLORED_BY.RANDOM:
        return this._getRandomColor(tile.id);
      case COLORED_BY.DEPTH:
        return this._getColorByDepth(tile.id, tile.depth);
      case COLORED_BY.TILE:
        return this._getColorByTile(tile.id);
      case COLORED_BY.CUSTOM:
        return this._getCustomColor(tile.id, options);
      default:
        this._resetColorsMap();
    }
  }

  /**
   * Returns color in RGB format by tile id if it exists in colors map.
   * @param {string} id
   */
  _getColorByTile(id) {
    return this.colorMap[id];
  }

  /**
   * Returns color in RGB format depends on depth level.
   * @param {string} id
   * @param {number} level
   */
  _getColorByDepth(id, level) {
    this.colorMap[id] =
      DEPTH_COLOR_MAP[level] || DEPTH_COLOR_MAP[DEPTH_MAX_LEVEL];
    return this.colorMap[id];
  }

  /**
   * Returns custom color in RGB format for tile.
   * @param {string} tileId
   * @param {object} options
   */
  _getCustomColor(tileId, options) {
    let color = DEFAULT_COLOR;
    if (options.coloredTilesMap && options.coloredTilesMap[tileId]) {
      color = options.coloredTilesMap[tileId];
    } else if (options.selectedTileId === tileId) {
      color = DEFAULT_HIGLIGHT_COLOR;
    }
    this.colorMap[tileId] = color;
    return color;
  }

  /**
   * Generates randorm RGB color by tile id.
   * @param {string} id
   */
  _getRandomColor(id) {
    const r = Math.round(Math.random() * 255);
    const g = 205;
    const b = Math.round(Math.random() * 255);

    const randomColor = [r, g, b];

    this.randomColorMap[id] = this.randomColorMap[id] || randomColor;
    this.colorMap[id] = this.randomColorMap[id];
    return this.colorMap[id];
  }

  _resetColorsMap() {
    this.colorMap = {};
    this.randomColorMap = {};
  }
}

/**
 * Convert array of RGB values from color object.
 * @param {object} color
 */
export function getRGBValueFromColorObject(color) {
  const { r, g, b } = color.rgb;
  return [r, g, b];
}

/**
 * Convert {r,g,b} color object from color array [r,g,b].
 * @param {array} color
 */
export function makeRGBObjectFromColor(color) {
  if (!color) {
    return {
      r: DEFAULT_HIGLIGHT_COLOR[0],
      g: DEFAULT_HIGLIGHT_COLOR[1],
      b: DEFAULT_HIGLIGHT_COLOR[2],
    };
  }
  return { r: color[0], g: color[1], b: color[2] };
}
