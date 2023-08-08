import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DebugOptions,
  TileColoredBy,
  BoundingVolumeColoredBy,
  BoundingVolumeType,
} from "../../types";
import { RootState } from "../store";

// Define a type for the slice state
export interface debugOptionsState {
  minimap: boolean;
  minimapViewport: boolean;
  boundingVolume: boolean;
  tileColorMode: TileColoredBy;
  boundingVolumeColorMode: BoundingVolumeColoredBy;
  boundingVolumeType: BoundingVolumeType;
  pickable: boolean;
  loadTiles: boolean;
  showUVDebugTexture: boolean;
  wireframe: boolean;
}
const initialState: debugOptionsState = {
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
};
const debugOptionsSlice = createSlice({
  name: "debugOptions",
  initialState,
  reducers: {
    resetDebugOptions: () => {
      return initialState;
    },
    setDebugOptions: (
      state: debugOptionsState,
      action: PayloadAction<Partial<debugOptionsState>>
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const selectDebugOptions = (state: RootState): DebugOptions =>
  state.debugOptions;
export const selectMiniMap = (state: RootState): boolean =>
  state.debugOptions.minimap;
export const selectMiniMapViewPort = (state: RootState): boolean =>
  state.debugOptions.minimapViewport;
export const selectBoundingVolume = (state: RootState): boolean =>
  state.debugOptions.boundingVolume;
export const selectPickable = (state: RootState): boolean =>
  state.debugOptions.pickable;
export const selectLoadTiles = (state: RootState): boolean =>
  state.debugOptions.loadTiles;
export const selectShowUVDebugTexture = (state: RootState): boolean =>
  state.debugOptions.showUVDebugTexture;
export const selectWireframe = (state: RootState): boolean =>
  state.debugOptions.wireframe;
export const selectTileColorMode = (state: RootState): TileColoredBy =>
  state.debugOptions.tileColorMode;
export const selectBoundingVolumeColorMode = (
  state: RootState
): BoundingVolumeColoredBy => state.debugOptions.boundingVolumeColorMode;
export const selectBoundingVolumeType = (
  state: RootState
): BoundingVolumeType => state.debugOptions.boundingVolumeType;

export const { resetDebugOptions } = debugOptionsSlice.actions;
export const { setDebugOptions } = debugOptionsSlice.actions;
export default debugOptionsSlice.reducer;
