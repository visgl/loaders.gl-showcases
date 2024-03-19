import { type Draft202012Schema } from "@hyperjump/json-schema";

export const bookmarksSchemaId = "i3s-explorer:bookmarks-schema";
export const bookmarksSchemaJson: Draft202012Schema = {
  $id: bookmarksSchemaId,
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "array",
  items: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
      imageUrl: {
        type: "string",
      },
      viewState: {
        type: "object",
        properties: {
          main: {
            $ref: "#/$defs/ViewState",
          },
          minimap: {
            $ref: "#/$defs/ViewState",
          },
        },
      },
      layersLeftSide: {
        $ref: "#/$defs/LayerExample",
      },
      layersRightSide: {
        $ref: "#/$defs/LayerExample",
      },
      activeLayersIdsLeftSide: {
        type: "array",
        items: {
          type: "string",
        },
      },
      activeLayersIdsRightSide: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: ["id", "imageUrl"],
  },
  minItems: 1,
  $defs: {
    LayerExample: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          url: {
            type: "string",
          },
          token: {
            type: "string",
          },
          custom: {
            type: "boolean",
          },
          viewState: {
            $ref: "#/$defs/LayerViewState",
          },
          layers: {
            $ref: "#/$defs/LayerExample",
          },
        },
        required: ["id", "name", "url"],
      },
      minItems: 0,
    },
    ViewState: {
      type: "object",
      properties: {
        latitude: {
          type: "number",
        },
        longitude: {
          type: "number",
        },
        zoom: {
          type: "number",
        },
        bearing: {
          type: "number",
        },
        pitch: {
          type: "number",
        },
        width: {
          type: "number",
        },
        height: {
          type: "number",
        },
        altitude: {
          type: "number",
        },
        maxZoom: {
          type: "number",
        },
        minZoom: {
          type: "number",
        },
        minPitch: {
          type: "number",
        },
        maxPitch: {
          type: "number",
        },
        normalize: {
          type: "boolean",
        },
        position: {
          type: "array",
          items: {
            type: "number",
          },
          maxItems: 3,
          minItems: 3,
        },
      },
      required: ["latitude", "longitude", "zoom", "bearing", "pitch"],
    },
    LayerViewState: {
      type: "object",
      properties: {
        latitude: {
          type: "number",
        },
        longitude: {
          type: "number",
        },
        zoom: {
          type: "number",
        },
      },
      required: ["latitude", "longitude", "zoom"],
    },
  },
};
