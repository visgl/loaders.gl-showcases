import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DebugOptions,
  TileColoredBy,
  BoundingVolumeColoredBy,
  BoundingVolumeType,
} from "../../types";
import { RootState } from "../store";

// Define a type for the slice state
interface debugOptionsState {
  value: DebugOptions;
}
const initialState: debugOptionsState = {
  value: {
    // Show minimap
    minimap: false,
    // Use separate traversal for the minimap viewport
    minimapViewport: false,
    // Show bounding volumes
    boundingVolume: false,
    // Select tiles with a mouse button
    pickable: false,
    // Load tiles after traversal.
    // Use this to freeze loaded tiles and see on them from different perspective
    loadTiles: true,
    // Use "uv-debug-texture" texture to check UV coordinates
    showUVDebugTexture: false,
    // Enable/Disable wireframe mode
    wireframe: false,
    // Tile coloring mode selector
    tileColorMode: TileColoredBy.original,
    // Bounding volume coloring mode selector
    boundingVolumeColorMode: BoundingVolumeColoredBy.original,
    // Bounding volume geometry shape selector
    boundingVolumeType: BoundingVolumeType.mbs,
  },
};
const debugOptionsSlice = createSlice({
  name: "debugOptions",
  initialState,
  reducers: {
    setInitialDebugOptions: (state: debugOptionsState) => {
      state.value = initialState.value;
    },
    setDebugOptions: (
      state: debugOptionsState,
      action: PayloadAction<{
        [x: string]:
          | boolean
          | TileColoredBy
          | BoundingVolumeColoredBy
          | BoundingVolumeType;
      }>
    ) => {
      state.value = { ...state.value, ...action.payload };
    },
  },
});

export const selectDebugOptions = (state: RootState): DebugOptions =>
  state.debugOptions.value;
export const selectMiniMap = (state: RootState): boolean =>
  state.debugOptions.value.minimap;
export const selectMiniMapViewPort = (state: RootState): boolean =>
  state.debugOptions.value.minimapViewport;
export const selectBoundingVolume = (state: RootState): boolean =>
  state.debugOptions.value.boundingVolume;
export const selectPickable = (state: RootState): boolean =>
  state.debugOptions.value.pickable;
export const selectLoadTiles = (state: RootState): boolean =>
  state.debugOptions.value.loadTiles;
export const selectShowUVDebugTexture = (state: RootState): boolean =>
  state.debugOptions.value.showUVDebugTexture;
export const selectWireframe = (state: RootState): boolean =>
  state.debugOptions.value.wireframe;
export const selectTileColorMode = (state: RootState): TileColoredBy =>
  state.debugOptions.value.tileColorMode;
export const selectBoundingVolumeColorMode = (
  state: RootState
): BoundingVolumeColoredBy => state.debugOptions.value.boundingVolumeColorMode;
export const selectBoundingVolumeType = (
  state: RootState
): BoundingVolumeType => state.debugOptions.value.boundingVolumeType;

// todo: and other if needed
export const { setInitialDebugOptions } = debugOptionsSlice.actions;
export const { setDebugOptions } = debugOptionsSlice.actions;
export default debugOptionsSlice.reducer;
