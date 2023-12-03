import { useArcgis } from "../../hooks/use-arcgis-hook/use-arcgis-hook";
import { Tile3D, Tileset3D } from "@loaders.gl/tiles";
import { SceneLayer3D } from "@loaders.gl/i3s";
import {
  FlyToInterpolator,
  MapView,
  WebMercatorViewport,
  PickingInfo,
} from "@deck.gl/core";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  NormalsDebugData,
  ViewStateSet,
  TilesetType,
  MinimapPosition,
  FiltersByAttribute,
} from "../../types";
import ColorMap from "../../utils/debug/colors-map";
import {
  selectDebugTextureForTile,
  selectDebugTextureForTileset,
  selectOriginalTextureForTile,
  selectOriginalTextureForTileset,
} from "../../utils/debug/texture-selector-utils";
import { getElevationByCentralTile } from "../../utils/terrain-elevation";
import { getLonLatWithElevationOffset } from "../../utils/elevation-utils";

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
import styled from "styled-components";
import { renderLayers } from "../../utils/deckgl/render-layers";
import { layerFilterCreator } from "../../utils/deckgl/layers-filter";

export const StyledMapContainer = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

const TRANSITION_DURAITON = 4000;
const INITIAL_VIEW_STATE = {
  longitude: -120,
  latitude: 34,
  pitch: 45,
  maxPitch: 90,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  zoom: 14.5,
  transitionDuration: 0,
  transitionInterpolator: null,
};

const colorMap = new ColorMap();

type ArcGisMapProps = {
  /** DeckGL component id */
  id?: string;
  /**
   * View state controlled by parent component
   * if is not set `viewState` state variable will be used
   */
  parentViewState?: ViewStateSet;
  /** User selected tiles colors */
  coloredTilesMap?: { [key: string]: string };
  /** Allows layers picking to handle mouse events */
  pickable?: boolean;
  /** Layers loading data  */
  layers3d: {
    id?: number;
    url?: string;
    token?: string | null;
    type: TilesetType;
  }[];
  /** Last selected layer id. Prop to reset some settings when new layer selected */
  lastLayerSelectedId: string;
  /** Load debug texture image */
  loadDebugTextureImage?: boolean;
  /** If `true` picking will select I3S features
   * If `false` picking will select the whole tile
   */
  featurePicking?: boolean;
  /** Data for normals visualization */
  normalsDebugData?: NormalsDebugData | null;
  /** Percentage of triangles to show normals for */
  normalsTrianglesPercentage?: number;
  /** Normals lenght in meters */
  normalsLength?: number;
  /** http://<root-url>/SceneServer json */
  metadata?: { layers: SceneLayer3D[] } | null;
  /** Basepath of the tileset of the selected tile */
  selectedTilesetBasePath?: string | null;
  /** Tile, selected by picking event */
  selectedTile?: Tile3D | null;
  /** Index of picked object */
  selectedIndex?: number;
  /** Deckgl flag to highlight picked objects automaticaly */
  autoHighlight?: boolean;
  /** List of initialized tilesets */
  loadedTilesets?: Tileset3D[];
  /** I3S option to choose type of geometry */
  useDracoGeometry?: boolean;
  /** I3S option to choose type of textures */
  useCompressedTextures?: boolean;
  /** enables or disables viewport interactivity */
  disableController?: boolean;
  /** allows update a layer */
  loadNumber?: number;
  /** prevent transition to a layer */
  preventTransitions?: boolean;
  /** calculate position of minimap */
  minimapPosition?: MinimapPosition;
  /** side for compare mode */
  filtersByAttribute?: FiltersByAttribute | null;
  onViewStateChange?: (viewStates: ViewStateSet) => void;
  onWebGLInitialized?: (gl: any) => void;
  /** DeckGL after render callback */
  onAfterRender?: () => void;
  /** DeckGL callback. On layer hover behavior */
  getTooltip?: (info: { object: Tile3D; index: number; layer: any }) => void;
  /** DeckGL callback. On layer click behavior */
  onClick?: (info: PickingInfo) => void;
  /** Tile3DLayer callback. Triggers after a tileset was initialized */
  onTilesetLoad: (tileset: Tileset3D) => void;
  /** Tile3DLayer callback. Triggers after tile content was loaded */
  onTileLoad?: (tile: Tile3D) => void;
  /** Tile3DLayer callback. Triggers after tile contenst was unloaded */
  onTileUnload?: (tile: Tile3D) => void;
  /** Tile3DLayer callback. Triggers post traversal completion */
  onTraversalComplete?: (selectedTiles: Tile3D[]) => Tile3D[];
};

export const ArcgisWrapper = ({
  parentViewState,
  coloredTilesMap,
  pickable = false,
  layers3d,
  lastLayerSelectedId,
  loadDebugTextureImage = false,
  featurePicking = true,
  normalsDebugData,
  normalsTrianglesPercentage = 100,
  normalsLength = 1,
  metadata,
  selectedTilesetBasePath,
  selectedTile,
  selectedIndex,
  autoHighlight = false,
  loadedTilesets = [],
  useDracoGeometry = true,
  useCompressedTextures = true,
  disableController = false,
  loadNumber = 0,
  preventTransitions = false,
  minimapPosition,
  filtersByAttribute,
  onViewStateChange,
  onClick,
  onTilesetLoad,
  onTileLoad,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTileUnload = () => {},
  onTraversalComplete = (selectedTiles) => selectedTiles,
}: ArcGisMapProps) => {
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
  const boundingVolume = useAppSelector(selectBoundingVolume);
  const boundingVolumeType = useAppSelector(selectBoundingVolumeType);

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
  const [viewState, setViewState] = useState<ViewStateSet>({
    main: INITIAL_VIEW_STATE,
    minimap: {
      latitude: INITIAL_VIEW_STATE.latitude,
      longitude: INITIAL_VIEW_STATE.longitude,
      zoom: 9,
      pitch: 0,
      bearing: 0,
    },
  });
  const [terrainTiles, setTerrainTiles] = useState({});
  const uvDebugTexture = useAppSelector(selectUVDebugTexture);
  const uvDebugTextureRef = useRef<ImageBitmap | null>(null);
  uvDebugTextureRef.current = uvDebugTexture;
  const [needTransitionToTileset, setNeedTransitionToTileset] = useState(false);

  const showDebugTextureRef = useRef<boolean>(false);
  showDebugTextureRef.current = showDebugTexture;

  const currentViewport: WebMercatorViewport = null;

  const colorsByAttribute = useAppSelector(selectColorsByAttribute);

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

  const getViewState = () =>
    parentViewState || (showMinimap && viewState) || { main: viewState.main };

  const onViewStateChangeHandler = ({
    interactionState,
    viewState,
    viewId,
  }) => {
    const {
      longitude,
      latitude,
      position: [, , oldElevation],
    } = viewState;

    const viewportCenterTerrainElevation =
      getElevationByCentralTile(longitude, latitude, terrainTiles) || 0;
    let cameraTerrainElevation: number | null = null;

    if (currentViewport) {
      const cameraPosition = currentViewport.unprojectPosition(
        currentViewport.cameraPosition
      );
      cameraTerrainElevation =
        getElevationByCentralTile(
          cameraPosition[0],
          cameraPosition[1],
          terrainTiles
        ) || 0;
    }
    let elevation =
      cameraTerrainElevation === null ||
      viewportCenterTerrainElevation > cameraTerrainElevation
        ? viewportCenterTerrainElevation
        : cameraTerrainElevation;
    if (!interactionState.isZooming) {
      if (oldElevation - elevation > 5) {
        elevation = oldElevation - 5;
      } else if (elevation - oldElevation > 5) {
        elevation = oldElevation + 5;
      }
    }

    if (parentViewState && onViewStateChange) {
      let newViewState;
      if (viewId === "minimap") {
        newViewState = {
          main: {
            ...parentViewState.main,
            longitude: viewState.longitude,
            latitude: viewState.latitude,
            position: [0, 0, elevation],
          },
          minimap: viewState,
        };
      } else {
        newViewState = {
          main: {
            ...viewState,
            position: [0, 0, elevation],
          },
          minimap: {
            ...parentViewState.minimap,
            longitude: viewState.longitude,
            latitude: viewState.latitude,
          },
        };
      }
      onViewStateChange(newViewState);
    } else {
      setViewState((prevValues) => {
        let newViewState;
        if (viewId === "minimap") {
          newViewState = {
            main: {
              ...prevValues.main,
              longitude: viewState.longitude,
              latitude: viewState.latitude,
              position: [0, 0, elevation],
            },
            minimap: viewState,
          };
        } else {
          newViewState = {
            main: {
              ...viewState,
              position: [0, 0, elevation],
            },
            minimap: {
              ...prevValues.minimap,
              longitude: viewState.longitude,
              latitude: viewState.latitude,
            },
          };
        }
        return newViewState;
      });
    }
  };

  const onTilesetLoadHandler = (tileset: Tileset3D) => {
    if (needTransitionToTileset && !preventTransitions) {
      const { zoom, cartographicCenter } = tileset;
      const [longitude, latitude] = cartographicCenter || [];
      const viewport = new VIEWS[0].ViewportType(viewState.main);
      const {
        main: { pitch, bearing },
      } = viewState;

      const { zmin = 0 } = metadata?.layers?.[0]?.fullExtent || {};
      const [pLongitude, pLatitude] = getLonLatWithElevationOffset(
        zmin,
        pitch,
        bearing,
        longitude,
        latitude,
        viewport
      );

      const newViewState = {
        main: {
          ...viewState.main,
          zoom: zoom + 2,
          longitude: pLongitude,
          latitude: pLatitude,
          transitionDuration: TRANSITION_DURAITON,
          transitionInterpolator: new FlyToInterpolator(),
        },
        minimap: {
          ...viewState.minimap,
          longitude: pLongitude,
          latitude: pLatitude,
        },
      };
      setNeedTransitionToTileset(false);
      if (parentViewState && onViewStateChange) {
        onViewStateChange(newViewState);
      } else {
        setViewState(newViewState);
      }
    }

    tileset.setProps({
      //todo: viewportTraversersMap,
      loadTiles,
    });
    onTilesetLoad(tileset);
  };

  const onTileLoadHandler = (tile) => {
    if (!featurePicking) {
      // delete featureIds from data to have instance picking instead of feature picking
      delete tile.content.featureIds;
    }
    if (showDebugTextureRef.current) {
      selectDebugTextureForTile(tile, uvDebugTextureRef.current);
    } else {
      selectOriginalTextureForTile(tile);
    }
    if (onTileLoad) {
      onTileLoad(tile);
    }
  };

  const onTerrainTileLoad = (tile) => {
    const {
      bbox: { east, north, south, west },
    } = tile;

    setTerrainTiles((prevValue) => ({
      ...prevValue,
      [`${east};${north};${south};${west}`]: tile,
    }));
  };

  const doRenderLayers = () => {
    return renderLayers({
      layers3d,
      useDracoGeometry,
      useCompressedTextures,
      showTerrain,
      loadNumber,
      colorsByAttribute,
      pickable,
      autoHighlight,
      wireframe,
      tileColorMode,
      showMinimap,
      viewState,
      boundingVolume,
      boundingVolumeType,
      normalsTrianglesPercentage,
      normalsLength,
      createIndependentMinimapViewport,
      boundingVolumeColorMode,
      loadedTilesets,
      onClick,
      onTilesetLoadHandler,
      onTileLoadHandler,
      onTileUnload,
      onTraversalComplete,
      onTerrainTileLoad,
      filtersByAttribute,
      selectedTile,
      coloredTilesMap,
      selectedTilesetBasePath,
      selectedIndex,
      parentViewState,
      normalsDebugData,
    });
  };

  // Trying to keep code alligned to deck-gl-wrapper above this line
  // All Arcgis specific code is allocated below this line
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useArcgis(mapContainer, getViewState(), onViewStateChangeHandler);
  if (map) {
    const layers = doRenderLayers();
    // @ts-expect-error @deck.gl/arcgis has no types
    map.deck.set({ layers });
    // @ts-expect-error @deck.gl/arcgis has no types
    map.deck.layerFilter = layerFilterCreator(showMinimap);
  }
  return <StyledMapContainer ref={mapContainer} />;
};

export default ArcgisWrapper;
