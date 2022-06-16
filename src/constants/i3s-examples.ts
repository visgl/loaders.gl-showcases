import { LayerExample } from "../utils/types";

export const TRANSITION_DURATION = 4000;
export const CUSTOM_EXAMPLE_VALUE = "custom-example";

export const INITIAL_EXAMPLE: LayerExample = {
  id: "san-francisco-v1.7",
  name: "San Francisco v1.7",
  url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
};

export const EXAMPLES: LayerExample[] = [
  {
    id: "san-francisco-v1.6",
    name: "San Francisco v1.6",
    url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0",
  },
  INITIAL_EXAMPLE,
  {
    id: "new-york",
    name: "New York",
    url: "https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Buildings_NewYork_17/SceneServer/layers/0",
  },
  {
    id: "building",
    name: "Building",
    url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/Admin_Building_v17/SceneServer/layers/0",
  },
];
