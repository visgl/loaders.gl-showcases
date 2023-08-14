import {
  TileColoredBy,
  BoundingVolumeColoredBy,
  BoundingVolumeType,
} from "../../types";
import { setupStore } from "../store";
import reducer, {
  DebugOptionsState,
  selectDebugOptions,
  selectMiniMap,
  selectMiniMapViewPort,
  selectBoundingVolume,
  selectPickable,
  selectLoadTiles,
  selectShowUVDebugTexture,
  selectWireframe,
  selectTileColorMode,
  selectBoundingVolumeColorMode,
  selectBoundingVolumeType,
  resetDebugOptions,
  setDebugOptions,
} from "./debug-options-slice";

describe("slice: debug-options", () => {
  it("Reducer should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual({
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
    });
  });

  it("Reducer resetDebugOptions should set initial state", () => {
    const previousState: DebugOptionsState = {
      minimap: true,
      minimapViewport: true,
      boundingVolume: true,
      pickable: true,
      loadTiles: false,
      showUVDebugTexture: false,
      wireframe: true,
      tileColorMode: TileColoredBy.random,
      boundingVolumeColorMode: BoundingVolumeColoredBy.tile,
      boundingVolumeType: BoundingVolumeType.obb,
    };

    expect(reducer(previousState, resetDebugOptions())).toEqual({
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
    });
  });

  it("Selectors should return the initial state", () => {
    const store = setupStore();
    const state = store.getState();
    expect(selectMiniMap(state)).toEqual(false);
    expect(selectMiniMapViewPort(state)).toEqual(false);
    expect(selectBoundingVolume(state)).toEqual(false);
    expect(selectPickable(state)).toEqual(false);
    expect(selectLoadTiles(state)).toEqual(true);
    expect(selectShowUVDebugTexture(state)).toEqual(false);
    expect(selectWireframe(state)).toEqual(false);
    expect(selectTileColorMode(state)).toEqual(TileColoredBy.original);
    expect(selectBoundingVolumeColorMode(state)).toEqual(
      BoundingVolumeColoredBy.original
    );
    expect(selectBoundingVolumeType(state)).toEqual(BoundingVolumeType.mbs);
  });

  it("Selectors should return the updated value", () => {
    const store = setupStore();
    store.dispatch(
      setDebugOptions({
        minimap: true,
        minimapViewport: true,
        boundingVolume: true,
        pickable: true,
        loadTiles: false,
        showUVDebugTexture: false,
        wireframe: true,
        tileColorMode: TileColoredBy.depth,
        boundingVolumeColorMode: BoundingVolumeColoredBy.tile,
        boundingVolumeType: BoundingVolumeType.obb,
      })
    );
    const state = store.getState();
    expect(selectMiniMap(state)).toEqual(true);
    expect(selectMiniMapViewPort(state)).toEqual(true);
    expect(selectBoundingVolume(state)).toEqual(true);
    expect(selectPickable(state)).toEqual(true);
    expect(selectLoadTiles(state)).toEqual(false);
    expect(selectShowUVDebugTexture(state)).toEqual(false);
    expect(selectWireframe(state)).toEqual(true);
    expect(selectTileColorMode(state)).toEqual(TileColoredBy.depth);
    expect(selectBoundingVolumeColorMode(state)).toEqual(
      BoundingVolumeColoredBy.tile
    );
    expect(selectBoundingVolumeType(state)).toEqual(BoundingVolumeType.obb);
    expect(selectDebugOptions(state)).toEqual({
      minimap: true,
      minimapViewport: true,
      boundingVolume: true,
      pickable: true,
      loadTiles: false,
      showUVDebugTexture: false,
      wireframe: true,
      tileColorMode: TileColoredBy.depth,
      boundingVolumeColorMode: BoundingVolumeColoredBy.tile,
      boundingVolumeType: BoundingVolumeType.obb,
    });
  });
});
