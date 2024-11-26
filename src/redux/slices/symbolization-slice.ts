import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  type ColorsByAttribute,
  type ComparisonSideMode,
  type FiltersByAttribute,
} from "../../types";
import { type RootState } from "../store";

// Define a type for the slice state
export interface SymbolizationState {
  /** Color properties responsible for colorizig by attributes */
  colorsByAttribute: ColorsByAttribute | null;
  /** Filter properties responsible for filtering by attributes */
  filtersByAttribute: FiltersByAttributeState;
}

interface FiltersByAttributeState {
  /** Single layer state for viewer component */
  single: FiltersByAttribute | null;
  /** Left side layer state for comparison mode */
  left: FiltersByAttribute | null;
  /** Right side layer state for comparison mode */
  right: FiltersByAttribute | null;
}

const initialState: SymbolizationState = {
  colorsByAttribute: null,
  filtersByAttribute: { single: null, left: null, right: null },
};

const symbolizationSlice = createSlice({
  name: "symbolization",
  initialState,
  reducers: {
    setFiltersByAttrubute: (
      state: SymbolizationState,
      action: PayloadAction<{
        filter: FiltersByAttribute | null;
        side?: ComparisonSideMode;
      }>
    ) => {
      state.filtersByAttribute[action.payload.side ?? "single"] =
        action.payload.filter;
    },
    setColorsByAttrubute: (
      state: SymbolizationState,
      action: PayloadAction<ColorsByAttribute | null>
    ) => {
      state.colorsByAttribute = action.payload;
    },
  },
});

export const selectColorsByAttribute = (
  state: RootState
): ColorsByAttribute | null => state.symbolization.colorsByAttribute;

export const selectFiltersByAttribute = (
  state: RootState,
  side?: ComparisonSideMode
): FiltersByAttribute | null => {
  const selectedSide = side ?? "single";
  return state.symbolization.filtersByAttribute[selectedSide];
};

export const { setColorsByAttrubute } = symbolizationSlice.actions;
export const { setFiltersByAttrubute } = symbolizationSlice.actions;

export default symbolizationSlice.reducer;
