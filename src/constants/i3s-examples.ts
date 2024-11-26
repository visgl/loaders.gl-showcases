import { type LayerExample, TilesetType } from "../types";

export const TRANSITION_DURATION = 4000;

// Example of WebScene Url
// https://www.arcgis.com/sharing/rest/content/items/19dcff93eeb64f208d09d328656dd492/data

export const INITIAL_EXAMPLE: LayerExample = {
  id: "san-francisco-v1_7",
  name: "San Francisco v1.7",
  url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
  type: TilesetType.I3S,
  mapInfo: "https://www.arcgis.com/home/item.html?id=f71313a22abb4431974374a009f2e54b",
};

export const EXAMPLES: LayerExample[] = [
  {
    id: "san-francisco-v1_8",
    name: "San Francisco v1.8",
    url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0",
    type: TilesetType.I3S,
    mapInfo: "https://www.arcgis.com/home/item.html?id=d3344ba99c3f4efaa909ccfbcc052ed5",
  },
  INITIAL_EXAMPLE,
  {
    id: "new-york",
    name: "New York",
    url: "https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Buildings_NewYork_17/SceneServer/layers/0",
    type: TilesetType.I3S,
    mapInfo: "https://www.arcgis.com/home/item.html?id=a457834a6cb449cd958502d6e98ba305",
  },
  {
    id: "turanga-library",
    name: "Turanga Library",
    url: "https://tiles.arcgis.com/tiles/cFEFS0EWrhfDeVw9/arcgis/rest/services/Turanga_Library/SceneServer/layers/0",
    type: TilesetType.I3S,
  },
];
