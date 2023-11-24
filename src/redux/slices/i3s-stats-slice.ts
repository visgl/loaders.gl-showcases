import { StatsInfo } from "@loaders.gl/i3s";
import { fetchFile } from "@loaders.gl/core";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ComparisonSideMode } from "../../types";

// Define a type for the slice state
interface I3SStatsState {
  /** Statistics map */
  statisitcsMap: Record<string, StatsInfo | null>;
  /** BSL statistics summary */
  bslStats: BSLStatisitcsSummaryState;
}

// Define a type for the slice state
type BSLStatisitcsSummaryState = {
  /** Single layer state for viewer component */
  single: BSLStatisitcsSummary;
  /** Left side layer state for comparison mode */
  left: BSLStatisitcsSummary;
  /** Right side layer state for comparison mode */
  right: BSLStatisitcsSummary;
};

type BSLStatisitcsSummary = {
  /** BSL statistics summary */
  fields: Record<string, FieldStatisticsSummary>;
};

type FieldStatisticsSummary = {
  mostFrequentValues: number[] | string[];
};

const initialState: I3SStatsState = {
  statisitcsMap: {},
  bslStats: {
    single: { fields: {} },
    left: { fields: {} },
    right: { fields: {} },
  },
};

const i3sStatsSlice = createSlice({
  name: "i3sStats",
  initialState,
  reducers: {
    clearBSLStatisitcsSummary: (state: I3SStatsState) => {
      state.bslStats["single"] = { fields: {} };
      state.bslStats["left"] = { fields: {} };
      state.bslStats["right"] = { fields: {} };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAttributeStatsInfo.fulfilled, (state, action) => {
        state.statisitcsMap[action.payload.statAttributeUrl] =
          action.payload.stats;
      })
      .addCase(getAttributeStatsInfo.rejected, (state, action) => {
        state.statisitcsMap[action.meta.arg] = null;
      })
      .addCase(getBSLStatisticsSummary.fulfilled, (state, action) => {
        const side = action.payload.side || "single";
        state.bslStats[side] = { fields: {} };
        if (action?.payload?.summary?.length > 0) {
          for (const item of action.payload.summary) {
            const field = {
              mostFrequentValues: item.mostFrequentValues,
            };
            state.bslStats[side].fields[item.fieldName] = field;
          }
        }
      })
      .addCase(getBSLStatisticsSummary.rejected, (state, action) => {
        const side = action.meta.arg.side || "single";
        state.bslStats[side] = { fields: {} };
      });
  },
});

export const getAttributeStatsInfo = createAsyncThunk<
  { stats: StatsInfo | null; statAttributeUrl: string },
  string
>("getAttributeStatsInfo", async (statAttributeUrl) => {
  let stats: StatsInfo | null = null;
  const dataResponse = await fetchFile(statAttributeUrl);
  const data = JSON.parse(await dataResponse.text());
  stats = (data?.stats as StatsInfo) || null;
  return { stats, statAttributeUrl };
});

export const getBSLStatisticsSummary = createAsyncThunk<
  {
    summary: Array<any>;
    side?: ComparisonSideMode;
  },
  {
    statSummaryUrl: string;
    side?: ComparisonSideMode;
  }
>("getBSLStatisticsSummary", async ({ statSummaryUrl, side }) => {
  let dataResponse = await fetchFile(statSummaryUrl);
  let data = JSON.parse(await dataResponse.text());
  if (data && data.statisticsHRef) {
    dataResponse = await fetchFile(statSummaryUrl + "/" + data.statisticsHRef);
    data = JSON.parse(await dataResponse.text());
  }
  return { summary: data?.summary, side };
});

export const selectStatisitcsMap = (
  state: RootState
): Record<string, StatsInfo | null> => state.i3sStats.statisitcsMap;

export const selectFieldValues = (
  state: RootState,
  fieldName: string,
  side?: ComparisonSideMode
): FieldStatisticsSummary | undefined => {
  const selectedSide = side || "single";
  return state.i3sStats.bslStats[selectedSide].fields[fieldName];
};

export const { clearBSLStatisitcsSummary } = i3sStatsSlice.actions;

export default i3sStatsSlice.reducer;
