import {
  AnyAction,
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import { BaseMapMode, BaseMapProvider } from "../../types";
// import { BaseMapMode, BaseMapProvider, PopoverId } from "../../types";
import {
  BASE_MAP_PROVIDERS,
  BaseMapProviderId,
} from "../../constants/base-map-providers";
// import { Vehicle } from "../../utils/vehicles-utils";
import { getNotification } from "./utils/state-notificatons-utils";
import {
  getNewNotificationId,
  notificationsActions,
} from "./notifications.slice";
import { setTerrain } from "./layer-props.slice";

export const APP_FEATURE_KEY = "app";

export interface AppState {
  baseMapProvider: BaseMapProvider;
  baseMapMode: BaseMapMode;
  //  fps: number;
  //  openedPopoverId: null | PopoverId;
  //  pickingData: null | Vehicle;
  //  testCasesPanelVisibility: boolean;
  //  layerPropsPanelVisibility: boolean;
}

export const initialState: AppState = {
  baseMapProvider: BASE_MAP_PROVIDERS[0],
  baseMapMode: BaseMapMode.OVERLAID,
  //  fps: 60,
  //  openedPopoverId: null,
  //  pickingData: null,
  //  testCasesPanelVisibility: true,
  //  layerPropsPanelVisibility: true,
};

type ThunkArgs =
  | { type: "baseMapProvider"; value: BaseMapProvider }
  | { type: "baseMapMode"; value: BaseMapMode };
const setNotifications = (
  args: ThunkArgs,
  getState: () => RootState,
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  const { type, value } = args;
  const state: RootState = getState() as RootState;
  const notification = getNotification({
    ...state,
    [APP_FEATURE_KEY]: { ...state[APP_FEATURE_KEY], [type]: value },
  });

  if (notification) {
    dispatch(
      notificationsActions.add({
        id: getNewNotificationId(),
        ...notification,
      })
    );
  }
};

export const setMapProvider = createAsyncThunk(
  `${APP_FEATURE_KEY}/setMapProvider`,
  async (
    baseMapProvider: BaseMapProvider,
    { getState, dispatch }
  ): Promise<BaseMapProvider> => {
    setNotifications(
      { type: "baseMapProvider", value: baseMapProvider },
      getState as () => RootState,
      dispatch
    );
    if (
      baseMapProvider.id === BaseMapProviderId.arcgis ||
      baseMapProvider.id === BaseMapProviderId.googleMaps
    ) {
      dispatch(setTerrain(false));
    }
    return baseMapProvider;
  }
);

export const setBaseMapMode = createAsyncThunk(
  `${APP_FEATURE_KEY}/setBaseMapMode`,
  async (
    baseMapMode: BaseMapMode,
    { getState, dispatch }
  ): Promise<BaseMapMode> => {
    setNotifications(
      { type: "baseMapMode", value: baseMapMode },
      getState as () => RootState,
      dispatch
    );
    return baseMapMode;
  }
);

export const appSlice = createSlice({
  name: APP_FEATURE_KEY,
  initialState,
  reducers: {
    //    setFps: (state: AppState, action: PayloadAction<number>) => {
    //      state.fps = action.payload;
    //    },
    //    resetFps: (state: AppState) => {
    //      state.fps = 60;
    //    },
    //    setPickingData: (state: AppState, action: PayloadAction<Vehicle>) => {
    //      state.pickingData = action.payload;
    //    },
    //    resetPickingData: (state: AppState) => {
    //      state.pickingData = null;
    //    },
    //    setOpenedPopoverId: (state: AppState, action: PayloadAction<PopoverId>) => {
    //      state.openedPopoverId = action.payload;
    //    },
    //    closePopover: (state: AppState) => {
    //      state.openedPopoverId = null;
    //    },
    //    setTestCasesPanelVisibility: (
    //      state: AppState,
    //      action: PayloadAction<boolean>
    //    ) => {
    //      state.testCasesPanelVisibility = action.payload;
    //    },
    //    setLayerPropsPanelVisibility: (
    //      state: AppState,
    //      action: PayloadAction<boolean>
    //    ) => {
    //      state.layerPropsPanelVisibility = action.payload;
    //    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      setMapProvider.fulfilled,
      (state: AppState, action: PayloadAction<BaseMapProvider>) => {
        state.baseMapProvider = action.payload;
      }
    );
    builder.addCase(
      setBaseMapMode.fulfilled,
      (state: AppState, action: PayloadAction<BaseMapMode>) => {
        state.baseMapMode = action.payload;
      }
    );
  },
});

/*
 * Export reducer for store configuration.
 */
export const appReducer = appSlice.reducer;

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
 *   dispatch(appActions.setMapProviderId({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const appActions = appSlice.actions;

export const selectMapProvider = createSelector(
  (state: RootState) => state[APP_FEATURE_KEY].baseMapProvider,
  (result) => result
);

export const selectBaseMapMode = createSelector(
  (state: RootState) => state[APP_FEATURE_KEY].baseMapMode,
  (result) => result
);

// export const selectFps = createSelector(
//  (state: RootState) => state[APP_FEATURE_KEY].fps,
//  (result) => result
//);

// export const selectPikckingData = createSelector(
//  (state: RootState) => state[APP_FEATURE_KEY].pickingData,
//  (result) => result
//);

// export const selectOpenedMenuId = createSelector(
//  (state: RootState) => state[APP_FEATURE_KEY].openedPopoverId,
//  (result) => result
//);

//export const selectTestCasesPanelVisibility = createSelector(
//  (state: RootState) => state[APP_FEATURE_KEY].testCasesPanelVisibility,
//  (result) => result
//);

//export const selectLayerPropsPanelVisibility = createSelector(
//  (state: RootState) => state[APP_FEATURE_KEY].layerPropsPanelVisibility,
//  (result) => result
//);
