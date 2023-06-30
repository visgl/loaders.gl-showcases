import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DragMode } from "../types";
import { RootState } from "./store";

interface DragModeState {
  value: DragMode;
}

const initialState: DragModeState = {
  value: DragMode.pan,
};

const dragModeSlice = createSlice({
  name: "dragMode",
  initialState,
  reducers: {
    setDragMode: (state: DragModeState, action: PayloadAction<DragMode>) => {
      state.value = action.payload;
    },
  },
});

export const selectDragMode = (state: RootState): DragMode =>
  state.dragMode.value;
export const { setDragMode } = dragModeSlice.actions;
export default dragModeSlice.reducer;
