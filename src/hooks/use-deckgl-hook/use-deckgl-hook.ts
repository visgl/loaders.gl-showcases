import { MapView } from "@deck.gl/core";
import { useEffect, useMemo, useState, useRef } from "react";
import ColorMap from "../../utils/debug/colors-map";
import {
  selectDebugTextureForTileset,
  selectOriginalTextureForTileset,
} from "../../utils/debug/texture-selector-utils";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectColorsByAttribute } from "../../redux/slices/symbolization-slice";
import { selectDragMode } from "../../redux/slices/drag-mode-slice";
import {
  fetchUVDebugTexture,
  selectUVDebugTexture,
} from "../../redux/slices/uv-debug-texture-slice";
import {
  selectMiniMap,
  selectMiniMapViewPort,
  selectBoundingVolume,
  selectLoadTiles,
  selectShowUVDebugTexture,
  selectWireframe,
  selectTileColorMode,
  selectBoundingVolumeColorMode,
  selectBoundingVolumeType,
} from "../../redux/slices/debug-options-slice";
import {
  selectBaseMaps,
  selectSelectedBaseMapId,
} from "../../redux/slices/base-maps-slice";
import { selectViewState } from "../../redux/slices/view-state-slice";
import type { Tileset3D } from "@loaders.gl/tiles";
import { MinimapPosition } from "../../types";

const colorMap = new ColorMap();

export function useDeckGl(
  lastLayerSelectedId: string,
  loadDebugTextureImage: boolean,
  loadedTilesets: Tileset3D[],
  disableController: boolean,
  minimapPosition?: MinimapPosition
): any {
  const dragMode = useAppSelector(selectDragMode);
  const showMinimap = useAppSelector(selectMiniMap);
  const loadTiles = useAppSelector(selectLoadTiles);
  const showDebugTexture = useAppSelector(selectShowUVDebugTexture);
  const createIndependentMinimapViewport = useAppSelector(
    selectMiniMapViewPort
  );
  const tileColorMode = useAppSelector(selectTileColorMode);
  const boundingVolumeColorMode = useAppSelector(selectBoundingVolumeColorMode);
  const wireframe = useAppSelector(selectWireframe);
  const baseMaps = useAppSelector(selectBaseMaps);
  const selectedBaseMapId = useAppSelector(selectSelectedBaseMapId);
  const selectedBaseMap = baseMaps.find((map) => map.id === selectedBaseMapId);
  const showTerrain = selectedBaseMap?.id === "Terrain";
  const mapStyle = selectedBaseMap?.mapUrl;
  const boundingVolume = useAppSelector(selectBoundingVolume);
  const boundingVolumeType = useAppSelector(selectBoundingVolumeType);
  const colorsByAttribute = useAppSelector(selectColorsByAttribute);
  const globalViewState = useAppSelector(selectViewState);
  const uvDebugTexture = useAppSelector(selectUVDebugTexture);

  const VIEWS = useMemo(
    () => [
      new MapView({
        id: "main",
        controller: disableController ? false : { inertia: true },
        farZMultiplier: 2.02,
      }),
      new MapView({
        id: "minimap",

        // Position on top of main map
        x: minimapPosition?.x,
        y: minimapPosition?.y,
        width: "20%",
        height: "20%",

        // Minimap is overlaid on top of an existing view, so need to clear the background
        clear: true,

        controller: disableController
          ? false
          : {
              maxZoom: 9,
              minZoom: 9,
              dragRotate: false,
              keyboard: false,
            },
      }),
    ],
    [disableController, dragMode]
  );
  const [terrainTiles, setTerrainTiles] = useState({});
  const uvDebugTextureRef = useRef<ImageBitmap | null>(null);
  uvDebugTextureRef.current = uvDebugTexture;
  const [needTransitionToTileset, setNeedTransitionToTileset] = useState(false);

  const showDebugTextureRef = useRef<boolean>(false);
  showDebugTextureRef.current = showDebugTexture;

  const dispatch = useAppDispatch();

  /** Load debug texture if necessary */
  useEffect(() => {
    if (loadDebugTextureImage && !uvDebugTexture) {
      dispatch(fetchUVDebugTexture());
    }
  }, [loadDebugTextureImage]);

  /**
   * Hook to call multiple changing function based on selected tileset.
   */
  useEffect(() => {
    setNeedTransitionToTileset(true);
    colorMap._resetColorsMap();
  }, [lastLayerSelectedId]);

  /** Independent minimap viewport toggle */
  useEffect(() => {
    const viewportTraversersMap = {
      main: "main",
      minimap: createIndependentMinimapViewport ? "minimap" : "main",
    };
    loadedTilesets.forEach((tileset) => {
      tileset.setProps({
        viewportTraversersMap,
        loadTiles,
      });
      tileset.selectTiles();
    });
  }, [createIndependentMinimapViewport]);

  /** Load tiles toggle */
  useEffect(() => {
    loadedTilesets.forEach((tileset) => {
      tileset.setProps({
        loadTiles,
      });
      tileset.selectTiles();
    });
  }, [loadTiles]);

  useEffect(() => {
    loadedTilesets.forEach((tileset) => {
      if (showDebugTexture) {
        selectDebugTextureForTileset(tileset, uvDebugTexture);
      } else {
        selectOriginalTextureForTileset();
      }
    });
  }, [showDebugTexture]);

  const viewState = useMemo(() => {
    return (
      (showMinimap && {
        main: { ...globalViewState.main },
        minimap: { ...globalViewState.minimap },
      }) || {
        main: { ...globalViewState.main },
      }
    );
  }, [showMinimap, globalViewState]);

  return {
    dragMode,
    showMinimap,
    loadTiles,
    createIndependentMinimapViewport,
    tileColorMode,
    boundingVolumeColorMode,
    wireframe,
    showTerrain,
    mapStyle,
    boundingVolume,
    boundingVolumeType,
    colorsByAttribute,
    globalViewState,
    terrainTiles,
    needTransitionToTileset,
    VIEWS,
    viewState,
    showDebugTextureRef,
    uvDebugTextureRef,
    setNeedTransitionToTileset,
    setTerrainTiles,
  };
}
export default useDeckGl;
