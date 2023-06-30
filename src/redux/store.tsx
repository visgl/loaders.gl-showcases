import {
  PreloadedState,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import colorsByAttributeReducer from "./colors-by-attribute-slice";
import flattenedSublayersSliceReducer from "./flattened-sublayers-slice";
import dragModeSliceReducer from "./drag-mode-slice";

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  colorsByAttribute: colorsByAttributeReducer,
  flattenedSublayers: flattenedSublayersSliceReducer,
  dragMode: dragModeSliceReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
