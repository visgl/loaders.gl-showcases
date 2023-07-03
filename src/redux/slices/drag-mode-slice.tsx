import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DragMode } from "../../types";
import { RootState } from "../store";

/** DragMode redux state for the decl.gl controller */
interface DragModeState {
  /** controller drag mode value https://deck.gl/docs/api-reference/core/controller#options */
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
