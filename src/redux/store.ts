import {
  PreloadedState,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import colorsByAttributeSliceReducer from "./slices/colors-by-attribute-slice";
import flattenedSublayersSliceReducer from "./slices/flattened-sublayers-slice";
import dragModeSliceReducer from "./slices/drag-mode-slice";
import uvDebugTextureSliceReducer from "./slices/uv-debug-texture-slice";
import debugOptionsSliceReducer from "./slices/debug-options-slice";
import attributeStatsMapSliceReducer from "./slices/attribute-stats-map-slice";
import baseMapsSliceReducer from "./slices/base-maps-slice";
import { APP_FEATURE_KEY, appReducer } from "./slices/app.slice";
import {
  LAYER_PROPS_FEATURE_KEY,
  layerPropsReducer,
} from "./slices/layer-props.slice";
import {
  NOTIFICATIONS_FEATURE_KEY,
  notificationsReducer,
} from "./slices/notifications.slice";
import { MAP_FEATURE_KEY, mapReducer } from "./slices/map.slice";

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  colorsByAttribute: colorsByAttributeSliceReducer,
  flattenedSublayers: flattenedSublayersSliceReducer,
  dragMode: dragModeSliceReducer,
  uvDebugTexture: uvDebugTextureSliceReducer,
  debugOptions: debugOptionsSliceReducer,
  attributeStatsMap: attributeStatsMapSliceReducer,
  baseMaps: baseMapsSliceReducer,
  [APP_FEATURE_KEY]: appReducer,
  [LAYER_PROPS_FEATURE_KEY]: layerPropsReducer,
  [MAP_FEATURE_KEY]: mapReducer,
  [NOTIFICATIONS_FEATURE_KEY]: notificationsReducer,
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
