import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BuildingSceneSublayerExtended, tilesetsDataType } from "../types";
import { I3SBuildingSceneLayerLoader } from "@loaders.gl/i3s";
import { ActiveSublayer } from "../utils/active-sublayer";
import { buildSublayersTree } from "../utils/sublayers";
import { load } from "@loaders.gl/core";
import { RootState } from "./store";

// Define a type for the slice state
interface flattenedSublayersState {
  layers: BuildingSceneSublayerExtended[];
  layerCounter: number;
  sublayers: ActiveSublayer[];
}

const initialState: flattenedSublayersState = {
  layers: [],
  layerCounter: 0,
  sublayers: []
};

const flattenedSublayersSlice = createSlice({
    name: 'flattenedSublayers',
    initialState,
    reducers: {
      setFlattenedSublayers: (state, action) => {
        state.layers = action.payload;
      },
      updateLayerVisibility: (state, action) => {
        if (action.payload.index in state.layers) {
          state.layers[action.payload.index].visibility = action.payload.visibility;
        }
      },
      setBuildingSubLayers: (state, action) => {
        state.sublayers = action.payload;
      },
    },
    extraReducers(builder) {
        builder
          .addCase(getFlattenedSublayers.fulfilled, (state, action) => {
            if (action.payload.layerCounter > state.layerCounter) {
              return {layers: action.payload.layers, layerCounter: action.payload.layerCounter, sublayers: action.payload.sublayers};
            }
          })
      }
});

export const getFlattenedSublayers = createAsyncThunk('getFlattenedSublayers', async ({ tilesetsData, currentLayer, buildingExplorerOpened }: { tilesetsData: tilesetsDataType[], currentLayer: number, buildingExplorerOpened: boolean }) => {
    const promises: Promise<any>[] = [];

    for (const data of tilesetsData) {
        if (!data.hasChildren) {
            promises.push(getLayersAndSublayers(data, buildingExplorerOpened));
        }
    }

    const layers = await Promise.all(promises).then((results) => {
      return results;
    })

    return {layers: layers[0].layers.flat(), layerCounter: currentLayer, sublayers: layers[0].sublayers};
});

const getLayersAndSublayers = async (tilesetData: tilesetsDataType, buildingExplorerOpened: boolean) => {
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

    return {layers: buildingExplorerOpened ? sublayers : [overviewLayer], sublayers: childSublayers};
  } catch (e) {
    const result = {layers: [
      {
        id: tilesetData.id,
        url: tilesetData.url,
        visibility: true,
        token: tilesetData.token,
        type: tilesetData.type,
      },
    ], sublayers: []};
    return result;
  }
};

export const selectLayers = (state: RootState) => state.flattenedSublayers.layers;
export const selectSublayers = (state: RootState) => state.flattenedSublayers.sublayers;
export const selectLayerCounter = (state: RootState) => state.flattenedSublayers.layerCounter;

export const { setFlattenedSublayers, updateLayerVisibility, setBuildingSubLayers } = flattenedSublayersSlice.actions;

export default flattenedSublayersSlice.reducer;