import { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { StaticMap } from "react-map-gl";
import styled from "styled-components";

import { load } from "@loaders.gl/core";
import { lumaStats } from "@luma.gl/core";
import DeckGL from "@deck.gl/react";
import {
  MapController,
  FlyToInterpolator,
  COORDINATE_SYSTEM,
  MapView,
} from "@deck.gl/core";
import { TerrainLayer, Tile3DLayer } from "@deck.gl/geo-layers";
import {
  I3SLoader,
  I3SBuildingSceneLayerLoader,
  loadFeatureAttributes,
} from "@loaders.gl/i3s";
import { StatsWidget } from "@probe.gl/stats-widget";

import {
  ControlPanel,
  AttributesPanel,
  BuildingExplorer,
} from "../../components";
import {
  parseTilesetUrlFromUrl,
  parseTilesetUrlParams,
  buildSublayersTree,
  initStats,
  sumTilesetsStats,
  getElevationByCentralTile,
} from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { INITIAL_EXAMPLE_NAME, EXAMPLES } from "../../constants/i3s-examples";
import { INITIAL_MAP_STYLE } from "../../constants/map-styles";

const TRANSITION_DURAITON = 4000;

const INITIAL_VIEW_STATE = {
  longitude: -120,
  latitude: 34,
  height: 600,
  width: 800,
  pitch: 45,
  maxPitch: 90,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  zoom: 14.5,
  transitionDuration: 0,
  transitionInterpolator: null,
};

const VIEW = new MapView({
  id: "main",
  controller: { inertia: true },
  farZMultiplier: 2.02,
});

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

const StatsWidgetWrapper = styled.div`
  display: flex;
`;

const StatsWidgetContainer = styled.div`
  display: ${(props) => (props.showBuildingExplorer ? "none" : "flex")};
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  top: ${(props) => (props.hasSublayers ? "260px" : "200px")};
  background: #0e111a;
  color: white;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: left;
  color: rgba(255, 255, 255, 0.6);
  z-index: 3;
  bottom: 15px;
  word-break: break-word;
  padding: 24px;
  border-radius: 8px;
  line-height: 135%;
  bottom: auto;
  width: 277px;
  left: 10px;
  max-height: calc(100% - 280px);
  overflow: auto;
`;

export const I3SApp = () => {
  let statsWidgetContainer = useRef(null);

  // TODO init types
  let currentViewport = null;

  const [tileset, setTileset] = useState(null);
  const [token, setToken] = useState(null);
  const [name, setName] = useState(INITIAL_EXAMPLE_NAME);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [selectedMapStyle, setSelectedMapStyle] = useState(INITIAL_MAP_STYLE);
  const [selectedFeatureAttributes, setSelectedFeatureAttributes] =
    useState(null);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(-1);
  const [selectedTilesetBasePath, setSelectedTilesetBasePath] = useState(null);
  const [isAttributesLoading, setAttributesLoading] = useState(false);
  const [showBuildingExplorer, setShowBuildingExplorer] = useState(false);
  const [flattenedSublayers, setFlattenedSublayers] = useState([]);
  const [sublayers, setSublayers] = useState([]);
  const [tilesetsStats, setTilesetsStats] = useState(initStats());
  const [useTerrainLayer, setUseTerrainLayer] = useState(false);
  const [terrainTiles, setTerrainTiles] = useState({});
  const [metadata, setMetadata] = useState({ layers: [] });
  const [needTransitionToTileset, setNeedTransitionToTileset] = useState(true);

  const [memWidget, setMemWidget] = useState(null);
  const [tilesetStatsWidget, setTilesetStatsWidget] = useState(null);
  const [loadedTilesets, setLoadedTilesets] = useState([]);
  const tilesetUrl = parseTilesetUrlFromUrl();

  useEffect(() => {
    const memoryUsage = lumaStats.get("Memory Usage");
    const memWidget = new StatsWidget(memoryUsage, {
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
    setMemWidget(memWidget);

    // Check if a tileset is specified in the query params
    let tileset;
    if (tilesetUrl) {
      tileset = { url: tilesetUrl };
    } else {
      tileset = EXAMPLES[INITIAL_EXAMPLE_NAME];
    }

    // @ts-expect-error
    const tilesetStatsWidget = new StatsWidget(null, {
      container: statsWidgetContainer,
    });
    // @ts-expect-error
    setTilesetStatsWidget(tilesetStatsWidget);

    onSelectTileset(tileset);
  }, []);

  /**
   * Calls on tileset is selected
   * @param tileset
   */
  const onSelectTileset = async (tileset) => {
    const params = parseTilesetUrlParams(tileset.url, tileset);
    const { tilesetUrl, token, name, metadataUrl } = params;
    setName(name);
    setToken(token);
    setSublayers([]);
    const metadata = await fetch(metadataUrl).then((resp) => resp.json());
    const flattenedSublayers = await getFlattenedSublayers(tilesetUrl);
    setMetadata(metadata);
    setSelectedFeatureAttributes(null);
    setFlattenedSublayers(flattenedSublayers);

    setLoadedTilesets([]);
    setNeedTransitionToTileset(true);

    const tilesetsStats = initStats(tilesetUrl);
    setTilesetsStats(tilesetsStats);
    // @ts-expect-error
    !!tilesetStatsWidget && tilesetStatsWidget.setStats(tilesetsStats);
    setShowBuildingExplorer(false);
  };

  /**
   * Tries to get Building Scene Layer sublayer urls if exists.
   * @param {string} tilesetUrl
   * @returns {string[]} Sublayer urls or tileset url.
   * TODO Add filtration mode for sublayers which were selected by user.
   */
  const getFlattenedSublayers = async (tilesetUrl) => {
    try {
      const tileset = await load(tilesetUrl, I3SBuildingSceneLayerLoader);
      const sublayersTree = buildSublayersTree(tileset.header.sublayers);
      setSublayers(sublayersTree.sublayers);
      const sublayers = tileset?.sublayers.filter(
        (sublayer) => sublayer.name !== "Overview"
      );
      return sublayers;
    } catch (e) {
      return [{ url: tilesetUrl, visibility: true }];
    }
  };

  /**
   * Updates stats, called every frame
   */
  const updateStatWidgets = () => {
    // @ts-expect-error
    memWidget.update();

    sumTilesetsStats(loadedTilesets, tilesetsStats);
    // @ts-expect-error
    tilesetStatsWidget.update();
  };

  const onTilesetLoad = (tileset) => {
    // @ts-expect-error
    setLoadedTilesets((prevValues) => [...prevValues, tileset]);

    if (needTransitionToTileset) {
      const { zoom, cartographicCenter } = tileset;
      const [longitude, latitude] = cartographicCenter;
      const viewport = currentViewport;
      let pLongitue = longitude;
      let pLatitude = latitude;

      if (viewport) {
        const { pitch, bearing } = viewState;
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
        // @ts-expect-error
        const projectedPostion = viewport.projectPosition([
          longitude,
          latitude,
        ]);
        /**
         * Shift longitude
         */
        projectedPostion[0] +=
          projection *
          Math.sin((bearing * Math.PI) / 180) *
          // @ts-expect-error
          viewport.distanceScales.unitsPerMeter[0];
        /**
         * Shift latitude
         */
        projectedPostion[1] +=
          projection *
          Math.cos((bearing * Math.PI) / 180) *
          // @ts-expect-error
          viewport.distanceScales.unitsPerMeter[1];
        /**
         * Convert resulting coordinates to catrographic
         */
        // @ts-expect-error
        [pLongitue, pLatitude] = viewport.unprojectPosition(projectedPostion);
      }

      const newViewState = {
        ...viewState,
        zoom: zoom + 2.5,
        longitude: pLongitue,
        latitude: pLatitude,
      };

      setTileset(tileset);
      setViewState({
        ...newViewState,
        transitionDuration: TRANSITION_DURAITON,
        transitionInterpolator: new FlyToInterpolator(),
      });
      setNeedTransitionToTileset(false);
    }
  };

  const onViewStateChange = ({ interactionState, viewState }) => {
    let { longitude, latitude, position } = viewState;

    const [x, y, oldElevation] = position || [0, 0, 0];
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

    setViewState({
      ...viewState,
      position: [0, 0, elevation],
    });
  };

  const onSelectMapStyle = ({ selectedMapStyle }) => {
    setSelectedMapStyle(selectedMapStyle);
  };

  const toggleTerrain = () => {
    setUseTerrainLayer((prevValue) => !prevValue);
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

  const isLayerPickable = () => {
    // @ts-expect-error
    const layerType = tileset?.tileset?.layerType;

    switch (layerType) {
      case "IntegratedMesh":
        return false;
      default:
        return true;
    }
  };

  const renderLayers = () => {
    const loadOptions = {
      i3s: { coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS },
    };

    if (token) {
      // @ts-expect-error
      loadOptions.i3s = { ...loadOptions.i3s, token };
    }

    const layers = flattenedSublayers
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
            onTilesetLoad: onTilesetLoad,
            onTileLoad: () => updateStatWidgets(),
            onTileUnload: () => updateStatWidgets(),
            pickable: isLayerPickable(),
            loadOptions,
            highlightedObjectIndex:
              // @ts-expect-error
              sublayer.url === selectedTilesetBasePath
                ? selectedFeatureIndex
                : -1,
          })
      );

    if (useTerrainLayer) {
      const terrainLayer = renderTerrainLayer();
      layers.push(terrainLayer);
    }

    return layers;
  };

  const handleClosePanel = () => {
    setSelectedFeatureAttributes(null);
    setSelectedFeatureIndex(-1);
  };

  const handleClick = async (info) => {
    if (!info.object || info.index < 0 || !info.layer) {
      handleClosePanel();
      return;
    }

    const options = { i3s: {} };

    if (token) {
      options.i3s = { token };
    }

    setAttributesLoading(true);
    const selectedFeatureAttributes = await loadFeatureAttributes(
      info.object,
      info.index,
      options
    );
    setAttributesLoading(false);

    const selectedTilesetBasePath = info.object.tileset.basePath;
    // @ts-expect-error
    setSelectedFeatureAttributes(selectedFeatureAttributes);
    setSelectedFeatureIndex(info.index);
    setSelectedTilesetBasePath(selectedTilesetBasePath);
  };

  const renderStats = () => {
    // TODO - too verbose, get more default styling from stats widget?
    return (
      <StatsWidgetContainer
        hasSublayers={Boolean(sublayers.length)}
        showBuildingExplorer={showBuildingExplorer}
        ref={(_) => (statsWidgetContainer = _)}
      />
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

  const onToggleBuildingExplorer = () => {
    setShowBuildingExplorer((prevValue) => !prevValue);
  };

  const renderControlPanel = () => {
    return (
      <ControlPanel
        name={name}
        onExampleChange={onSelectTileset}
        onMapStyleChange={onSelectMapStyle}
        selectedMapStyle={selectedMapStyle}
        useTerrainLayer={useTerrainLayer}
        toggleTerrain={toggleTerrain}
      ></ControlPanel>
    );
  };

  const renderBuildingExplorer = () => {
    return (
      <BuildingExplorer
        sublayers={sublayers}
        onToggleBuildingExplorer={onToggleBuildingExplorer}
        onUpdateSublayerVisibility={updateSublayerVisibility}
        isShown={showBuildingExplorer}
      />
    );
  };

  const getTooltip = () => {
    if (isAttributesLoading) {
      // eslint-disable-next-line no-undef
      const tooltip = document.createElement("div");
      render(<FontAwesomeIcon icon={faSpinner} />, tooltip);
      return { html: tooltip.innerHTML };
    }

    return null;
  };

  const renderAttributesPanel = () => {
    const title =
      // @ts-expect-error
      selectedFeatureAttributes.NAME || selectedFeatureAttributes.OBJECTID;

    return (
      <AttributesPanel
        title={title}
        handleClosePanel={handleClosePanel}
        attributesObject={selectedFeatureAttributes}
        isControlPanelShown
      />
    );
  };

  const renderMemory = () => {
    return (
      <StatsWidgetWrapper showMemory={!showBuildingExplorer}>
        {renderStats()}
      </StatsWidgetWrapper>
    );
  };

  const layers = renderLayers();

  return (
    <>
      {renderControlPanel()}
      {selectedFeatureAttributes && renderAttributesPanel()}
      {Boolean(sublayers?.length) && renderBuildingExplorer()}
      {renderMemory()}
      <DeckGL
        layers={layers}
        viewState={viewState}
        views={[VIEW]}
        onViewStateChange={onViewStateChange}
        controller={{
          type: MapController,
          maxPitch: 60,
          inertia: true,
          scrollZoom: { speed: 0.01, smooth: true },
        }}
        onAfterRender={() => updateStatWidgets()}
        getTooltip={() => getTooltip()}
        onClick={(info) => handleClick(info)}
      >
        {({ viewport }) => {
          currentViewport = viewport;
        }}
        {!useTerrainLayer && (
          <StaticMap mapStyle={selectedMapStyle} preventStyleDiffing />
        )}
      </DeckGL>
    </>
  );
};
