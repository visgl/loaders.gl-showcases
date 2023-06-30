import { createSlice } from "@reduxjs/toolkit";
import { DragMode } from "../types";
import { RootState } from "./store";

const initialState = {
  value: DragMode.pan,
};

const dragModeSlice = createSlice({
  name: "dragMode",
  initialState,
  reducers: {
    setDragMode: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const selectDragMode = (state: RootState) => state.dragMode.value;
export const { setDragMode } = dragModeSlice.actions;
export default dragModeSlice.reducer;
