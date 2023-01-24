import { BaseMap } from "../types";

export const BASE_MAPS: BaseMap[] = [
  {
    id: "Dark",
    name: "Dark",
    mapUrl:
      "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
  },
  {
    id: "Light",
    name: "Light",
    mapUrl:
      "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
  },
  { id: "Terrain", name: "Terrain", mapUrl: "" },
];

export const CONTRAST_MAP_STYLES = {
  "https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json":
    "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json":
    "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json":
    "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
};

export const BOUNDING_VOLUME_WARNING_TYPE = "boundingVolume";
export const LOD_WARNING_TYPE = "lod";
export const PARENT_LOD_WARNING_TYPE = "parentLod";
