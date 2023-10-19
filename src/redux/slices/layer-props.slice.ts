import {
  AnyAction,
  PayloadAction,
  ThunkDispatch,
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import { LayerPropsEdited } from "../../types";
// import { LayerPropsEdited, PopoverId, UseCaseId } from "../../types";
// import { DimensionMode, SizeMode } from "@belom88/vehicle-layer";
// import { setAnimation } from "./utils/layer-props-slice-utils";
import { getNotification } from "./utils/state-notificatons-utils";
import {
  getNewNotificationId,
  notificationsActions,
} from "./notifications.slice";

export const LAYER_PROPS_FEATURE_KEY = "layerProps";

export type LayerPropsState = LayerPropsEdited;

export const initialLayerPropsState: LayerPropsState = {
  //    useCase: UseCaseId.SF_TRANSIT,
  //    vehiclesCountValue: 2000,
  //    vehiclesCountMinMax: [10, 10000],
  //    animated: true,
  //    pickable: false,
  terrain: false,
  //    sizeMode: SizeMode.Original,
  //    size: 20,
  //    scale: 1,
  //    dimensionMode: '3D',
};

const setNotifications = (
  terrain: boolean,
  getState: () => RootState,
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  const state: RootState = getState() as RootState;
  const notification = getNotification({
    ...state,
    [LAYER_PROPS_FEATURE_KEY]: { ...state[LAYER_PROPS_FEATURE_KEY], terrain },
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

export const toggleTerrain = createAsyncThunk<void>(
  `${LAYER_PROPS_FEATURE_KEY}/toggleTerrain`,
  async (_, { getState, dispatch }): Promise<void> => {
    const state = getState() as RootState;
    setNotifications(
      !state[LAYER_PROPS_FEATURE_KEY].terrain,
      getState as () => RootState,
      dispatch
    );
  }
);

export const setTerrain = createAsyncThunk(
  `${LAYER_PROPS_FEATURE_KEY}/setTerrain`,
  async (terrain: boolean, { getState, dispatch }): Promise<boolean> => {
    setNotifications(terrain, getState as () => RootState, dispatch);
    return terrain;
  }
);

export const layerPropsSlice = createSlice({
  name: LAYER_PROPS_FEATURE_KEY,
  initialState: initialLayerPropsState,
  reducers: {
    /*       setUseCase: (state: LayerPropsState, action: PayloadAction<UseCaseId>) => {
        state.useCase = action.payload;
        setAnimation(state, state.useCase !== UseCaseId.ANFIELD);
      },
      setVehiclesCount: (
        state: LayerPropsState,
        action: PayloadAction<number>
      ) => {
        state.vehiclesCountValue = action.payload;
      },
      toggleAnimation: (state: LayerPropsState) => {
        setAnimation(state, !state.animated);
      },
      setAnimation: (state: LayerPropsState, action: PayloadAction<boolean>) => {
        setAnimation(state, action.payload);
      },
      togglePicking: (state: LayerPropsState) => {
        state.pickable = !state.pickable;
      },
      setPicking: (state: LayerPropsState, action: PayloadAction<boolean>) => {
        state.pickable = action.payload;
      },
      setSizeMode: (state: LayerPropsState, action: PayloadAction<SizeMode>) => {
        state.sizeMode = action.payload;
      },
      setSize: (state: LayerPropsState, action: PayloadAction<number>) => {
        state.size = action.payload;
      },
      setScale: (state: LayerPropsState, action: PayloadAction<number>) => {
        state.scale = action.payload;
      },
      toggleDimensionMode: (state: LayerPropsState) => {
        state.dimensionMode = state.dimensionMode === '2D' ? '3D' : '2D';
      },
      setDimensionMode: (
        state: LayerPropsState,
        action: PayloadAction<DimensionMode>
      ) => {
        state.dimensionMode = action.payload;
      },
      setVehicleColor: (
        state: LayerPropsState,
        action: PayloadAction<{
          popoverId: PopoverId;
          color?: [number, number, number];
        }>
      ) => {
        switch (action.payload.popoverId) {
          case PopoverId.VEHICLE_LAYER_3D_COLOR:
            state.color3D = action.payload.color;
            break;
          case PopoverId.VEHICLE_LAYER_2D_FOREGROUND:
            state.foregroundColor2d = action.payload.color;
            break;
          case PopoverId.VEHICLE_LAYER_2D_BACKGROUND:
            state.backgroundColor2d = action.payload.color;
            break;
          case PopoverId.VEHICLE_LAYER_COMMON_COLOR:
          default:
            state.commonColor = action.payload.color;
        }
      },
 */
  },
  extraReducers: (builder) => {
    builder.addCase(toggleTerrain.fulfilled, (state: LayerPropsState) => {
      state.terrain = !state.terrain;
    });
    builder.addCase(
      setTerrain.fulfilled,
      (state: LayerPropsState, action: PayloadAction<boolean>) => {
        state.terrain = action.payload;
      }
    );
  },
});

/*
 * Export reducer for store configuration.
 */
export const layerPropsReducer = layerPropsSlice.reducer;

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
 *   dispatch(layerPropsActions.setVehiclesCount(1000))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
/* export const layerPropsActions = layerPropsSlice.actions;

export const selectUseCase = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].useCase,
  (result) => result
);
export const selectVehiclesCountValue = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].vehiclesCountValue,
  (result) => result
);
export const selectVehiclesCountMinMax = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].vehiclesCountMinMax,
  (result) => result
);
export const selectAnimationState = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].animated,
  (result) => result
);
export const selectPickableState = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].pickable,
  (result) => result
); */
export const selectTerrainState = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].terrain,
  (result) => result
);
/*export const selectSizeMode = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].sizeMode,
  (result) => result
);
export const selectSize = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].size,
  (result) => result
);
export const selectScale = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].scale,
  (result) => result
);
export const selectDimensionMode = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].dimensionMode,
  (result) => result
);

export const selectVehicleColor = createSelector<
  [
    (state: RootState) => LayerPropsState,
    (state: RootState, popoverId: PopoverId) => PopoverId
  ],
  [number, number, number] | undefined
>(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY],
  (state: RootState, popoverId: PopoverId) => popoverId,
  (layerPropsState, popoverId): [number, number, number] | undefined => {
    switch (popoverId) {
      case PopoverId.VEHICLE_LAYER_3D_COLOR:
        return layerPropsState.color3D;
      case PopoverId.VEHICLE_LAYER_2D_FOREGROUND:
        return layerPropsState.foregroundColor2d;
      case PopoverId.VEHICLE_LAYER_2D_BACKGROUND:
        return layerPropsState.backgroundColor2d;
      case PopoverId.VEHICLE_LAYER_COMMON_COLOR:
      default:
        return layerPropsState.commonColor;
    }
  }
);
export const selectAllColors = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY],
  (result) => [
    result.commonColor,
    result.foregroundColor2d,
    result.backgroundColor2d,
    result.color3D,
  ]
);
 */
