import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { FiltersByAttribute } from "../../types";

// Define a type for the slice state
export interface FiltersByAttributeState {
  value: FiltersByAttribute | null;
}

// Define the initial state using that type
const initialState: FiltersByAttributeState = {
  value: null,
};

const filtersByAttributeSlice = createSlice({
  name: "filtersByAttribute",
  initialState,
  reducers: {
    setFiltersByAttrubute: (
      state: FiltersByAttributeState,
      action: PayloadAction<FiltersByAttribute | null>
    ) => {
      state.value = action.payload;
    },
  },
});

export const selectFiltersByAttribute = (
  state: RootState
): FiltersByAttribute | null => state.filtersByAttribute.value;

export const { setFiltersByAttrubute } = filtersByAttributeSlice.actions;

export default filtersByAttributeSlice.reducer;
