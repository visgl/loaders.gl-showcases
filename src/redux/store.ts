import {
  PreloadedState,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import flattenedSublayersSliceReducer from "./slices/flattened-sublayers-slice";
import dragModeSliceReducer from "./slices/drag-mode-slice";
import pickPaneSliceReducer from "./slices/pick-pane-slice";
import debugOptionsSliceReducer from "./slices/debug-options-slice";
import i3sStatsSliceReducer from "./slices/i3s-stats-slice";
import baseMapsSliceReducer from "./slices/base-maps-slice";
import symbolizationSliceReducer from "./slices/symbolization-slice";
import arcGisAuthSliceReducer from "./slices/arcgis-auth-slice";
import arcGisContentSliceReducer from "./slices/arcgis-content-slice";
import layerNamesSliceReducer from "./slices/layer-names-slice";

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  flattenedSublayers: flattenedSublayersSliceReducer,
  dragMode: dragModeSliceReducer,
  pickPane: pickPaneSliceReducer,
  debugOptions: debugOptionsSliceReducer,
  baseMaps: baseMapsSliceReducer,
  symbolization: symbolizationSliceReducer,
  i3sStats: i3sStatsSliceReducer,
  arcGisAuth: arcGisAuthSliceReducer,
  arcGisContent: arcGisContentSliceReducer,
  layerNames: layerNamesSliceReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: ["addPickPane/fulfilled", "setPickPanePicked/fulfilled"],
          // Ignore these paths in the state
          ignoredPaths: ["pickPane.pickPanesSets"],
        },
      }),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
