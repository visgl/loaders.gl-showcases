import type { Tileset3D } from "@loaders.gl/tiles";

import { Stats } from "@probe.gl/stats";

export const initStats = (url = ""): Stats => {
  const stats = new Stats({ id: url });
  return stats;
};

export const sumTilesetsStats = (tilesets: Tileset3D[], stats: Stats): void => {
  stats.reset();
  for (const tileset of tilesets) {
    tileset.stats.forEach((stat) => {
      stats.get(stat.name, stat.type).addCount(stat.count);
    });
  }
};
