import DeckGL from "@deck.gl/react";
import { LineLayer, ScatterplotLayer } from "@deck.gl/layers";
import { TerrainLayer, Tile3DLayer } from "@deck.gl/geo-layers";
import { MapController } from "@deck.gl/core";
import { load } from "@loaders.gl/core";
import { ImageLoader } from "@loaders.gl/images";
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
import { useEffect, useMemo, useState } from "react";
import { StaticMap } from "react-map-gl";
import { CONTRAST_MAP_STYLES } from "../../constants/map-styles";
import {
  NormalsDebugData,
  ViewStateSet,
  DragMode,
  ColorsByAttribute,
  LoadOptions,
  TilesetType,
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
const UV_DEBUG_TEXTURE_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/images/uv-debug-texture.jpg";
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
  /** Minimap visibility */
  showMinimap?: boolean;
  /** If should create independent viewport for minimap */
  createIndependentMinimapViewport?: boolean;
  /** Terrain visibility */
  showTerrain?: boolean;
  /** Map style: https://deck.gl/docs/api-reference/carto/basemap  */
  mapStyle?: string;
  /** Color mode for tiles */
  tileColorMode?: number;
  /** User selected tiles colors */
  coloredTilesMap?: { [key: string]: string };
  /** Property for I3SLoaderOptions. Properties for attribute driven visualization */
  colorsByAttribute?: ColorsByAttribute | null;
  /** Bounding volume type: OBB of MBS. Set to "" to hide bounding volumes visualisation */
  boundingVolumeType?: string;
  /** Bounding volume color mode */
  boundingVolumeColorMode?: number;
  /** Allows layers picking to handle mouse events */
  pickable?: boolean;
  /** Show wireframe representation of layers */
  wireframe?: boolean;
  /** Layers loading data  */
  i3sLayers: {
    id?: number;
    url?: string;
    token?: string | null;
    type: TilesetType;
  }[];
  /** Last selected layer id. Prop to reset some settings when new layer selected */
  lastLayerSelectedId: string;
  /** Load debug texture image */
  loadDebugTextureImage?: boolean;
  /** Replace original texture with debug texture */
  showDebugTexture?: boolean;
  /** If `true` tileset will make traversal and load/unload tiles.
   * If `false` - the traversal is stopped, tiles are `frosen`, map doesn't react on viewState change */
  loadTiles?: boolean;
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
  /** controller drag mode https://deck.gl/docs/api-reference/core/controller#options */
  dragMode?: DragMode;
  /** enables or disables viewport interactivity */
  disableController?: boolean;
  /** allows update a layer */
  loadNumber?: number;
  /** prevent transition to a layer */
  preventTransitions?: boolean;
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

export const DeckGlI3s = ({
  id,
  parentViewState,
  showMinimap,
  createIndependentMinimapViewport = false,
  showTerrain = false,
  mapStyle,
  tileColorMode,
  coloredTilesMap,
  colorsByAttribute,
  boundingVolumeType = "",
  boundingVolumeColorMode,
  pickable = false,
  wireframe,
  i3sLayers,
  lastLayerSelectedId,
  loadDebugTextureImage = false,
  showDebugTexture = false,
  loadTiles = true,
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
  dragMode = DragMode.pan,
  loadNumber = 0,
  preventTransitions = false,
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
        x: "79%",
        y: "79%",
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
    [disableController]
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
  const [uvDebugTexture, setUvDebugTexture] = useState(null);
  const [needTransitionToTileset, setNeedTransitionToTileset] = useState(false);

  let currentViewport: WebMercatorViewport = null;

  /** Load debug texture if necessary */
  useEffect(() => {
    async function fetchUVDebugTexture() {
      const image = await load(UV_DEBUG_TEXTURE_URL, ImageLoader);
      setUvDebugTexture(image);
    }
    if (loadDebugTextureImage && !uvDebugTexture) {
      fetchUVDebugTexture();
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
      let pLongitue = longitude;
      let pLatitude = latitude;
      const viewport = new VIEWS[0].ViewportType(viewState.main);
      const {
        main: { pitch, bearing },
      } = viewState;

      const { zmin = 0 } = metadata?.layers?.[0]?.fullExtent || {};
      /**
       * See image in the PR https://github.com/visgl/loaders.gl/pull/2046
       * For elevated tilesets cartographic center position of a tileset is not correct
       * to use it as viewState position because these positions are different.
       * We need to calculate projection of camera direction onto the ellipsoid surface.
       * We use this projection as offset to add it to the tileset cartographic center position.
       */
      const projection = zmin * Math.tan((pitch * Math.PI) / 180);
      /**
       * Convert to world coordinate system to shift the position on some distance in meters
       */
      const projectedPostion = viewport.projectPosition([longitude, latitude]);
      /**
       * Shift longitude
       */
      projectedPostion[0] +=
        projection *
        Math.sin((bearing * Math.PI) / 180) *
        viewport.distanceScales.unitsPerMeter[0];
      /**
       * Shift latitude
       */
      projectedPostion[1] +=
        projection *
        Math.cos((bearing * Math.PI) / 180) *
        viewport.distanceScales.unitsPerMeter[1];
      /**
       * Convert resulting coordinates to catrographic
       */
      [pLongitue, pLatitude] = viewport.unprojectPosition(projectedPostion);

      const newViewState = {
        main: {
          ...viewState.main,
          zoom: zoom + 2,
          longitude: pLongitue,
          latitude: pLatitude,
          transitionDuration: TRANSITION_DURAITON,
          transitionInterpolator: new FlyToInterpolator(),
        },
        minimap: {
          ...viewState.minimap,
          longitude: pLongitue,
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
    if (showDebugTexture) {
      selectDebugTextureForTile(tile, uvDebugTexture);
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
    const color = colorMap.getColor(tile, {
      coloredBy: boundingVolumeColorMode,
    });

    return [...color, DEFAULT_BG_OPACITY];
  };

  const getMeshColor = (tile) => {
    const result = colorMap.getColor(tile, {
      coloredBy: tileColorMode,
      selectedTileId: selectedTile?.id,
      coloredTilesMap,
    });

    return result;
  };

  const renderBoundingVolumeLayer = () => {
    if (boundingVolumeType === "") {
      return null;
    }
    const tiles = getAllTilesFromTilesets(loadedTilesets);
    // @ts-expect-error - Expected 0 arguments, but got 1.
    return new BoundingVolumeLayer({
      id: "bounding-volume-layer",
      visible: Boolean(boundingVolumeType),
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
        colorsByAttribute,
      },
    };
    if (layer.token) {
      loadOptions.i3s.token = layer.token;
    }
    return new Tile3DLayer({
      id: `tile-layer-${layer.id}-draco-${useDracoGeometry}-compressed-textures-${useCompressedTextures}--colors-by-attribute-${colorsByAttribute?.attributeName}--${loadNumber}`,
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
    const tile3dLayers = i3sLayers.map((layer) => {
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
      {({ viewport }) => {
        currentViewport = viewport;
      }}
      {!showTerrain && (
        <StaticMap
          reuseMaps
          mapStyle={mapStyle}
          preventStyleDiffing
          preserveDrawingBuffer
        />
      )}
      {mapStyle && (
        <View id="minimap">
          <StaticMap
            reuseMaps
            mapStyle={CONTRAST_MAP_STYLES[mapStyle]}
            preventStyleDiffing
            preserveDrawingBuffer
          />
        </View>
      )}
    </DeckGL>
  );
};
