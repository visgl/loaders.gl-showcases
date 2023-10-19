import DeckGL from "@deck.gl/react";
import { LineLayer, ScatterplotLayer } from "@deck.gl/layers";
import { TerrainLayer, Tile3DLayer } from "@deck.gl/geo-layers";
import { MapController } from "@deck.gl/core";
import type { Tile3D, Tileset3D } from "@loaders.gl/tiles";
import { I3SLoader, SceneLayer3D } from "@loaders.gl/i3s";
import { CesiumIonLoader, Tiles3DLoader } from "@loaders.gl/3d-tiles";
import {
  FlyToInterpolator,
  COORDINATE_SYSTEM,
  MapView,
  WebMercatorViewport,
  PickingInfo,
  View,
} from "@deck.gl/core";
import { useEffect, useMemo, useState, useRef } from "react";
// import { StaticMap } from "react-map-gl";
import { CONTRAST_MAP_STYLES } from "../../constants/map-styles";
import {
  NormalsDebugData,
  ViewStateSet,
  LoadOptions,
  TilesetType,
  MinimapPosition,
} from "../../types";
import { BoundingVolumeLayer } from "../../layers";
import ColorMap from "../../utils/debug/colors-map";
import {
  selectDebugTextureForTile,
  selectDebugTextureForTileset,
  selectOriginalTextureForTile,
  selectOriginalTextureForTileset,
} from "../../utils/debug/texture-selector-utils";
import { getElevationByCentralTile } from "../../utils/terrain-elevation";
import { getFrustumBounds } from "../../utils/debug/frustum-utils";
import { buildMinimapData } from "../../utils/debug/build-minimap-data";
import {
  getNormalSourcePosition,
  getNormalTargetPosition,
} from "../../utils/debug/normals-utils";
import { getLonLatWithElevationOffset } from "../../utils/elevation-utils";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectColorsByAttribute } from "../../redux/slices/colors-by-attribute-slice";
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
import {
  BaseMapProviderId,
  MAP_PROVIDER_PROPERTIES,
} from "../../constants/base-map-providers";
import {
  Source as MaplibreSource,
  MapRef as MaplibreMapRef,
} from "react-map-gl/maplibre";
import { Source as MapboxSource, MapRef as MapboxMapRef } from "react-map-gl";
import {
  appActions,
  selectBaseMapMode,
  selectMapProvider,
} from "../../redux/slices/app.slice";
import { mapActions } from "../../redux/slices/map.slice";
import { selectTerrainState } from "../../redux/slices/layer-props.slice";

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

// https://github.com/tilezen/joerd/blob/master/docs/use-service.md#additional-amazon-s3-endpoints
const MAPZEN_TERRAIN_IMAGES = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`;
const ARCGIS_STREET_MAP_SURFACE_IMAGES =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const MAPZEN_ELEVATION_DECODE_PARAMETERS = {
  rScaler: 256,
  gScaler: 1,
  bScaler: 1 / 256,
  offset: -32768,
};
const TERRAIN_LAYER_MAX_ZOOM = 15;

const DEFAULT_BG_OPACITY = 100;

const NORMALS_COLOR = [255, 0, 0];

const colorMap = new ColorMap();

type DeckGlI3sProps = {
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
};

export const DeckGlWrapper = ({
  id,
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
  onViewStateChange,
  onWebGLInitialized,
  onAfterRender,
  getTooltip,
  onClick,
  onTilesetLoad,
  onTileLoad,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTileUnload = () => {},
}: DeckGlI3sProps) => {
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
  ///
  const baseMapProvider = useAppSelector(selectMapProvider);
  const baseMapProviderId = baseMapProvider.id;
  const mapRef = useRef<MaplibreMapRef | MapboxMapRef>(null);
  const terrainState = useAppSelector(selectTerrainState);
  ///
  const mapProviderProps = useMemo(
    () => MAP_PROVIDER_PROPERTIES[baseMapProviderId],
    [baseMapProviderId]
  );

  const getTerrainElevation = (
    baseMapProviderId: BaseMapProviderId.maplibre | BaseMapProviderId.mapbox2,
    terrainState: boolean,
    mapRef: MaplibreMapRef | MapboxMapRef | null
  ) => {
    let extraElevation = 0;
    if (terrainState) {
      if (baseMapProviderId === BaseMapProviderId.mapbox2) {
        const center = mapRef?.getCenter();
        if (center) {
          const result = mapRef?.queryTerrainElevation(center);
          if (typeof result === "number") {
            extraElevation = result;
          }
        }
      } else if (baseMapProviderId === BaseMapProviderId.maplibre) {
        const map = mapRef?.getMap();
        // @ts-expect-error transform is not typed
        extraElevation = map?.transform.elevation || 0;
      }
    }
    return extraElevation;
  };

  const onSourceDataHandler = () => {
    const extraElevation = getTerrainElevation(
      baseMapProviderId,
      terrainState,
      mapRef.current
    );
    dispatch(
      mapActions.setMapState({
        ...viewState,
        position: [0, 0, extraElevation],
      })
    );
  };

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

  let currentViewport: WebMercatorViewport = null;

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

  const getViews = () => (showMinimap ? VIEWS : [VIEWS[0]]);

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

    const viewportTraversersMap = {
      main: "main",
      minimap: createIndependentMinimapViewport ? "minimap" : "main",
    };
    tileset.setProps({
      viewportTraversersMap,
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

  const getAllTilesFromTilesets = (tilesets) => {
    const allTiles = tilesets.map((tileset) => tileset.tiles);
    return allTiles.flat();
  };

  const getBoundingVolumeColor = (tile) => {
    const color = colorMap.getBoundingVolumeColor(tile, {
      coloredBy: boundingVolumeColorMode,
    });

    return [...color, DEFAULT_BG_OPACITY];
  };

  const getMeshColor = (tile) => {
    const result = colorMap.getTileColor(tile, {
      coloredBy: tileColorMode,
      selectedTileId: selectedTile?.id,
      coloredTilesMap,
    });

    return result;
  };

  const renderBoundingVolumeLayer = () => {
    const boundingVolume = useAppSelector(selectBoundingVolume);
    const boundingVolumeType = useAppSelector(selectBoundingVolumeType);

    if (!boundingVolume) {
      return null;
    }
    const tiles = getAllTilesFromTilesets(loadedTilesets);
    // @ts-expect-error - Expected 0 arguments, but got 1.
    return new BoundingVolumeLayer({
      id: "bounding-volume-layer",
      visible: boundingVolume,
      tiles,
      getBoundingVolumeColor,
      boundingVolumeType,
    });
  };

  const renderFrustum = () => {
    if (!showMinimap) {
      return false;
    }
    const viewport = new WebMercatorViewport(viewState.main);
    const frustumBounds = getFrustumBounds(viewport);
    return new LineLayer({
      id: "frustum",
      data: frustumBounds,
      getSourcePosition: (d) => d.source,
      getTargetPosition: (d) => d.target,
      getColor: (d) => d.color,
      getWidth: 2,
    });
  };

  const renderMainOnMinimap = () => {
    if (!createIndependentMinimapViewport) {
      return null;
    }
    let data = [];

    if (loadedTilesets.length) {
      const tiles = getAllTilesFromTilesets(loadedTilesets);
      data = buildMinimapData(tiles);
    }

    return new ScatterplotLayer({
      id: "main-on-minimap",
      data,
      pickable: false,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 1,
      radiusMinPixels: 1,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: (d) => d.coordinates,
      getRadius: (d) => d.radius,
      getFillColor: () => [255, 140, 0, 100],
      getLineColor: () => [0, 0, 0, 120],
    });
  };

  const renderNormals = () => {
    if (!normalsDebugData) {
      return;
    }
    return new LineLayer({
      id: "normals-debug",
      data: normalsDebugData,
      getSourcePosition: (_, { index, data }) =>
        getNormalSourcePosition(index, data, normalsTrianglesPercentage),
      getTargetPosition: (_, { index, data }) =>
        getNormalTargetPosition(
          index,
          data,
          normalsTrianglesPercentage,
          normalsLength
        ),
      getColor: () => NORMALS_COLOR,
      modelMatrix: normalsDebugData?.cartographicModelMatrix,
      coordinateOrigin: normalsDebugData?.cartographicOrigin,
      coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
      getWidth: 1,
    });
  };

  const renderI3SLayer = (layer) => {
    const loadOptions: LoadOptions = {
      i3s: {
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
        useDracoGeometry,
        useCompressedTextures,
        colorsByAttribute: colorsByAttribute,
      },
    };
    if (layer.token) {
      loadOptions.i3s.token = layer.token;
    }
    return new Tile3DLayer({
      id: `tile-layer-${layer.id}-draco-${useDracoGeometry}-compressed-textures-${useCompressedTextures}--colors-by-attribute-${colorsByAttribute?.attributeName}--colors-by-attribute-mode-${colorsByAttribute?.mode}--${loadNumber}`,
      data: layer.url,
      loader: I3SLoader,
      onTilesetLoad: onTilesetLoadHandler,
      onTileLoad: onTileLoadHandler,
      onTileUnload,
      loadOptions,
      pickable,
      autoHighlight,
      _subLayerProps: {
        mesh: {
          wireframe,
        },
      },
      _getMeshColor: getMeshColor,
      highlightedObjectIndex: autoHighlight
        ? undefined
        : layer.url === selectedTilesetBasePath
        ? selectedIndex
        : -1,
    });
  };

  const render3DTilesLayer = (layer) => {
    const loadOptions =
      layer.type === TilesetType.CesiumIon
        ? { "cesium-ion": { accessToken: layer.token } }
        : {};
    const loader =
      layer.type === TilesetType.CesiumIon ? CesiumIonLoader : Tiles3DLoader;
    return new Tile3DLayer({
      id: `tile-layer-${layer.id}--${loadNumber}`,
      data: layer.url,
      loader,
      loadOptions,
      onTilesetLoad: onTilesetLoadHandler,
      onTileLoad: onTileLoadHandler,
      onTileUnload,
    });
  };

  const renderLayers = () => {
    const tile3dLayers = layers3d.map((layer) => {
      switch (layer.type) {
        case TilesetType.CesiumIon:
        case TilesetType.Tiles3D:
          return render3DTilesLayer(layer);
        case TilesetType.I3S:
        default:
          return renderI3SLayer(layer);
      }
    });

    if (showTerrain) {
      const terrainLayer = new TerrainLayer({
        id: "terrain",
        maxZoom: TERRAIN_LAYER_MAX_ZOOM,
        elevationDecoder: MAPZEN_ELEVATION_DECODE_PARAMETERS,
        elevationData: MAPZEN_TERRAIN_IMAGES,
        texture: ARCGIS_STREET_MAP_SURFACE_IMAGES,
        onTileLoad: (tile) => onTerrainTileLoad(tile),
        color: [255, 255, 255],
      });
      tile3dLayers.push(terrainLayer);
    }

    return [
      ...tile3dLayers,
      renderFrustum(),
      renderBoundingVolumeLayer(),
      renderNormals(),
      renderMainOnMinimap(),
    ];
  };

  const layerFilter = ({ layer, viewport }) => {
    const { id: viewportId } = viewport;
    const {
      id: layerId,
      props: { viewportIds = null },
    } = layer;
    if (
      viewportId !== "minimap" &&
      (layerId === "frustum" || layerId === "main-on-minimap")
    ) {
      // only display frustum in the minimap
      return false;
    }
    if (
      showMinimap &&
      viewportId === "minimap" &&
      layerId.indexOf("obb-debug-") !== -1
    ) {
      return false;
    }
    if (viewportIds && !viewportIds.includes(viewportId)) {
      return false;
    }
    if (viewportId === "minimap" && layerId === "normals-debug") {
      return false;
    }
    if (viewportId === "minimap" && layerId.indexOf("terrain") !== -1) {
      return false;
    }
    return true;
  };

  return (
    <DeckGL
      id={id}
      layers={renderLayers()}
      viewState={getViewState()}
      views={getViews()}
      layerFilter={layerFilter}
      onViewStateChange={onViewStateChangeHandler}
      controller={
        disableController
          ? false
          : {
              type: MapController,
              maxPitch: 60,
              inertia: true,
              scrollZoom: { speed: 0.01, smooth: true },
              touchRotate: true,
              dragMode,
            }
      }
      glOptions={{
        preserveDrawingBuffer: true,
      }}
      onWebGLInitialized={onWebGLInitialized}
      onAfterRender={onAfterRender}
      getTooltip={getTooltip}
      onClick={onClick}
    >
      <mapProviderProps.Map
        // @ ts-expect-error Maplibre & Mapbox types are different
        ref={mapRef}
        mapboxAccessToken={mapProviderProps.accessToken}
        mapStyle={mapProviderProps.mapStyle}
        terrain={
          terrainState
            ? { source: "dem-data-source", exaggeration: 1 }
            : undefined
        }
        onSourceData={onSourceDataHandler}
      >
        {baseMapProviderId === BaseMapProviderId.maplibre && (
          <MaplibreSource
            id={mapProviderProps.terrainProps.id}
            type={mapProviderProps.terrainProps.type}
            tiles={[
              "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
            ]}
            encoding="terrarium"
            tileSize={256}
            maxzoom={12}
          />
        )}
        {baseMapProviderId === BaseMapProviderId.mapbox2 && (
          <MapboxSource
            id={mapProviderProps.terrainProps.id}
            type={mapProviderProps.terrainProps.type}
            url="mapbox://mapbox.mapbox-terrain-dem-v1"
            tileSize={512}
            maxzoom={14}
          />
        )}
      </mapProviderProps.Map>
    </DeckGL>
  );
};
