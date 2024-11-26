import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type DebugOptions,
  TileColoredBy,
  BoundingVolumeColoredBy,
  BoundingVolumeType,
} from "../../types";
import { type RootState } from "../store";

// Define a type for the slice state
export interface DebugOptionsState {
  /** Show minimap */
  minimap: boolean;
  /** Use separate traversal for the minimap viewport */
  minimapViewport: boolean;
  /** Show bounding volumes */
  boundingVolume: boolean;
  /** Tile coloring mode selector */
  tileColorMode: TileColoredBy;
  /** Bounding volume coloring mode selector */
  boundingVolumeColorMode: BoundingVolumeColoredBy;
  /** Bounding volume geometry shape selector */
  boundingVolumeType: BoundingVolumeType;
  /** Select tiles with a mouse button */
  pickable: boolean;
  /** Load tiles after traversal */
  /** Use this to freeze loaded tiles and see on them from different perspective */
  loadTiles: boolean;
  /** Use "uv-debug-texture" texture to check UV coordinates */
  showUVDebugTexture: boolean;
  /**  Enable/Disable wireframe mode */
  wireframe: boolean;
}
const initialState: DebugOptionsState = {
  minimap: false,
  minimapViewport: false,
  boundingVolume: false,
  pickable: false,
  loadTiles: true,
  showUVDebugTexture: false,
  wireframe: false,
  tileColorMode: TileColoredBy.original,
  boundingVolumeColorMode: BoundingVolumeColoredBy.original,
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
      state: DebugOptionsState,
      action: PayloadAction<Partial<DebugOptionsState>>
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
