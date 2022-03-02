import { checkBoundingVolumes } from "./bounding-volume-validation";
import { isAllVerticesInsideBoundingVolume } from "./bounding-volume-vertices";
import { createBoundingVolumeFromTile } from "./bounding-volume-from-tile";
import { checkLOD } from "./lod-validation";
import { getBoundingType } from './bounding-volume-type';

const NO_DATA = "No Data";

const REFINEMENT_TYPES = {
  1: "Add",
  2: "Replace",
};

const FLOAT_VALUES_FIXED_COUNT = 3;

/**
 * Return short tile info
 * @param {object} tileHeader
 * @returns {object} - short tile info for debugging purposes
 */
export const getShortTileDebugInfo = (tileHeader) => {
  const childrenInfo = getChildrenInfo(tileHeader.header.children);
  const distanceToCamera = formatFloatNumber(tileHeader._distanceToCamera);

  return {
    "Tile Id": tileHeader.id,
    Type: tileHeader.type || NO_DATA,
    "Children Count": childrenInfo.count,
    "Children Ids": childrenInfo.ids,
    "Vertex count": tileHeader.content.vertexCount || NO_DATA,
    "Distance to camera": distanceToCamera !== null ?
      `${formatFloatNumber(tileHeader._distanceToCamera)} m` : NO_DATA
  };
};

/**
 * Return extended tile info
 * @param {object} tileHeader
 * @returns {object} - extended tile info for debugging purposes
 */
export const getTileDebugInfo = (tileHeader) => {
  const LODMetricValue = formatFloatNumber(tileHeader.lodMetricValue);
  const screenSpaceError = formatFloatNumber(tileHeader._screenSpaceError);

  return {
    ...getShortTileDebugInfo(tileHeader),
    "Refinement Type": REFINEMENT_TYPES[tileHeader.refine] || NO_DATA,
    "Has Texture": Boolean(tileHeader.content.texture),
    "Has Material": Boolean(tileHeader.content.material),
    "Bounding Type": getBoundingType(tileHeader),
    "LOD Metric Type": tileHeader.lodMetricType || NO_DATA,
    "LOD Metric Value": LODMetricValue !== null ? LODMetricValue : NO_DATA,
    "Screen Space Error": screenSpaceError !== null ? screenSpaceError : NO_DATA
  };
};

/**
 * Generates list of tile warnings
 * @param {object} tile
 * @returns {{message: {type: string, title: string}}[]} -List of warnings
 */
export const validateTile = (tile) => {
  const tileWarnings = [];

  if (tile.parent) {
    checkBoundingVolumes(tile, tileWarnings);
    checkLOD(tile, tileWarnings);
  }

  return tileWarnings;
};

/**
 * Do float numbers formatting based on fixed value
 * @param {number} tile
 * @returns {number}
 */
const formatFloatNumber = (value) => {
  if (!value) {
    return null;
  }

  return value.toFixed(FLOAT_VALUES_FIXED_COUNT);
};

/**
 * Get tile's children info (count, ids)
 * @param {array} children
 * @returns {object} - children data
 */
const getChildrenInfo = (children) => {
  if (!children || !children.length) {
    return {
      count: NO_DATA,
      ids: NO_DATA,
    };
  }

  const clildrenIds: string[] = [];

  for (const index in children) {
    clildrenIds.push(children[index].id);
  }

  return {
    count: clildrenIds.length,
    ids: clildrenIds.join(", "),
  };
};

/**
 * Check if geometry of tile inside bounding volume
 * @param {object} tile
 * @returns {boolean}
 */
export const isTileGeometryInsideBoundingVolume = (tile) => {
  const tileData = getTileDataForValidation(tile);
  const { positions, boundingVolume } = tileData;

  return isAllVerticesInsideBoundingVolume(boundingVolume, positions);
};

/**
 * Generates data for tile validation
 * @param {object} tile
 * @returns {object} - {positions, boundingType, boundingVolume}
 */
const getTileDataForValidation = (tile) => {
  if (
    !tile.content &&
    !tile.content.attributes &&
    !tile.content.attributes.POSITION
  ) {
    throw new Error("Validator - There are no positions in tile");
  }

  const boundingType = getBoundingType(tile);
  const positions = tile.content.attributes.positions.value;

  const boundingVolume = createBoundingVolumeFromTile(tile, boundingType);
  return { positions, boundingType, boundingVolume };
};

