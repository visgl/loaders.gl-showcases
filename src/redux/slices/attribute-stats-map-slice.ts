import { StatsInfo } from "@loaders.gl/i3s";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { load } from "@loaders.gl/core";
import { JSONLoader } from "@loaders.gl/loader-utils";

// Define a type for the slice state
interface statisitcsMapState {
  /** Statistics map */
  statisitcsMap: Record<string, StatsInfo | null>;
}

const initialState: statisitcsMapState = {
  statisitcsMap: {},
};

const attributeStatsMapSlice = createSlice({
  name: "statisitcsMap",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAttributeStatsInfo.fulfilled, (state, action) => {
        state.statisitcsMap[action.payload.statAttributeUrl] =
          action.payload.stats;
      })
      .addCase(getAttributeStatsInfo.rejected, (state, action) => {
        state.statisitcsMap[action.meta.arg] = null;
      });
  },
});

export const getAttributeStatsInfo = createAsyncThunk<
  { stats: StatsInfo | null; statAttributeUrl: string },
  string
>("getAttributeStatsInfo", async (statAttributeUrl) => {
  let stats: StatsInfo | null = null;
  const data = await load(statAttributeUrl, JSONLoader);
  stats = (data?.stats as StatsInfo) || null;
  return { stats, statAttributeUrl };
});
export const selectStatisitcsMap = (
  state: RootState
): Record<string, StatsInfo | null> => state.attributeStatsMap.statisitcsMap;

export default attributeStatsMapSlice.reducer;
