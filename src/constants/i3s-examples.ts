const VIEW_STATE = {
  height: 600,
  width: 800,
  pitch: 45,
  maxPitch: 60,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  zoom: 14.5,
};

export const TRANSITION_DURATION = 4000;

export const INITIAL_EXAMPLE_NAME = "san-francisco-v1.7";
export const CUSTOM_EXAMPLE_VALUE = "custom-example";


export const EXAMPLES = {
  "san-francisco-v1.6": {
    id: "san-francisco-v1.6",
    name: "San Francisco v1.6",
    url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0",
    viewport: {
      ...VIEW_STATE,
      longitude: -120,
      latitude: 34,
    },
  },
  "san-francisco-v1.7": {
    id: "san-francisco-v1.7",
    name: "San Francisco v1.7",
    url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
    viewport: {
      ...VIEW_STATE,
      longitude: -120,
      latitude: 34,
    },
  },
  "new-york": {
    id: "new-york",
    name: "New York",
    url: "https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Buildings_NewYork_17/SceneServer/layers/0",
    viewport: {
      ...VIEW_STATE,
      longitude: -74,
      latitude: 40,
    },
  },
  building: {
    id: "building",
    name: "Building",
    url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/Admin_Building_v17/SceneServer/layers/0",
    viewport: {
      ...VIEW_STATE,
    },
  },
};
