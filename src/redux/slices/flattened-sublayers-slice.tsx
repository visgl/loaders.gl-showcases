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
type SublayersState = {
  /** Array of layers for the currently selected scene */
  layers: BuildingSceneSublayerExtended[];
  /** Counter of the currently selected layer  */
  layerCounter: number;
  /** Array of BSL sublayer categories */
  sublayers: Sublayer[];
};

export interface flattenedSublayersState {
  /** Single layer state for viewer and debug components */
  single: SublayersState;
  /** Left side layer state for comparison mode */
  left: SublayersState;
  /** Right side layer state for comparison mode */
  right: SublayersState;
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
      state[action.payload.side || "single"].layers = action.payload.layers;
      state[action.payload.side || "single"].layerCounter++;
    },
    updateLayerVisibility: (
      state: flattenedSublayersState,
      action: PayloadAction<{
        index: number;
        visibility: boolean | undefined;
        side?: ComparisonSideMode;
      }>
    ) => {
      const side = action.payload.side || "single";
      const layers = state[side].layers;
      if (action.payload.index in layers) {
        layers[action.payload.index].visibility = action.payload.visibility;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getFlattenedSublayers.pending, (state, action) => {
        const side = action.meta.arg.side || "single";
        state[side].layerCounter++;
      })
      .addCase(
        getFlattenedSublayers.fulfilled,
        (
          state: flattenedSublayersState,
          action: PayloadAction<{
            sublayers: SublayersState;
            side?: ComparisonSideMode;
          }>
        ) => {
          const side = action.payload.side || "single";
          if (
            action.payload.sublayers.layerCounter === state[side].layerCounter
          ) {
            return { ...state, [side]: action.payload.sublayers };
          }
        }
      );
  },
});

export const getFlattenedSublayers = createAsyncThunk<
  {
    sublayers: SublayersState;
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
    const currentLayer =
      state.flattenedSublayers[side || "single"].layerCounter;

    for (const data of tilesetsData) {
      if (!data.hasChildren) {
        promises.push(getLayersAndSublayers(data, buildingExplorerOpened));
      }
    }

    const result = await Promise.all(promises);
    const layers: BuildingSceneSublayerExtended[] = [];
    let sublayers: Sublayer[] = [];
    for (const layer of result) {
      layers.push(layer.layers);
      sublayers = layer.sublayers;
    }

    return {
      sublayers: {
        layers: layers.flat(),
        layerCounter: currentLayer,
        sublayers,
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
    token: string | undefined;
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
