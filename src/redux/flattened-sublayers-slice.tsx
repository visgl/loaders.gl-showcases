import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  BuildingSceneSublayerExtended,
  Sublayer,
  TilesetType,
  tilesetsData,
} from "../types";
import { I3SBuildingSceneLayerLoader } from "@loaders.gl/i3s";
import { buildSublayersTree } from "../utils/sublayers";
import { load } from "@loaders.gl/core";
import { RootState } from "./store";

// Define a type for the slice state
interface flattenedSublayersState {
  layers: BuildingSceneSublayerExtended[];
  layerCounter: number;
  sublayers: Sublayer[];
}

const initialState: flattenedSublayersState = {
  layers: [],
  layerCounter: 0,
  sublayers: [],
};

const flattenedSublayersSlice = createSlice({
  name: "flattenedSublayers",
  initialState,
  reducers: {
    setFlattenedSublayers: (
      state: flattenedSublayersState,
      action: PayloadAction<BuildingSceneSublayerExtended[]>
    ) => {
      state.layers = action.payload;
    },
    updateLayerVisibility: (
      state: flattenedSublayersState,
      action: PayloadAction<{ index: number; visibility: boolean | undefined }>
    ) => {
      if (action.payload.index in state.layers) {
        state.layers[action.payload.index].visibility =
          action.payload.visibility;
      }
    },
    setBuildingSubLayers: (
      state: flattenedSublayersState,
      action: PayloadAction<Sublayer[]>
    ) => {
      state.sublayers = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(
      getFlattenedSublayers.fulfilled,
      (
        state: flattenedSublayersState,
        action: PayloadAction<flattenedSublayersState>
      ) => {
        if (action.payload.layerCounter > state.layerCounter) {
          return { ...action.payload };
        }
      }
    );
  },
});

export const getFlattenedSublayers = createAsyncThunk<
  flattenedSublayersState,
  {
    tilesetsData: tilesetsData[];
    currentLayer: number;
    buildingExplorerOpened: boolean;
  }
>(
  "getFlattenedSublayers",
  async ({ tilesetsData, currentLayer, buildingExplorerOpened }) => {
    const promises: Promise<any>[] = [];

    for (const data of tilesetsData) {
      if (!data.hasChildren) {
        promises.push(getLayersAndSublayers(data, buildingExplorerOpened));
      }
    }

    const layers = await Promise.all(promises);

    return {
      layers: layers[0].layers.flat(),
      layerCounter: currentLayer,
      sublayers: layers[0].sublayers,
    };
  }
);

const getLayersAndSublayers = async (
  tilesetData: tilesetsData,
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
): BuildingSceneSublayerExtended[] => state.flattenedSublayers.layers;
export const selectSublayers = (state: RootState): Sublayer[] =>
  state.flattenedSublayers.sublayers;
export const selectLayerCounter = (state: RootState): number =>
  state.flattenedSublayers.layerCounter;

export const {
  setFlattenedSublayers,
  updateLayerVisibility,
  setBuildingSubLayers,
} = flattenedSublayersSlice.actions;

export default flattenedSublayersSlice.reducer;
