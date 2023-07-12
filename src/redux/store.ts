import {
  PreloadedState,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import colorsByAttributeSliceReducer from "./slices/colors-by-attribute-slice";
import flattenedSublayersSliceReducer from "./slices/flattened-sublayers-slice";
import dragModeSliceReducer from "./slices/drag-mode-slice";
import uvDebugTextureSliceReducer from "./slices/uv-debug-texture-slice";
import attributeStatsMapSliceReducer from "./slices/attribute-stats-map-slice";

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  colorsByAttribute: colorsByAttributeSliceReducer,
  flattenedSublayers: flattenedSublayersSliceReducer,
  dragMode: dragModeSliceReducer,
  uvDebugTexture: uvDebugTextureSliceReducer,
  attributeStatsMap: attributeStatsMapSliceReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: ["fetchUVDebugTexture/fulfilled"],
          // Ignore these paths in the state
          ignoredPaths: ["uvDebugTexture.value"],
        },
      }),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];