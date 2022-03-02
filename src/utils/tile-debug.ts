import type { Tile3D } from "@loaders.gl/tiles";
import type { TileWarning, TileValidationData } from './types';
import { checkBoundingVolumes } from "./bounding-volume-validation";
import { isAllVerticesInsideBoundingVolume } from "./bounding-volume-vertices";
import { createBoundingVolumeFromTile } from "./bounding-volume-from-tile";
import { checkLOD } from "./lod-validation";
import { getBoundingType } from './get-volume-type';

const NO_DATA = "No Data";

const REFINEMENT_TYPES = {
  1: "Add",
  2: "Replace",
};

const FLOAT_VALUES_FIXED_COUNT = 3;

/**
 * Return short tile info
 * @param tileHeader
 * @returns short tile info for debugging purposes
 */
export const getShortTileDebugInfo = (tileHeader: Tile3D): { [key: string]: string | number } => {
  const childrenInfo = getChildrenInfo(tileHeader.header.children);
  // @ts-expect-error - Property '_distanceToCamera' is private and only accessible within class 'TileHeader'.
  const distanceToCamera = formatFloatNumber(tileHeader._distanceToCamera);

  return {
    "Tile Id": tileHeader.id,
    Type: tileHeader.type || NO_DATA,
    "Children Count": childrenInfo.count,
    "Children Ids": childrenInfo.ids,
    "Vertex count": tileHeader.content.vertexCount || NO_DATA,
    "Distance to camera": distanceToCamera !== null ?
      // @ts-expect-error - Property '_distanceToCamera' is private and only accessible within class 'TileHeader'.
      `${formatFloatNumber(tileHeader._distanceToCamera)} m` : NO_DATA
  };
};

/**
 * Return extended tile info
 * @param tileHeader
 * @returns extended tile info for debugging purposes
 */
export const getTileDebugInfo = (tileHeader: Tile3D): { [key: string]: string | number | boolean } => {
  const LODMetricValue = formatFloatNumber(tileHeader.lodMetricValue);
  // @ts-expect-error - Property '_distanceToCamera' is private and only accessible within class 'TileHeader'.
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
 * @param tile
 * @returns List of warnings
 */
export const validateTile = (tile: Tile3D): TileWarning[] => {
  const tileWarnings: TileWarning[] = [];

  if (tile.parent) {
    checkBoundingVolumes(tile, tileWarnings);
    checkLOD(tile, tileWarnings);
  }

  return tileWarnings;
};

/**
 * Do float numbers formatting based on fixed value
 * @param tile
 */
const formatFloatNumber = (value: number): string | null => {
  if (!value) {
    return null;
  }

  return value.toFixed(FLOAT_VALUES_FIXED_COUNT);
};

/**
 * Get tile's children info (count, ids)
 * @param children
 * @returns children data
 */
const getChildrenInfo = (children: Tile3D[]): { count: number | string, ids: string } => {
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
 * @param tile
 */
export const isTileGeometryInsideBoundingVolume = (tile: Tile3D): boolean => {
  const tileData = getTileDataForValidation(tile);
  const { positions, boundingVolume } = tileData;

  return isAllVerticesInsideBoundingVolume(boundingVolume, positions);
};

/**
 * Generates data for tile validation
 * @param tile
 */
const getTileDataForValidation = (tile: Tile3D): TileValidationData => {
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

