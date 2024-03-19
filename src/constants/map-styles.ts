import MaplibreDarkMap from "../../public/icons/basemaps/maplibre-dark.png";
import MaplibreLightMap from "../../public/icons/basemaps/maplibre-light.png";

import TerrainMap from "../../public/icons/basemaps/terrain.png";

import ArcGisDarkGrayMap from "../../public/icons/basemaps/arcgis-dark-gray.png";
import ArcGisLightGrayMap from "../../public/icons/basemaps/arcgis-light-gray.png";
import ArcGisStreetsDarkMap from "../../public/icons/basemaps/arcgis-streets-dark.png";
import ArcGisStreetsMap from "../../public/icons/basemaps/arcgis-streets.png";
import { type BaseMap, BaseMapGroup } from "../types";

export const BASE_MAPS: BaseMap[] = [
  {
    id: "Dark",
    name: "Dark",
    icon: MaplibreDarkMap,
    group: BaseMapGroup.Maplibre,
    mapUrl:
      "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
  },
  {
    id: "Light",
    name: "Light",
    icon: MaplibreLightMap,
    group: BaseMapGroup.Maplibre,
    mapUrl:
      "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
  },

  {
    id: "Terrain",
    name: "Terrain",
    group: BaseMapGroup.Terrain,
    icon: TerrainMap,
    mapUrl: "",
  },

  {
    //          id: "arcgis/light-gray", // "ArcGisLightGray",
    id: "gray-vector",
    name: "Light gray",
    group: BaseMapGroup.ArcGIS,
    icon: ArcGisLightGrayMap,
    mapUrl: "",
  },
  {
    //          id: "arcgis/dark-gray", // "ArcGisDarkGray",
    id: "dark-gray-vector",
    name: "Dark gray",
    group: BaseMapGroup.ArcGIS,
    icon: ArcGisDarkGrayMap,
    mapUrl: "",
  },
  {
    //          id: "arcgis/streets",
    id: "streets-vector",
    name: "Streets",
    group: BaseMapGroup.ArcGIS,
    icon: ArcGisStreetsMap,
    mapUrl: "",
  },
  {
    //          id: "arcgis/streets-night",
    id: "streets-night-vector",
    name: "Streets(night)",
    group: BaseMapGroup.ArcGIS,
    icon: ArcGisStreetsDarkMap,
    mapUrl: "",
  },
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
