import { LayerExample, TilesetType } from "../types";

export const TRANSITION_DURATION = 4000;
export const CUSTOM_EXAMPLE_VALUE = "custom-example";

// Example of WebScene Url
// https://www.arcgis.com/sharing/rest/content/items/19dcff93eeb64f208d09d328656dd492/data

export const INITIAL_EXAMPLE: LayerExample = {
  id: "san-francisco-v1.7",
  name: "San Francisco v1.7",
  url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
  type: TilesetType.I3S,
};

export const EXAMPLES: LayerExample[] = [
  {
    id: "san-francisco-v1.6",
    name: "San Francisco v1.6",
    url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0",
    type: TilesetType.I3S,
  },
  INITIAL_EXAMPLE,
  {
    id: "new-york",
    name: "New York",
    url: "https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Buildings_NewYork_17/SceneServer/layers/0",
    type: TilesetType.I3S,
  },
  {
    id: "turanga-library",
    name: "Turanga Library",
    url: "https://tiles.arcgis.com/tiles/cFEFS0EWrhfDeVw9/arcgis/rest/services/Turanga_Library/SceneServer/layers/0",
    type: TilesetType.I3S,
  },
];
