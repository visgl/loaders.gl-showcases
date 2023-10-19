import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { initialViewState } from "../../constants/view-states";

export const MAP_FEATURE_KEY = "map";

export interface MapState {
  latitude: number;
  longitude: number;
  zoom: number;
  maxZoom: number;
  bearing: number;
  pitch: number;
  position: number[];
}

export const initialMapState: MapState = initialViewState;

export const mapSlice = createSlice({
  name: MAP_FEATURE_KEY,
  initialState: initialMapState,
  reducers: {
    setMapState: (
      state: MapState,
      action: PayloadAction<Partial<MapState>>
    ) => {
      const newState = {
        ...state,
        ...action.payload,
      };
      return newState;
    },
  },
});

/*
 * Export reducer for store configuration.
 */
export const mapReducer = mapSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(mapActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const mapActions = mapSlice.actions;

export const selectMapState = createSelector(
  (state: RootState) => state[MAP_FEATURE_KEY],
  (result) => result
);
