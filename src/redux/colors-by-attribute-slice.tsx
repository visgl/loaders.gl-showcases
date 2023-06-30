import { createSlice } from "@reduxjs/toolkit";
import { ColorsByAttribute } from "../types";
import { RootState } from "./store";

// Define a type for the slice state
interface ColorsByAttributeState {
  value: ColorsByAttribute | null;
}

// Define the initial state using that type
const initialState: ColorsByAttributeState = {
  value: null,
};

const colorsByAttributeSlice = createSlice({
  name: "colorsByAttribute",
  initialState,
  reducers: {
    setColorsByAttrubute: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const selectColorsByAttribute = (state: RootState) =>
  state.colorsByAttribute.value;

export const { setColorsByAttrubute } = colorsByAttributeSlice.actions;

export default colorsByAttributeSlice.reducer;
