import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchFile } from "@loaders.gl/core";

// Define a type for the slice state
interface BSLStatisitcsSummaryState {
  /** BSL statistics summary */
  fields: Record<string, FieldStatisticsSummary>;
}

export type FieldStatisticsSummary = {
  mostFrequentValues: number[] | string[];
};

const initialState: BSLStatisitcsSummaryState = {
  fields: {},
};

const bslStatisitcsSummarySlice = createSlice({
  name: "bslStatisitcsSummary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBSLStatisticsSummary.fulfilled, (state, action) => {
        state.fields = {};
        if (action?.payload?.summary.length > 0) {
          for (const item of action.payload.summary) {
            const field = {
              mostFrequentValues: item.mostFrequentValues,
            };
            state.fields[item.fieldName] = field;
          }
        }
      })
      .addCase(getBSLStatisticsSummary.rejected, (state) => {
        state.fields = {};
      });
  },
});

export const getBSLStatisticsSummary = createAsyncThunk<
  {
    summary: Array<any>;
  },
  string
>("getBSLStatisticsSummary", async (statSummaryUrl) => {
  let dataResponse = await fetchFile(statSummaryUrl);
  let data = JSON.parse(await dataResponse.text());
  if (data && data.statisticsHRef) {
    dataResponse = await fetchFile(statSummaryUrl + "/" + data.statisticsHRef);
    data = JSON.parse(await dataResponse.text());
  }
  return data;
});
export const selectFieldValues = (
  state: RootState,
  fieldName: string
): FieldStatisticsSummary | undefined => {
  return state.bslStatisitcsSummary.fields[fieldName];
};

export default bslStatisitcsSummarySlice.reducer;
