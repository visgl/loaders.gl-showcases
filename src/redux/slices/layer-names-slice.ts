import { fetchFile } from "@loaders.gl/core";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { FetchingStatus, TilesetType } from "../../types";
import { parseTilesetUrlParams } from "../../utils/url-utils";

// Define a type for the slice state
interface LayerNamesState {
  /** Layers names map */
  map: Record<string, LayerNameInfo>;
}

type LayerNameInfo = {
  /** Layer name and fetching status */
  status: FetchingStatus;
  name: string;
};

const initialState: LayerNamesState = {
  map: {},
};

const layerNamesSlice = createSlice({
  name: "layerNames",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLayerNameInfo.pending, (state, action) => {
        state.map[action.meta.arg.layerUrl] = {
          name: "",
          status: FetchingStatus.pending,
        };
      })
      .addCase(getLayerNameInfo.fulfilled, (state, action) => {
        state.map[action.payload.layerUrl] = {
          name: action.payload.name,
          status: FetchingStatus.ready,
        };
      })
      .addCase(getLayerNameInfo.rejected, (state, action) => {
        state.map[action.meta.arg.layerUrl] = {
          name: "",
          status: FetchingStatus.ready,
        };
      });
  },
});

export const getLayerNameInfo = createAsyncThunk<
  { name: string; layerUrl: string },
  { layerUrl: string; type: TilesetType; token: string }
>("getLayerNameInfo", async ({ layerUrl, type, token }) => {
  const params = parseTilesetUrlParams(layerUrl, { type, token });
  let url = params.tilesetUrl;
  if (params.token) {
    const urlObject = new URL(url);
    urlObject.searchParams.append("token", params.token);
    url = urlObject.href;
  }
  const dataResponse = await fetchFile(url);
  const data = JSON.parse(await dataResponse.text());
  const name = data?.name || "";
  return { name, layerUrl };
});

export const selectLayerNames = (
  state: RootState
): Record<string, LayerNameInfo> => state.layerNames.map;

export default layerNamesSlice.reducer;
