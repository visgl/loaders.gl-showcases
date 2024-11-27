import { fetchFile } from "@loaders.gl/core";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { type RootState } from "../store";
import { FetchingStatus, type TilesetType } from "../../types";
import { parseTilesetUrlParams } from "../../utils/url-utils";
import { getLayerUrl } from "../../utils/layer-utils";

// Define a type for the slice state
interface LayerNamesState {
  /** Layers names map */
  map: Record<string, LayerNameInfo>;
}

interface LayerNameInfo {
  /** Layer name and fetching status */
  status: FetchingStatus;
  name: string;
}

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
        const layerName = getLayerUrl(action.meta.arg.layerUrl);
        state.map[layerName] = {
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
        const layerName = getLayerUrl(action.meta.arg.layerUrl);
        state.map[layerName] = {
          name: "",
          status: FetchingStatus.ready,
        };
      });
  },
});

export const getLayerNameInfo = createAsyncThunk<
{ name: string; layerUrl: string },
{ layerUrl: string | File; type: TilesetType; token: string }
>("getLayerNameInfo", async ({ layerUrl, type, token }) => {
  if (typeof layerUrl !== "string") {
    return { name: layerUrl.name, layerUrl: "layerUrl" };
  }
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
