import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  BuildingSceneSublayerExtended,
  Sublayer,
  TilesetType,
  TilesetMetadata,
  ComparisonSideMode,
} from "../../types";
import { I3SBuildingSceneLayerLoader } from "@loaders.gl/i3s";
import { buildSublayersTree } from "../../utils/sublayers";
import { load } from "@loaders.gl/core";
import { RootState } from "../store";

// Define a type for the slice states
type sublayersState = {
  /** Array of layers for the currently selected scene */
  layers: BuildingSceneSublayerExtended[];
  /** Counter of the currently selected layer  */
  layerCounter: number;
  /** Array of BSL sublayer categories */
  sublayers: Sublayer[];
};

interface flattenedSublayersState {
  /** Single layer state for viewer and debug components */
  single: sublayersState;
  /** Left side layer state for comparison mode */
  left: sublayersState;
  /** Right side layer state for comparison mode */
  right: sublayersState;
}

const initialState: flattenedSublayersState = {
  single: { layers: [], layerCounter: 0, sublayers: [] },
  left: { layers: [], layerCounter: 0, sublayers: [] },
  right: { layers: [], layerCounter: 0, sublayers: [] },
};

const flattenedSublayersSlice = createSlice({
  name: "flattenedSublayers",
  initialState,
  reducers: {
    setFlattenedSublayers: (
      state: flattenedSublayersState,
      action: PayloadAction<{
        layers: BuildingSceneSublayerExtended[];
        side?: ComparisonSideMode;
      }>
    ) => {
      switch (action.payload.side) {
        case ComparisonSideMode.left:
          state.left.layers = action.payload.layers;
          break;
        case ComparisonSideMode.right:
          state.right.layers = action.payload.layers;
          break;
        default:
          state.single.layers = action.payload.layers;
      }
    },
    updateLayerVisibility: (
      state: flattenedSublayersState,
      action: PayloadAction<{
        index: number;
        visibility: boolean | undefined;
        side?: ComparisonSideMode;
      }>
    ) => {
      let destLayer: BuildingSceneSublayerExtended | undefined = undefined;
      switch (action.payload.side) {
        case ComparisonSideMode.left:
          if (action.payload.index in state.left.layers) {
            destLayer = state.left.layers[action.payload.index];
          }
          break;
        case ComparisonSideMode.right:
          if (action.payload.index in state.right.layers) {
            destLayer = state.right.layers[action.payload.index];
          }
          break;
        default:
          destLayer = state.single.layers[action.payload.index];
      }
      if (destLayer) {
        destLayer.visibility = action.payload.visibility;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getFlattenedSublayers.pending, (state, action) => {
        if (action.meta.arg.side === ComparisonSideMode.left) {
          state.left.layerCounter += 1;
        } else if (action.meta.arg.side === ComparisonSideMode.right) {
          state.right.layerCounter += 1;
        } else {
          state.single.layerCounter += 1;
        }
      })
      .addCase(
        getFlattenedSublayers.fulfilled,
        (
          state: flattenedSublayersState,
          action: PayloadAction<{
            sublayers: sublayersState;
            side?: ComparisonSideMode;
          }>
        ) => {
          if (
            action.payload.side === ComparisonSideMode.left &&
            action.payload.sublayers.layerCounter === state.left.layerCounter
          ) {
            return { ...state, left: action.payload.sublayers };
          } else if (
            action.payload.side === ComparisonSideMode.right &&
            action.payload.sublayers.layerCounter === state.right.layerCounter
          ) {
            return { ...state, right: action.payload.sublayers };
          } else if (
            !action.payload.side &&
            action.payload.sublayers.layerCounter === state.single.layerCounter
          ) {
            return { ...state, single: action.payload.sublayers };
          }
        }
      );
  },
});

export const getFlattenedSublayers = createAsyncThunk<
  {
    sublayers: sublayersState;
    side?: ComparisonSideMode;
  },
  {
    tilesetsData: TilesetMetadata[];
    buildingExplorerOpened: boolean;
    side?: ComparisonSideMode;
  }
>(
  "getFlattenedSublayers",
  async ({ tilesetsData, buildingExplorerOpened, side }, { getState }) => {
    const promises: Promise<any>[] = [];
    const state = getState() as RootState;
    let currentLayer = 0;
    switch (side) {
      case ComparisonSideMode.left:
        currentLayer = state.flattenedSublayers.left.layerCounter;
        break;
      case ComparisonSideMode.right:
        currentLayer = state.flattenedSublayers.right.layerCounter;
        break;
      default:
        currentLayer = state.flattenedSublayers.single.layerCounter;
    }

    for (const data of tilesetsData) {
      if (!data.hasChildren) {
        promises.push(getLayersAndSublayers(data, buildingExplorerOpened));
      }
    }

    const layers = await Promise.all(promises);

    return {
      sublayers: {
        layers: layers[0].layers.flat(),
        layerCounter: currentLayer,
        sublayers: layers[0].sublayers,
      },
      side,
    };
  }
);

const getLayersAndSublayers = async (
  tilesetData: TilesetMetadata,
  buildingExplorerOpened: boolean
): Promise<{
  layers: {
    id: string;
    url: string;
    visibility: boolean;
    token: string;
    type: TilesetType | undefined;
  }[];
  sublayers: Sublayer[];
}> => {
  try {
    const tileset = await load(tilesetData.url, I3SBuildingSceneLayerLoader);
    const sublayersTree = buildSublayersTree(tileset.header.sublayers);
    const childSublayers = sublayersTree?.sublayers || [];
    const overviewLayer = tileset?.sublayers.find(
      (sublayer) => sublayer.name === "Overview"
    );
    const sublayers = tileset?.sublayers
      .filter((sublayer) => sublayer.name !== "Overview")
      .map((item) => ({
        ...item,
        token: tilesetData.token,
        type: tilesetData.type,
      }));

    return {
      layers: buildingExplorerOpened ? sublayers : [overviewLayer],
      sublayers: childSublayers,
    };
  } catch (e) {
    const result = {
      layers: [
        {
          id: tilesetData.id,
          url: tilesetData.url,
          visibility: true,
          token: tilesetData.token,
          type: tilesetData.type,
        },
      ],
      sublayers: [],
    };
    return result;
  }
};

export const selectLayers = (
  state: RootState
): BuildingSceneSublayerExtended[] => state.flattenedSublayers.single.layers;

export const selectLeftLayers = (
  state: RootState
): BuildingSceneSublayerExtended[] => state.flattenedSublayers.left.layers;

export const selectRightLayers = (
  state: RootState
): BuildingSceneSublayerExtended[] => state.flattenedSublayers.right.layers;

export const selectSublayers = (state: RootState): Sublayer[] =>
  state.flattenedSublayers.single.sublayers;

export const selectLeftSublayers = (state: RootState): Sublayer[] =>
  state.flattenedSublayers.left.sublayers;

export const selectRightSublayers = (state: RootState): Sublayer[] =>
  state.flattenedSublayers.right.sublayers;

export const { setFlattenedSublayers, updateLayerVisibility } =
  flattenedSublayersSlice.actions;

export default flattenedSublayersSlice.reducer;
