import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ViewState } from "@deck.gl/core";
import { RootState } from "../store";

/** ViewState redux state for maps wrappers and components */
export interface ViewStateState {
  /** main viewport */
  main?: ViewState;
  /** minimap viewport */
  minimap?: ViewState;
}

const INITIAL_VIEW_STATE = {
  longitude: -120,
  latitude: 34,
  pitch: 45,
  maxPitch: 90,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  zoom: 14.5,
  transitionDuration: 0,
  transitionInterpolator: null,
};

const initialState: ViewStateState = {
  main: INITIAL_VIEW_STATE,
  minimap: {
    latitude: INITIAL_VIEW_STATE.latitude,
    longitude: INITIAL_VIEW_STATE.longitude,
    zoom: 9,
    pitch: 0,
    bearing: 0,
  },
};

const viewStateSlice = createSlice({
  name: "viewState",
  initialState,
  reducers: {
    setViewState: (
      state: ViewStateState,
      action: PayloadAction<ViewStateState>
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const selectViewState = (state: RootState): ViewStateState =>
  state.viewState;

export const { setViewState } = viewStateSlice.actions;

export default viewStateSlice.reducer;
