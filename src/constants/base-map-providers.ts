import { Map as MaplibreMap } from "react-map-gl/maplibre";
import { Map as MapboxMap } from "react-map-gl";
import { BaseMapProvider, BaseMapProviderProps } from "../types";

export enum BaseMapProviderId {
  maplibre = "maplibre",
  mapbox2 = "mapbox2",
  googleMaps = "google-maps",
  arcgis = "arcgis",
}

export const BASE_MAP_PROVIDERS: BaseMapProvider[] = [
  { name: "MapLibre", id: BaseMapProviderId.maplibre },
  { name: "Mapbox 2", id: BaseMapProviderId.mapbox2 },
  { name: "Google Maps", id: BaseMapProviderId.googleMaps },
  { name: "ArcGIS", id: BaseMapProviderId.arcgis },
];

const mapboxAccessToken = "";
//import.meta.env.VITE_MAPBOX_API_KEY;

export const MAP_PROVIDER_PROPERTIES: Record<
  BaseMapProviderId.mapbox2 | BaseMapProviderId.maplibre,
  BaseMapProviderProps
> = {
  [BaseMapProviderId.maplibre]: {
    Map: MaplibreMap,
    mapStyle: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    terrainProps: {
      id: "dem-data-source",
      type: "raster-dem",
      tiles: [
        "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
      ],
      encoding: "terrarium",
      tileSize: 256,
      maxzoom: 25,
    },
  },
  [BaseMapProviderId.mapbox2]: {
    Map: MapboxMap,
    mapStyle: "mapbox://styles/mapbox/streets-v12",
    accessToken: mapboxAccessToken,
    terrainProps: {
      id: "dem-data-source",
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxZoom: 25,
    },
  },
};
