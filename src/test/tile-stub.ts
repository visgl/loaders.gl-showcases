import { Tile3D, Tileset3D } from "@loaders.gl/tiles";
import { getTileHeader } from "./tile-header-stub";
import { getTilesetHeader } from "./tileset-header-stub";

export const getTileset3d = () => {
  return new Tileset3D(getTilesetHeader());
};

export const getTile3d = () => {
  const newTile = new Tile3D(getTileset3d(), getTileHeader());
  newTile.content = {
    vertexCount: 52964,
  };
  return newTile;
};
