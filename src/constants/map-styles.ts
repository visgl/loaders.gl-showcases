import { type FC } from "react";
import CustomMap from "../../public/icons/custom-map.svg";

import MaplibreDarkMap from "../../public/icons/basemaps/maplibre-dark.png";
import MaplibreLightMap from "../../public/icons/basemaps/maplibre-light.png";

import TerrainMap from "../../public/icons/basemaps/terrain.png";

import ArcGisDarkGrayMap from "../../public/icons/basemaps/arcgis-dark-gray.png";
import ArcGisLightGrayMap from "../../public/icons/basemaps/arcgis-light-gray.png";
import ArcGisStreetsDarkMap from "../../public/icons/basemaps/arcgis-streets-dark.png";
import ArcGisStreetsMap from "../../public/icons/basemaps/arcgis-streets.png";
import { type BaseMap, BaseMapGroup } from "../types";

interface BasemapIcon {
  IconComponent?: FC<{ fill: string }>;
  iconUrl?: string;
}

export const basemapIcons: Record<string, BasemapIcon> = {
  Dark: { iconUrl: MaplibreDarkMap },
  Light: { iconUrl: MaplibreLightMap },
  Terrain: { iconUrl: TerrainMap },
  ArcGisDarkGray: { iconUrl: ArcGisDarkGrayMap },
  ArcGisLightGray: { iconUrl: ArcGisLightGrayMap },
  ArcGisStreetsDark: { iconUrl: ArcGisStreetsDarkMap },
  ArcGisStreets: { iconUrl: ArcGisStreetsMap },

  Custom: { IconComponent: CustomMap },
};

export const BASE_MAPS: BaseMap[] = [
  {
    id: "Dark",
    name: "Dark",
    iconId: "Dark",
    group: BaseMapGroup.Maplibre,
    mapUrl:
      "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
  },
  {
    id: "Light",
    name: "Light",
    iconId: "Light",
    group: BaseMapGroup.Maplibre,
    mapUrl:
      "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
  },

  {
    id: "Terrain",
    name: "Terrain",
    group: BaseMapGroup.Terrain,
    iconId: "Terrain",
    mapUrl: "",
  },

  {
    id: "gray-vector",
    name: "Light gray",
    group: BaseMapGroup.ArcGIS,
    iconId: "ArcGisLightGray",
    mapUrl: "",
  },
  {
    id: "dark-gray-vector",
    name: "Dark gray",
    group: BaseMapGroup.ArcGIS,
    iconId: "ArcGisDarkGray",
    mapUrl: "",
  },
  {
    id: "streets-vector",
    name: "Streets",
    group: BaseMapGroup.ArcGIS,
    iconId: "ArcGisStreets",
    mapUrl: "",
  },
  {
    id: "streets-night-vector",
    name: "Streets(night)",
    group: BaseMapGroup.ArcGIS,
    iconId: "ArcGisStreetsDark",
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
