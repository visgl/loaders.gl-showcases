import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchFile } from "@loaders.gl/core";
import { ComparisonSideMode } from "../../types";

// Define a type for the slice states
type BSLStatisitcsSummary = {
  /** BSL statistics summary */
  fields: Record<string, FieldStatisticsSummary>;
};

// Define a type for the slice state
export interface BSLStatisitcsSummaryState {
  /** Single layer state for viewer component */
  single: BSLStatisitcsSummary;
  /** Left side layer state for comparison mode */
  left: BSLStatisitcsSummary;
  /** Right side layer state for comparison mode */
  right: BSLStatisitcsSummary;
}

export type FieldStatisticsSummary = {
  mostFrequentValues: number[] | string[];
};

const initialState: BSLStatisitcsSummaryState = {
  single: { fields: {} },
  left: { fields: {} },
  right: { fields: {} },
};

const bslStatisitcsSummarySlice = createSlice({
  name: "bslStatisitcsSummary",
  initialState,
  reducers: {
    clearBSLStatisitcsSummary: (state: BSLStatisitcsSummaryState) => {
      state["single"] = { fields: {} };
      state["left"] = { fields: {} };
      state["right"] = { fields: {} };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBSLStatisticsSummary.fulfilled, (state, action) => {
        const side = action.payload.side || "single";
        state[side] = { fields: {} };
        if (action?.payload?.summary?.length > 0) {
          for (const item of action.payload.summary) {
            const field = {
              mostFrequentValues: item.mostFrequentValues,
            };
            state[side].fields[item.fieldName] = field;
          }
        }
      })
      .addCase(getBSLStatisticsSummary.rejected, (state, action) => {
        const side = action.meta.arg.side || "single";
        state[side] = { fields: {} };
      });
  },
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

export const selectFieldValues = (
  state: RootState,
  fieldName: string,
  side?: ComparisonSideMode
): FieldStatisticsSummary | undefined => {
  const selectedSide = side || "single";
  return state.bslStatisitcsSummary[selectedSide].fields[fieldName];
};

export const { clearBSLStatisitcsSummary } = bslStatisitcsSummarySlice.actions;

export default bslStatisitcsSummarySlice.reducer;
