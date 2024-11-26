import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import {
  type BuildingSceneSublayerExtended,
  type Sublayer,
  type TilesetType,
  type TilesetMetadata,
  type ComparisonSideMode,
} from "../../types";
import { I3SBuildingSceneLayerLoader, parseSLPKArchive } from "@loaders.gl/i3s";
import { buildSublayersTree } from "../../utils/sublayers";
import { type LoaderOptions, load } from "@loaders.gl/core";
import { type RootState } from "../store";
import { type BuildingSceneLayerTileset } from "@loaders.gl/i3s/src/types";

import { ZipFileSystem } from "@loaders.gl/zip";
import { FileProvider, BlobFile } from "@loaders.gl/loader-utils";

// Define a type for the slice states
interface SublayersState {
  /** Array of layers for the currently selected scene */
  layers: BuildingSceneSublayerExtended[];
  /** Counter of the currently selected layer  */
  layerCounter: number;
  /** Array of BSL sublayer categories */
  sublayers: Sublayer[];
}

export interface FlattenedSublayersState {
  /** Single layer state for viewer and debug components */
  single: SublayersState;
  /** Left side layer state for comparison mode */
  left: SublayersState;
  /** Right side layer state for comparison mode */
  right: SublayersState;
}

const initialState: FlattenedSublayersState = {
  single: { layers: [], layerCounter: 0, sublayers: [] },
  left: { layers: [], layerCounter: 0, sublayers: [] },
  right: { layers: [], layerCounter: 0, sublayers: [] },
};

const flattenedSublayersSlice = createSlice({
  name: "flattenedSublayers",
  initialState,
  reducers: {
    setFlattenedSublayers: (
      state: FlattenedSublayersState,
      action: PayloadAction<{
        layers: BuildingSceneSublayerExtended[];
        side?: ComparisonSideMode;
      }>
    ) => {
      state[action.payload.side ?? "single"].layers = action.payload.layers;
      state[action.payload.side ?? "single"].layerCounter++;
    },
    updateLayerVisibility: (
      state: FlattenedSublayersState,
      action: PayloadAction<{
        index: number;
        visibility: boolean | undefined;
        side?: ComparisonSideMode;
      }>
    ) => {
      const side = action.payload.side ?? "single";
      const layers = state[side].layers;
      if (action.payload.index in layers) {
        layers[action.payload.index].visibility = action.payload.visibility;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getFlattenedSublayers.pending, (state, action) => {
        const side = action.meta.arg.side ?? "single";
        state[side].layerCounter++;
      })
      .addCase(
        getFlattenedSublayers.fulfilled,
        (
          state: FlattenedSublayersState,
          action: PayloadAction<{
            sublayers: SublayersState;
            side?: ComparisonSideMode;
          }>
        ) => {
          const side = action.payload.side ?? "single";
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
    const promises: Array<Promise<any>> = [];
    const state = getState() as RootState;
    const currentLayer =
      state.flattenedSublayers[side ?? "single"].layerCounter;

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
  layers:
  | BuildingSceneSublayerExtended[]
  | Array<{
    id: string;
    url: string | File;
    visibility: boolean;
    token?: string;
    type: TilesetType | undefined;
  }>;
  sublayers: Sublayer[];
}> => {
  const options: LoaderOptions = {};
  if (typeof tilesetData.url !== "string") {
    try {
      const fileProvider = await FileProvider.create(new BlobFile(tilesetData.url));
      const archive = await parseSLPKArchive(fileProvider, undefined, tilesetData.url.name);
      const fileSystem = new ZipFileSystem(archive);
      options.fetch = fileSystem.fetch.bind(fileSystem) as (filename: string) => Promise<Response>;
    } catch (e) {
      console.log("error", e);
    }
  }
  try {
    const tileset = (await load(
      typeof tilesetData.url === "string" ? tilesetData.url : "",
      I3SBuildingSceneLayerLoader,
      options
    )) as BuildingSceneLayerTileset;
    const sublayersTree = buildSublayersTree(tileset.header.sublayers);
    const childSublayers = sublayersTree?.sublayers ?? [];
    const overviewLayer = {...tileset?.sublayers.find(
      (sublayer) => sublayer.name === "Overview"
    ) as BuildingSceneSublayerExtended}
    overviewLayer.fetch = options.fetch as ((input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>);
    const sublayers = tileset?.sublayers
      .filter((sublayer) => sublayer.name !== "Overview")
      .map((item) => ({
        ...item,
        fetch: options.fetch as ((input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>),
        token: tilesetData.token,
        type: tilesetData.type,
      }));

    return {
      layers: buildingExplorerOpened
        ? sublayers
        : overviewLayer
          ? [overviewLayer]
          : [],
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
