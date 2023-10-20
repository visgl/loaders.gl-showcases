import { StatsInfo } from "@loaders.gl/i3s";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

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
  const dataResponse = await fetch(statAttributeUrl);
  const data = JSON.parse(await dataResponse.text());
  stats = (data?.stats as StatsInfo) || null;
  return { stats, statAttributeUrl };
});
export const selectStatisitcsMap = (
  state: RootState
): Record<string, StatsInfo | null> => state.attributeStatsMap.statisitcsMap;

export default attributeStatsMapSlice.reducer;
