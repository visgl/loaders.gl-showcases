import { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { StaticMap } from "react-map-gl";
import { HuePicker, MaterialPicker } from "react-color";
import styled from "styled-components";

import { lumaStats } from "@luma.gl/core";
import DeckGL from "@deck.gl/react";
import {
  FlyToInterpolator,
  MapController,
  View,
  MapView,
  WebMercatorViewport,
  COORDINATE_SYSTEM,
} from "@deck.gl/core";
import { LineLayer, ScatterplotLayer } from "@deck.gl/layers";
import { TerrainLayer, Tile3DLayer } from "@deck.gl/geo-layers";

import { load } from "@loaders.gl/core";
import { I3SLoader, I3SBuildingSceneLayerLoader } from "@loaders.gl/i3s";
import { ImageLoader } from "@loaders.gl/images";
import { StatsWidget } from "@probe.gl/stats-widget";

import { buildMinimapData, getFrustumBounds } from "../../utils";
import { INITIAL_EXAMPLE_NAME, EXAMPLES } from "../../constants/i3s-examples";

import {
  INITIAL_MAP_STYLE,
  CONTRAST_MAP_STYLES,
  INITIAL_TILE_COLOR_MODE,
  INITIAL_BOUNDING_VOLUME_COLOR_MODE,
  INITIAL_BOUNDING_VOLUME_TYPE,
} from "../../constants/map-styles";

import {
  COLORED_BY,
  makeRGBObjectFromColor,
  getRGBValueFromColorObject,
  parseTilesetUrlFromUrl,
  parseTilesetUrlParams,
  ColorMap,
  getTileDebugInfo,
  getShortTileDebugInfo,
  validateTile as handleValidateTile,
  generateBinaryNormalsDebugData,
  getNormalSourcePosition,
  getNormalTargetPosition,
  selectDebugTextureForTile,
  selectDebugTextureForTileset,
  selectOriginalTextureForTile,
  selectOriginalTextureForTileset,
  buildSublayersTree,
  initStats,
  sumTilesetsStats,
  getElevationByCentralTile,
} from "../../utils";

import {
  AttributesPanel,
  AttributesTooltip,
  ControlPanel,
  DebugPanel,
  MapInfoPanel,
  SemanticValidator,
  ToolBar,
  TileValidator,
  BuildingExplorer,
} from "../../components";

import { BoundingVolumeLayer } from "../../layers";

import { Color, Font } from "../../constants/common";

const TRANSITION_DURAITON = 4000;
const DEFAULT_TRIANGLES_PERCENTAGE = 30; // Percentage of triangles to show normals for.
const DEFAULT_NORMALS_LENGTH = 20; // Normals length in meters
const NORMALS_COLOR = [255, 0, 0];
const DEFAULT_COLOR = [255, 255, 255];
const DEFAULT_BG_OPACITY = 100;
const UV_DEBUG_TEXTURE_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/images/uv-debug-texture.jpg";

const INITIAL_VIEW_STATE = {
  longitude: -120,
  latitude: 34,
  height: 600,
  width: 800,
  pitch: 45,
  maxPitch: 60,
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

const INITIAL_DEBUG_OPTIONS_STATE = {
  // Show minimap
  minimap: true,
  // Use separate traversal for the minimap viewport
  minimapViewport: false,
  // Show bounding volumes
  boundingVolume: false,
  // Tile coloring mode selector
  tileColorMode: INITIAL_TILE_COLOR_MODE,
  // Bounding volume coloring mode selector
  boundingVolumeColorMode: INITIAL_BOUNDING_VOLUME_COLOR_MODE,
  // Bounding volume geometry shape selector
  boundingVolumeType: INITIAL_BOUNDING_VOLUME_TYPE,
  // Select tiles with a mouse button
  pickable: false,
  // Load tiles after traversal.
  // Use this to freeze loaded tiles and see on them from different perspective
  loadTiles: true,
  // Show the semantic validation warnings window
  semanticValidator: false,
  // Use "uv-debug-texture" texture to check UV coordinates
  showUVDebugTexture: false,
  // Enable/Disable wireframe mode
  wireframe: false,
  // Show statswidget
  showMemory: false,
  // Show control panel
  controlPanel: true,
  // Show debug panel
  debugPanel: false,
  // Show map info
  showFullInfo: false,
  // Show building explorer.
  buildingExplorer: false,
};

const MATERIAL_PICKER_STYLE = {
  default: {
    material: {
      height: "auto",
      width: "auto",
    },
  },
};

const VIEWS = [
  new MapView({
    id: "main",
    controller: { inertia: true },
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

    controller: {
      maxZoom: 9,
      minZoom: 9,
      dragRotate: false,
      keyboard: false,
    },
  }),
];

const TILE_COLOR_SELECTOR = "Tile Color Selector";

const HEADER_STYLE = {
  color: "white",
};

const CURSOR_STYLE = {
  cursor: "pointer",
};

const StatsWidgetWrapper = styled.div`
  display: ${(props) => (props.showMemory ? "inherit" : "none")};
`;

const StatsWidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  ${Color}
  ${Font}
  color: rgba(255, 255, 255, .6);
  z-index: 3;
  top: 70px;
  right: 10px;
  word-break: break-word;
  padding: 24px;
  border-radius: 8px;
  width: 250px;
  max-height: calc(100% - 10px);
  line-height: 135%;
  overflow: auto;
`;

export const I3SDebugApp = () => {
  let statsWidgetContainer = useRef(null);
  const [needTransitionToTileset, setNeedTransitionToTileset] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [token, setToken] = useState(null);
  const [name, setName] = useState(INITIAL_EXAMPLE_NAME);
  const [viewState, setViewState] = useState({
    main: INITIAL_VIEW_STATE,
    minimap: {
      latitude: INITIAL_VIEW_STATE.latitude,
      longitude: INITIAL_VIEW_STATE.longitude,
      zoom: 9,
      pitch: 0,
      bearing: 0,
    },
  });
  const [selectedMapStyle, setSelectedMapStyle] = useState(INITIAL_MAP_STYLE);
  const [debugOptions, setDebugOptions] = useState(INITIAL_DEBUG_OPTIONS_STATE);
  const [normalsDebugData, setNormalsDebugData] = useState([]);
  const [trianglesPercentage, setTrianglesPercentage] = useState(
    DEFAULT_TRIANGLES_PERCENTAGE
  );
  const [normalsLength, setNormalsLength] = useState(DEFAULT_NORMALS_LENGTH);
  const [tileInfo, setTileInfo] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [coloredTilesMap, setColoredTilesMap] = useState({});
  const [warnings, setWarnings] = useState([]);
  const [flattenedSublayers, setFlattenedSublayers] = useState([]);
  const [sublayers, setSublayers] = useState([]);
  const [sublayersUpdateCounter, setSublayersUpdateCounter] = useState(0);
  const [tilesetsStats, setTilesetsStats] = useState(initStats());
  const [useTerrainLayer, setUseTerrainLayer] = useState(false);
  const [terrainTiles, setTerrainTiles] = useState({});

  const [colorMap, setColorMap] = useState(new ColorMap());
  const [uvDebugTexture, setUvDebugTexture] = useState(null);
  const [loadedTilesets, setLoadedTilesets] = useState([]);
  const [memWidget, setMemVidget] = useState(null);

  const [tilesetStatsWidget, setTilesetStatsWidget] = useState(null);
  const [currentViewport, setCurrentViewport] = useState(null);
  const [showBuildingExplorer, setShowBuildingExplorer] = useState(false);

  useEffect(() => {
    const memWidget = new StatsWidget(lumaStats.get("Memory Usage"), {
      framesPerUpdate: 1,
      formatters: {
        "GPU Memory": "memory",
        "Buffer Memory": "memory",
        "Renderbuffer Memory": "memory",
        "Texture Memory": "memory",
      },
      // @ts-expect-error
      container: statsWidgetContainer,
    });
    // @ts-expect-error
    setMemVidget(memWidget);

    // @ts-expect-error
    const tilesetStatsWidget = new StatsWidget(null, {
      container: statsWidgetContainer,
    });
    // @ts-expect-error
    setTilesetStatsWidget(tilesetStatsWidget);

    // Check if a tileset is specified in the query params
    let mainTileset;
    const tilesetUrl = parseTilesetUrlFromUrl();

    if (tilesetUrl) {
      mainTileset = { url: tilesetUrl };
    } else {
      mainTileset = EXAMPLES[INITIAL_EXAMPLE_NAME];
    }
    const initialTilesetStats = initStats(mainTileset.url);
    setTilesetsStats(initialTilesetStats);
    onSelectTileset(mainTileset);

    load(UV_DEBUG_TEXTURE_URL, ImageLoader).then((image) =>
      setUvDebugTexture(image)
    );
  }, []);

  const getViewState = () =>
    debugOptions.minimap ? viewState : { main: viewState.main };

  const getViews = () => (debugOptions.minimap ? VIEWS : [VIEWS[0]]);

  const onSelectTileset = async (mainTileset) => {
    const params = parseTilesetUrlParams(mainTileset.url, mainTileset);
    const { tilesetUrl, token, name, metadataUrl } = params;

    // setTilesetUrl(tilesetUrl);
    setName(name);
    setToken(token);
    setSublayers([]);

    handleClearWarnings();
    const metadata = await fetch(metadataUrl).then((resp) => resp.json());
    const flattenedSublayers = await getFlattenedSublayers(tilesetUrl);

    setMetadata(metadata);
    setTileInfo(null);
    setNormalsDebugData([]);
    setFlattenedSublayers(flattenedSublayers);
    setLoadedTilesets([]);
    setNeedTransitionToTileset(true);

    const tilesetsStats = initStats(tilesetUrl);
    // @ts-expect-error
    tilesetStatsWidget && tilesetStatsWidget.setStats(tilesetsStats);
    setTilesetsStats(tilesetsStats);
  };

  /**
   * Tries to get Building Scene Layer sublayer urls if exists.
   * @param {string} tilesetUrl
   * @returns {string[]} Sublayer urls or tileset url.
   * TODO Add filtration mode for sublayers which were selected by user.
   */
  const getFlattenedSublayers = async (tilesetUrl) => {
    try {
      const mainTileset = await load(tilesetUrl, I3SBuildingSceneLayerLoader);
      const sublayersTree = buildSublayersTree(mainTileset.header.sublayers);
      setSublayers(sublayersTree.sublayers);
      const sublayers = mainTileset?.sublayers.filter(
        (sublayer) => sublayer.name !== "Overview"
      );
      return sublayers;
    } catch (e) {
      return [{ url: tilesetUrl, visibility: true }];
    }
  };

  // Updates stats, called every frame
  const updateStatWidgets = () => {
    // @ts-expect-error
    memWidget && memWidget.update();
    sumTilesetsStats(loadedTilesets, tilesetsStats);
    // @ts-expect-error
    tilesetStatsWidget && tilesetStatsWidget.update();
  };

  const onTileLoad = (tile) => {
    removeFeatureIdsFromTile(tile);
    updateStatWidgets();
    validateTile(tile);

    const { showUVDebugTexture } = debugOptions;

    if (showUVDebugTexture) {
      selectDebugTextureForTile(tile, uvDebugTexture);
    } else {
      selectOriginalTextureForTile(tile);
    }
  };

  const onTileUnload = () => updateStatWidgets();

  const onTilesetLoad = (tileset) => {
    // @ts-expect-error
    setLoadedTilesets((prevValues) => [...prevValues, tileset]);

    if (needTransitionToTileset) {
      const { zoom, cartographicCenter } = tileset;
      const [longitude, latitude] = cartographicCenter;
      let pLongitue = longitude;
      let pLatitude = latitude;
      const viewport = new VIEWS[0].type(viewState.main);
      const {
        main: { pitch, bearing },
      } = viewState;

      // @ts-expect-error
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

      setViewState({
        main: {
          ...viewState.main,
          zoom: zoom + 2.5,
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
      });
      setNeedTransitionToTileset(false);
    }

    const { minimapViewport, loadTiles } = debugOptions;
    const viewportTraversersMap = {
      main: "main",
      minimap: minimapViewport ? "minimap" : "main",
    };
    tileset.setOptions({
      viewportTraversersMap,
      loadTiles,
    });
  };

  const onViewStateChange = ({ interactionState, viewState, viewId }) => {
    let {
      longitude,
      latitude,
      position: [x, y, oldElevation],
    } = viewState;

    const viewportCenterTerrainElevation =
      getElevationByCentralTile(longitude, latitude, terrainTiles) || 0;
    let cameraTerrainElevation = null;

    if (currentViewport) {
      // @ts-expect-error
      const cameraPosition = currentViewport.unprojectPosition(
        // @ts-expect-error
        currentViewport.cameraPosition
      );
      // @ts-expect-error
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

    if (viewId === "minimap") {
      setViewState((prevValues) => ({
        main: {
          ...prevValues.main,
          longitude: viewState.longitude,
          latitude: viewState.latitude,
          position: [0, 0, elevation],
        },
        minimap: viewState,
      }));
    } else {
      setViewState((prevValues) => ({
        main: {
          ...viewState,
          position: [0, 0, elevation],
        },
        minimap: {
          ...prevValues.minimap,
          longitude: viewState.longitude,
          latitude: viewState.latitude,
        },
      }));
    }
  };

  const onSelectMapStyle = ({ selectedMapStyle }) =>
    setSelectedMapStyle(selectedMapStyle);

  const handleSetDebugOptions = (newDebugOptions) => {
    const updatedDebugOptions = { ...debugOptions, ...newDebugOptions };

    if (updatedDebugOptions.tileColorMode !== COLORED_BY.CUSTOM) {
      setColoredTilesMap({});
      setSelectedTile(null);
    }

    const { showUVDebugTexture } = debugOptions;
    if (updatedDebugOptions.showUVDebugTexture !== showUVDebugTexture) {
      loadedTilesets.forEach((tileset) => {
        if (updatedDebugOptions.showUVDebugTexture) {
          selectDebugTextureForTileset(tileset, uvDebugTexture);
        } else {
          selectOriginalTextureForTileset(tileset);
        }
      });
    }

    const { minimapViewport, loadTiles } = updatedDebugOptions;
    const viewportTraversersMap = {
      main: "main",
      minimap: minimapViewport ? "minimap" : "main",
    };

    loadedTilesets.forEach((tileset) => {
      // @ts-expect-error
      tileset.setOptions({
        viewportTraversersMap,
        loadTiles,
      });
      // @ts-expect-error
      tileset.update();
    });

    const { debugPanel } = debugOptions;
    const { debugPanel: newDebugPanel } = updatedDebugOptions;

    if (debugPanel !== newDebugPanel && newDebugPanel) {
      updatedDebugOptions.buildingExplorer = false;
    }
    setDebugOptions(updatedDebugOptions);
  };

  // Remove featureIds to enable instance picking mode.
  const removeFeatureIdsFromTile = (tile) => delete tile.content.featureIds;

  const validateTile = (tile) => {
    const newWarnings = handleValidateTile(tile);

    if (newWarnings.length) {
      setWarnings((prevValues) => [...prevValues, ...newWarnings]);
    }
  };

  const getBoundingVolumeColor = (tile) => {
    const { boundingVolumeColorMode } = debugOptions;

    const color =
      colorMap.getColor(tile, { coloredBy: boundingVolumeColorMode }) ||
      DEFAULT_COLOR;

    return [...color, DEFAULT_BG_OPACITY];
  };

  const getMeshColor = (tile) => {
    const { tileColorMode } = debugOptions;

    return (
      colorMap?.getColor(tile, {
        coloredBy: tileColorMode,
        // @ts-expect-error
        selectedTileId: selectedTile?.id,
        coloredTilesMap,
      }) || DEFAULT_COLOR
    );
  };

  const getAllTilesFromTilesets = (tilesets) => {
    const allTiles = tilesets.map((tileset) => tileset.tiles);
    return allTiles.flat();
  };

  const toggleTerrain = () => setUseTerrainLayer((prevValue) => !prevValue);

  const onToggleBuildingExplorer = () => {
    setShowBuildingExplorer((prevValue) => !prevValue);
  };

  const onTerrainTileLoad = (tile) => {
    const {
      bbox: { east, north, south, west },
    } = tile;

    setTerrainTiles((prevValues) => ({
      ...prevValues,
      [`${east};${north};${south};${west}`]: tile,
    }));
  };

  const renderTerrainLayer = () => {
    return new TerrainLayer({
      id: "terrain",
      maxZoom: TERRAIN_LAYER_MAX_ZOOM,
      elevationDecoder: MAPZEN_ELEVATION_DECODE_PARAMETERS,
      elevationData: MAPZEN_TERRAIN_IMAGES,
      texture: ARCGIS_STREET_MAP_SURFACE_IMAGES,
      onTileLoad: (tile) => onTerrainTileLoad(tile),
      color: [255, 255, 255],
    });
  };

  const renderMainOnMinimap = () => {
    const { minimapViewport } = debugOptions;

    if (!minimapViewport) {
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
      getFillColor: (d) => [255, 140, 0, 100],
      getLineColor: (d) => [0, 0, 0, 120],
    });
  };

  const renderLayers = () => {
    const { boundingVolume, boundingVolumeType, pickable, wireframe } =
      debugOptions;
    const loadOptions = {
      i3s: { coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS },
    };

    if (token) {
      // @ts-expect-error
      loadOptions.i3s = { ...loadOptions.i3s, token };
    }
    // // @ts-expect-error
    // setColorMap((prevValue) => prevValue || new ColorMap());
    const tiles = getAllTilesFromTilesets(loadedTilesets);
    const viewport = new WebMercatorViewport(viewState.main);
    const frustumBounds = getFrustumBounds(viewport);

    const tile3dLayers = flattenedSublayers
      // @ts-expect-error
      .filter((sublayer) => sublayer.visibility)
      .map(
        (sublayer) =>
          new Tile3DLayer({
            // @ts-expect-error
            id: `tile-layer-${sublayer.id}`,
            // @ts-expect-error
            data: sublayer.url,
            loader: I3SLoader,
            onTilesetLoad,
            onTileLoad,
            onTileUnload,
            loadOptions,
            pickable,
            autoHighlight: true,
            _subLayerProps: {
              mesh: {
                wireframe,
              },
            },
            _getMeshColor: getMeshColor,
          })
      );

    if (useTerrainLayer) {
      const terrainLayer = renderTerrainLayer();
      tile3dLayers.push(terrainLayer);
    }

    return [
      ...tile3dLayers,
      new LineLayer({
        id: "frustum",
        data: frustumBounds,
        getSourcePosition: (d) => d.source,
        getTargetPosition: (d) => d.target,
        getColor: (d) => d.color,
        getWidth: 2,
      }),
      // @ts-expect-error
      new BoundingVolumeLayer({
        id: "bounding-volume-layer",
        visible: boundingVolume,
        tiles,
        getBoundingVolumeColor,
        boundingVolumeType,
      }),
      new LineLayer({
        id: "normals-debug",
        data: normalsDebugData,
        getSourcePosition: (_, { index, data }) =>
          getNormalSourcePosition(index, data, trianglesPercentage),
        getTargetPosition: (_, { index, data }) =>
          getNormalTargetPosition(
            index,
            data,
            trianglesPercentage,
            normalsLength
          ),
        getColor: () => NORMALS_COLOR,
        // @ts-expect-error
        modelMatrix: normalsDebugData.cartographicModelMatrix,
        // @ts-expect-error
        coordinateOrigin: normalsDebugData.cartographicOrigin,
        coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
        getWidth: 1,
      }),
      renderMainOnMinimap(),
    ];
  };

  const renderStats = () => {
    const { controlPanel } = debugOptions;
    // TODO - too verbose, get more default styling from stats widget?
    return (
      <StatsWidgetContainer
        renderControlPanel={controlPanel}
        ref={(_) => (statsWidgetContainer = _)}
      />
    );
  };

  const renderMemory = () => {
    const { showMemory } = debugOptions;
    return (
      <StatsWidgetWrapper showMemory={showMemory}>
        {renderStats()}
      </StatsWidgetWrapper>
    );
  };

  const renderDebugPanel = () => {
    const { controlPanel } = debugOptions;

    return (
      <DebugPanel
        onDebugOptionsChange={handleSetDebugOptions}
        clearWarnings={handleClearWarnings}
        debugTextureImage={UV_DEBUG_TEXTURE_URL}
        debugOptions={debugOptions}
        renderControlPanel={controlPanel}
        hasBuildingExplorer={Boolean(sublayers.length)}
      ></DebugPanel>
    );
  };

  const updateSublayerVisibility = (sublayer) => {
    if (sublayer.layerType === "3DObject") {
      const flattenedSublayer = flattenedSublayers.find(
        // @ts-expect-error
        (fSublayer) => fSublayer.id === sublayer.id
      );

      if (flattenedSublayer) {
        // @ts-expect-error
        flattenedSublayer.visibility = sublayer.visibility;
        setSublayersUpdateCounter((prevValue) => prevValue + 1);

        if (!sublayer.visibility) {
          setLoadedTilesets((prevValues) =>
            prevValues.filter(
              // @ts-expect-error
              (tileset) => tileset.basePath !== flattenedSublayer.url
            )
          );
        }
      }
    }
  };

  const renderControlPanel = () => {
    return (
      <ControlPanel
        debugMode
        name={name}
        onExampleChange={onSelectTileset}
        onMapStyleChange={onSelectMapStyle}
        selectedMapStyle={selectedMapStyle}
        useTerrainLayer={useTerrainLayer}
        toggleTerrain={toggleTerrain}
      />
    );
  };

  const renderInfo = () => {
    const { minimap, showFullInfo } = debugOptions;

    return (
      <MapInfoPanel
        showFullInfo={showFullInfo}
        metadata={metadata}
        token={token}
        isMinimapShown={minimap}
      />
    );
  };

  const renderToolPanel = () => (
    <ToolBar
      onDebugOptionsChange={handleSetDebugOptions}
      debugOptions={debugOptions}
    />
  );

  const renderBuildingExplorer = () => {
    return (
      <BuildingExplorer
        sublayers={sublayers}
        onToggleBuildingExplorer={onToggleBuildingExplorer}
        onUpdateSublayerVisibility={updateSublayerVisibility}
        isShown={showBuildingExplorer}
        debugMode
        isControlPanelShown={controlPanel}
      />
    );
  };

  const layerFilter = ({ layer, viewport }) => {
    const { minimapViewport } = debugOptions;
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
      minimapViewport &&
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

  const getTooltip = (info) => {
    if (!info.object || info.index < 0 || !info.layer) {
      return null;
    }
    const tileInfo = getShortTileDebugInfo(info.object);
    // eslint-disable-next-line no-undef
    const tooltip = document.createElement("div");
    render(<AttributesTooltip data={tileInfo} />, tooltip);

    return { html: tooltip.innerHTML };
  };

  const handleClick = (info) => {
    if (!info.object) {
      handleClosePanel();
      return;
    }
    const tileInfo = getTileDebugInfo(info.object);
    // @ts-expect-error
    setTileInfo(tileInfo);
    setNormalsDebugData([]);
    setSelectedTile(info.object);
  };

  const handleClosePanel = () => {
    setTileInfo(null);
    setSelectedTile(null);
    setNormalsDebugData([]);
  };

  const handleSelectTileColor = (tileId, selectedColor) => {
    const color = getRGBValueFromColorObject(selectedColor);
    const updatedMap = {
      ...coloredTilesMap,
      ...{ [tileId]: color },
    };
    setColoredTilesMap(updatedMap);
  };

  const handleResetColor = (tileId) => {
    const updatedColoredMap = { ...coloredTilesMap };
    delete updatedColoredMap[tileId];
    setColoredTilesMap(updatedColoredMap);
  };

  const getResetButtonStyle = (isResetButtonDisabled) => {
    return {
      display: "flex",
      padding: "4px 16px",
      borderRadius: "8px",
      alignItems: "center",
      height: "27px",
      fontWeight: "bold",
      marginTop: "10px",
      cursor: isResetButtonDisabled ? "auto" : "pointer",
      color: isResetButtonDisabled ? "rgba(255,255,255,.6)" : "white",
      background: isResetButtonDisabled ? "#0E111A" : "#4F52CC",
    };
  };

  const handleClearWarnings = () => setWarnings([]);

  const handleShowNormals = (tile) =>
    // @ts-expect-error
    setNormalsDebugData(() =>
      !normalsDebugData.length ? generateBinaryNormalsDebugData(tile) : []
    );

  const handleChangeTrianglesPercentage = (tile, newValue) => {
    if (normalsDebugData.length) {
      // @ts-expect-error
      setNormalsDebugData(generateBinaryNormalsDebugData(tile));
    }

    const percent = validateTrianglesPercentage(newValue);
    setTrianglesPercentage(percent);
  };

  const handleChangeNormalsLength = (tile, newValue) => {
    if (normalsDebugData.length) {
      // @ts-expect-error
      setNormalsDebugData(generateBinaryNormalsDebugData(tile));
    }

    setNormalsLength(newValue);
  };

  const validateTrianglesPercentage = (newValue) => {
    if (newValue < 0) {
      return 1;
    } else if (newValue > 100) {
      return 100;
    }
    return newValue;
  };

  const renderAttributesPanel = () => {
    const isShowColorPicker = debugOptions.tileColorMode === COLORED_BY.CUSTOM;
    // @ts-expect-error
    const tileId = tileInfo["Tile Id"];
    const tileSelectedColor = makeRGBObjectFromColor(coloredTilesMap[tileId]);
    const isResetButtonDisabled = !coloredTilesMap[tileId];
    // @ts-expect-error
    const title = `Tile: ${selectedTile.id}`;

    return (
      // @ts-expect-error
      <AttributesPanel
        title={title}
        handleClosePanel={handleClosePanel}
        attributesObject={tileInfo}
        selectTileColor={handleSelectTileColor}
        isControlPanelShown={debugOptions.controlPanel}
      >
        <TileValidator
          tile={selectedTile}
          showNormals={Boolean(normalsDebugData.length)}
          trianglesPercentage={trianglesPercentage}
          normalsLength={normalsLength}
          handleShowNormals={handleShowNormals}
          handleChangeTrianglesPercentage={handleChangeTrianglesPercentage}
          handleChangeNormalsLength={handleChangeNormalsLength}
        />
        {isShowColorPicker && (
          <div style={CURSOR_STYLE}>
            <h3 style={HEADER_STYLE}>{TILE_COLOR_SELECTOR}</h3>
            <HuePicker
              width={"auto"}
              color={tileSelectedColor}
              onChange={(color) => handleSelectTileColor(tileId, color)}
            />
            <MaterialPicker
              styles={MATERIAL_PICKER_STYLE}
              color={tileSelectedColor}
              onChange={(color) => handleSelectTileColor(tileId, color)}
            />
            <button
              disabled={isResetButtonDisabled}
              style={getResetButtonStyle(isResetButtonDisabled)}
              onClick={() => handleResetColor(tileId)}
            >
              Reset
            </button>
          </div>
        )}
      </AttributesPanel>
    );
  };

  const renderSemanticValidator = () => {
    return (
      <SemanticValidator
        warnings={warnings}
        clearWarnings={handleClearWarnings}
      />
    );
  };

  const layers = renderLayers();
  const { debugPanel, showFullInfo, controlPanel, semanticValidator } =
    debugOptions;

  return (
    <>
      {renderToolPanel()}
      {renderMemory()}
      {debugPanel && renderDebugPanel()}
      {showFullInfo && renderInfo()}
      {controlPanel && renderControlPanel()}
      {selectedTile && tileInfo && renderAttributesPanel()}
      {semanticValidator && renderSemanticValidator()}
      {Boolean(sublayers?.length) && renderBuildingExplorer()}
      <DeckGL
        layers={layers}
        viewState={getViewState()}
        views={getViews()}
        layerFilter={layerFilter}
        onViewStateChange={onViewStateChange}
        controller={{
          type: MapController,
          maxPitch: 60,
          inertia: true,
          scrollZoom: { speed: 0.01, smooth: true },
        }}
        onAfterRender={() => updateStatWidgets()}
        getTooltip={(info) => getTooltip(info)}
        onClick={(info) => handleClick(info)}
      >
        {!useTerrainLayer && (
          <StaticMap
            reuseMaps
            mapStyle={selectedMapStyle}
            preventStyleDiffing={true}
          />
        )}
        <View id="minimap">
          <StaticMap
            reuseMaps
            mapStyle={CONTRAST_MAP_STYLES[selectedMapStyle]}
            preventStyleDiffing={true}
          />
        </View>
      </DeckGL>
    </>
  );
};
