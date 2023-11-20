import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ComparisonSideMode, FiltersByAttribute } from "../../types";

// Define a type for the slice state
export interface FiltersByAttributeState {
  /** Single layer state for viewer component */
  single: FiltersByAttribute | null;
  /** Left side layer state for comparison mode */
  left: FiltersByAttribute | null;
  /** Right side layer state for comparison mode */
  right: FiltersByAttribute | null;
}

// Define the initial state using that type
const initialState: FiltersByAttributeState = {
  single: null,
  left: null,
  right: null,
};

const filtersByAttributeSlice = createSlice({
  name: "filtersByAttribute",
  initialState,
  reducers: {
    setFiltersByAttrubute: (
      state: FiltersByAttributeState,
      action: PayloadAction<{
        filter: FiltersByAttribute | null;
        side?: ComparisonSideMode;
      }>
    ) => {
      state[action.payload.side || "single"] = action.payload.filter;
    },
  },
});

export const selectFiltersByAttribute = (
  state: RootState,
  side?: ComparisonSideMode
): FiltersByAttribute | null => {
  const selectedSide = side || "single";
  return state.filtersByAttribute[selectedSide];
};

export const { setFiltersByAttrubute } = filtersByAttributeSlice.actions;

export default filtersByAttributeSlice.reducer;
