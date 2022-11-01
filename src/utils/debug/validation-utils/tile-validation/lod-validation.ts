import type { Tile3D } from "@loaders.gl/tiles";
import type { TileWarning } from '../../../../types';

import { LOD_WARNING_TYPE, PARENT_LOD_WARNING_TYPE } from "../../../../constants/map-styles";

/**
 * Check LOD value of tile
 * @param  tile
 * @param tileWarnings
 * LOD spec https://github.com/Esri/i3s-spec/blob/master/format/LevelofDetail.md
 */
export const checkLOD = (tile: Tile3D, tileWarnings: TileWarning[]): void => {
  const divergence = 0.05;
  const tileLodRatio = tile.lodMetricValue / tile.boundingVolume.radius;
  const parentLodRatio =
    tile.parent.lodMetricValue / tile.parent.boundingVolume.radius;
  const lodRatios = tile.parent.children.map((child) => {
    return child.lodMetricValue / child.boundingVolume.radius;
  });
  const meanRatio =
    lodRatios.reduce((accum, current) => accum + current, 0) / lodRatios.length;

  if (
    meanRatio < parentLodRatio &&
    !tileWarnings.find(
      (warning) =>
        warning.tileId === tile.parent.id &&
        warning.type === PARENT_LOD_WARNING_TYPE
    )
  ) {
    const title = `Tile (${tile.parent.id}) LOD/Radius ratio "${parentLodRatio}" > mean child LOD/Radius ratio "${meanRatio}"`;
    tileWarnings.push({
      type: PARENT_LOD_WARNING_TYPE,
      title,
      tileId: tile.parent.id,
    });
  }

  if (Math.abs(tileLodRatio - meanRatio) > divergence) {
    const title = `Tile (${tile.id}) LOD/Radius ratio "${tileLodRatio}" has large deviation from mean LOD/Radius ratio of neighbors "${meanRatio}"`;
    tileWarnings.push({
      type: LOD_WARNING_TYPE,
      title,
      tileId: tile.parent.id,
    });
  }
};
