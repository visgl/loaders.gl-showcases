import type { Tile3D, Tileset3D } from "@loaders.gl/tiles";
import type {
  LayerExample,
  NormalsDebugData,
  TileWarning,
  Sublayer,
} from "../../types";

import { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { HuePicker, MaterialPicker } from "react-color";
import styled from "styled-components";

import { lumaStats } from "@luma.gl/core";
import { PickingInfo } from "@deck.gl/core";

import { load } from "@loaders.gl/core";
import { I3SBuildingSceneLayerLoader, SceneLayer3D } from "@loaders.gl/i3s";
import { StatsWidget } from "@probe.gl/stats-widget";

import { useForceUpdate } from "../../utils";
import {
  EXAMPLES,
  CUSTOM_EXAMPLE_VALUE,
  INITIAL_EXAMPLE,
} from "../../constants/i3s-examples";

import {
  INITIAL_MAP_STYLE,
  INITIAL_TILE_COLOR_MODE,
  INITIAL_BOUNDING_VOLUME_COLOR_MODE,
  INITIAL_BOUNDING_VOLUME_TYPE,
} from "../../constants/map-styles";

import {
  COLORED_BY,
  makeRGBObjectFromColor,
  getRGBValueFromColorObject,
  parseTilesetFromUrl,
  parseTilesetUrlParams,
  ColorMap,
  validateTile as handleValidateTile,
  generateBinaryNormalsDebugData,
  buildSublayersTree,
  initStats,
  sumTilesetsStats,
} from "../../utils";

import {
  ControlPanel,
  DebugPanel,
  MapInfoPanel,
  SemanticValidator,
  ToolBar,
  TileValidator,
  BuildingExplorer,
} from "../../components";

import { TileTooltip } from "../../components/debug/tile-tooltip/tile-tooltip";

import { Color, Font } from "../../constants/common";
import {
  color_brand_primary,
  color_canvas_inverted,
} from "../../constants/colors";
import { TileDetailsPanel } from "../../components/tile-details-panel/tile-details-panel";
import { TileMetadata } from "../../components/debug/tile-metadata/tile-metadata";
import { DeckGlI3s } from "../../components/deck-gl-i3s/deck-gl-i3s";

const DEFAULT_TRIANGLES_PERCENTAGE = 30; // Percentage of triangles to show normals for.
const DEFAULT_NORMALS_LENGTH = 20; // Normals length in meters
const UV_DEBUG_TEXTURE_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/images/uv-debug-texture.jpg";

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

const TILE_COLOR_SELECTOR = "Tile Color Selector";

const HEADER_STYLE = {
  color: color_canvas_inverted,
};

const CURSOR_STYLE = {
  cursor: "pointer",
};

const StatsWidgetWrapper = styled.div<{ showMemory: boolean }>`
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

const colorMap = new ColorMap();
/**
 * TODO: Add types to component
 */
export const DebugApp = () => {
  const forceUpdate = useForceUpdate();
  let statsWidgetContainer = useRef(null);
  const [metadata, setMetadata] = useState<{ layers: SceneLayer3D[] } | null>(
    null
  );
  const [token, setToken] = useState<string | null>(null);
  const [selectedMapStyle, setSelectedMapStyle] = useState(INITIAL_MAP_STYLE);
  const [debugOptions, setDebugOptions] = useState(INITIAL_DEBUG_OPTIONS_STATE);
  const [normalsDebugData, setNormalsDebugData] =
    useState<NormalsDebugData | null>(null);
  const [trianglesPercentage, setTrianglesPercentage] = useState(
    DEFAULT_TRIANGLES_PERCENTAGE
  );
  const [normalsLength, setNormalsLength] = useState(DEFAULT_NORMALS_LENGTH);
  const [selectedTile, setSelectedTile] = useState<Tile3D | null>(null);
  const [coloredTilesMap, setColoredTilesMap] = useState({});
  const [warnings, setWarnings] = useState<TileWarning[]>([]);
  const [flattenedSublayers, setFlattenedSublayers] = useState<Tile3D[]>([]);
  const [sublayers, setSublayers] = useState<Sublayer[]>([]);
  const [tilesetsStats, setTilesetsStats] = useState(initStats());
  const [useTerrainLayer, setUseTerrainLayer] = useState(false);
  const [loadedTilesets, setLoadedTilesets] = useState<Tileset3D[]>([]);
  const [showBuildingExplorer, setShowBuildingExplorer] = useState(false);
  const [memWidget, setMemWidget] = useState<StatsWidget | null>(null);
  const [tilesetStatsWidget, setTilesetStatsWidget] =
    useState<StatsWidget | null>(null);

  const initMainTileset = (): LayerExample => {
    const tilesetParam = parseTilesetFromUrl();

    if (tilesetParam?.startsWith("http")) {
      return {
        id: tilesetParam,
        name: CUSTOM_EXAMPLE_VALUE,
        url: tilesetParam,
      };
    }

    const namedExample = EXAMPLES.find(({ id }) => tilesetParam === id);
    if (namedExample) {
      return namedExample;
    }

    return INITIAL_EXAMPLE;
  };

  const [mainTileset, setMainTileset] = useState(initMainTileset());

  /**
   * Initialize stats widgets
   */
  useEffect(() => {
    const lumaStatistics = lumaStats.get("Memory Usage");
    const memWidget = new StatsWidget(lumaStatistics, {
      framesPerUpdate: 1,
      formatters: {
        "GPU Memory": "memory",
        "Buffer Memory": "memory",
        "Renderbuffer Memory": "memory",
        "Texture Memory": "memory",
      },
      // @ts-expect-error - Type 'MutableRefObject<null>' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, dir, and 275 more.
      container: statsWidgetContainer,
    });

    setMemWidget(memWidget);

    // @ts-expect-error - Argument of type 'null' is not assignable to parameter of type 'Stats'.
    const tilesetStatsWidget = new StatsWidget(null, {
      container: statsWidgetContainer,
      formatters: {
        "Tile Memory Use": "memory",
      },
    });
    setTilesetStatsWidget(tilesetStatsWidget);
  }, []);

  /**
   * Hook for start using tilesets stats.
   */
  useEffect(() => {
    const tilesetsStats = initStats(mainTileset.url);

    tilesetStatsWidget && tilesetStatsWidget.setStats(tilesetsStats);
    setTilesetsStats(tilesetsStats);
  }, [loadedTilesets]);

  /**
   * Hook to call multiple changing function based on selected tileset.
   */
  useEffect(() => {
    async function fetchMetadata(metadataUrl) {
      const metadata = await fetch(metadataUrl).then((resp) => resp.json());
      setMetadata(metadata);
    }

    async function fetchFlattenedSublayers(tilesetUrl) {
      const flattenedSublayers = await getFlattenedSublayers(tilesetUrl);
      setFlattenedSublayers(flattenedSublayers);
    }

    const params = parseTilesetUrlParams(mainTileset.url, mainTileset);
    const { tilesetUrl, token, metadataUrl } = params;

    fetchMetadata(metadataUrl);
    fetchFlattenedSublayers(tilesetUrl);

    setToken(token);
    setSublayers([]);
    handleClearWarnings();
    setNormalsDebugData(null);
    setLoadedTilesets([]);
    colorMap._resetColorsMap();
    setColoredTilesMap({});
    setSelectedTile(null);

    setDebugOptions(INITIAL_DEBUG_OPTIONS_STATE);
  }, [mainTileset]);

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
      setSublayers(sublayersTree?.sublayers || []);
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
    memWidget && memWidget.update();
    sumTilesetsStats(loadedTilesets, tilesetsStats);
    tilesetStatsWidget && tilesetStatsWidget.update();
  };

  const onTileLoad = (tile) => {
    updateStatWidgets();
    validateTile(tile);
  };

  const onTileUnload = () => updateStatWidgets();

  const onTilesetLoad = (tileset: Tileset3D) => {
    setLoadedTilesets((prevValues: Tileset3D[]) => [...prevValues, tileset]);
  };

  const onSelectMapStyle = ({ selectedMapStyle }) =>
    setSelectedMapStyle(selectedMapStyle);

  const handleSetDebugOptions = (newDebugOptions) => {
    const updatedDebugOptions = { ...debugOptions, ...newDebugOptions };

    if (updatedDebugOptions.tileColorMode !== COLORED_BY.CUSTOM) {
      setColoredTilesMap({});
      setSelectedTile(null);
    }

    const { debugPanel } = debugOptions;
    const { debugPanel: newDebugPanel } = updatedDebugOptions;

    if (debugPanel !== newDebugPanel && newDebugPanel) {
      updatedDebugOptions.buildingExplorer = false;
    }
    setDebugOptions(updatedDebugOptions);
  };

  const validateTile = (tile) => {
    const newWarnings = handleValidateTile(tile);

    if (newWarnings.length) {
      setWarnings((prevValues) => [...prevValues, ...newWarnings]);
    }
  };

  const toggleTerrain = () => setUseTerrainLayer((prevValue) => !prevValue);

  const onToggleBuildingExplorer = () => {
    setShowBuildingExplorer((prevValue) => !prevValue);
  };

  const renderStats = () => {
    return (
      <StatsWidgetContainer
        // @ts-expect-error - Type 'HTMLDivElement | null' is not assignable to type 'MutableRefObject<null>'
        ref={(_) => (statsWidgetContainer = _)}
      />
    );
  };

  const renderMemory = () => {
    const { showMemory } = debugOptions;
    return (
      <StatsWidgetWrapper id="stats-widget" showMemory={showMemory}>
        {renderStats()}
      </StatsWidgetWrapper>
    );
  };

  const renderDebugPanel = () => {
    const { controlPanel } = debugOptions;

    return (
      <DebugPanel
        onDebugOptionsChange={handleSetDebugOptions}
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
        (fSublayer) => fSublayer.id === sublayer.id
      );

      if (flattenedSublayer) {
        flattenedSublayer.visibility = sublayer.visibility;
        forceUpdate();

        if (!sublayer.visibility) {
          setLoadedTilesets((prevValues) =>
            prevValues.filter(
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
        tileset={mainTileset}
        onExampleChange={setMainTileset}
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

  const getTooltip = (info: { object: Tile3D; index: number; layer: any }) => {
    if (!info.object || info.index < 0 || !info.layer) {
      return null;
    }
    // eslint-disable-next-line no-undef
    const tooltip = document.createElement("div");
    render(<TileTooltip tile={info.object} />, tooltip);

    return { html: tooltip.innerHTML };
  };

  const handleClick = (info: PickingInfo) => {
    if (!info.object) {
      handleClosePanel();
      return;
    }
    setNormalsDebugData(null);
    setSelectedTile(info.object);
  };

  const handleClosePanel = () => {
    setSelectedTile(null);
    setNormalsDebugData(null);
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
      color: isResetButtonDisabled
        ? "rgba(255,255,255,.6)"
        : color_canvas_inverted,
      background: isResetButtonDisabled ? color_brand_primary : "#4F52CC",
    };
  };

  const handleClearWarnings = () => setWarnings([]);

  const handleShowNormals = (tile) => {
    if (normalsDebugData === null) {
      setNormalsDebugData(generateBinaryNormalsDebugData(tile));
    } else {
      setNormalsDebugData(null);
    }
  };

  const handleChangeTrianglesPercentage = (tile, newValue) => {
    if (normalsDebugData?.length) {
      setNormalsDebugData(generateBinaryNormalsDebugData(tile));
    }

    const percent = validateTrianglesPercentage(newValue);
    setTrianglesPercentage(percent);
  };

  const handleChangeNormalsLength = (tile, newValue) => {
    if (normalsDebugData?.length) {
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

  const renderTilePanel = () => {
    if (!selectedTile) {
      return null;
    }

    const isShowColorPicker = debugOptions.tileColorMode === COLORED_BY.CUSTOM;

    const tileId = selectedTile.id;
    const tileSelectedColor = makeRGBObjectFromColor(coloredTilesMap[tileId]);
    const isResetButtonDisabled = !coloredTilesMap[tileId];
    const title = `Tile: ${selectedTile.id}`;

    return (
      <TileDetailsPanel title={title} handleClosePanel={handleClosePanel}>
        <TileMetadata tile={selectedTile}></TileMetadata>
        <TileValidator
          tile={selectedTile}
          showNormals={Boolean(normalsDebugData)}
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
      </TileDetailsPanel>
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

  const getI3sLayers = () => {
    return flattenedSublayers
      .filter((sublayer) => sublayer.visibility)
      .map((sublayer) => ({
        id: sublayer.id,
        url: sublayer.url,
        token,
      }));
  };

  const {
    debugPanel,
    showFullInfo,
    controlPanel,
    semanticValidator,
    minimap,
    minimapViewport,
    tileColorMode,
    boundingVolume,
    boundingVolumeType,
    boundingVolumeColorMode,
    pickable,
    wireframe,
    showUVDebugTexture,
    loadTiles,
  } = debugOptions;
  return (
    <>
      {renderToolPanel()}
      {renderMemory()}
      {debugPanel && renderDebugPanel()}
      {showFullInfo && renderInfo()}
      {controlPanel && renderControlPanel()}
      {renderTilePanel()}
      {semanticValidator && renderSemanticValidator()}
      {Boolean(sublayers?.length) && renderBuildingExplorer()}
      <DeckGlI3s
        showMinimap={minimap}
        createIndependentMinimapViewport={minimapViewport}
        showTerrain={useTerrainLayer}
        mapStyle={selectedMapStyle}
        tileColorMode={tileColorMode}
        coloredTilesMap={coloredTilesMap}
        boundingVolumeType={boundingVolume ? boundingVolumeType : ""}
        boundingVolumeColorMode={boundingVolumeColorMode}
        pickable={pickable}
        wireframe={wireframe}
        i3sLayers={getI3sLayers()}
        lastLayerSelectedId={mainTileset.url}
        loadDebugTextureImage
        showDebugTexture={showUVDebugTexture}
        loadTiles={loadTiles}
        featurePicking={false}
        normalsDebugData={normalsDebugData}
        normalsTrianglesPercentage={trianglesPercentage}
        normalsLength={normalsLength}
        metadata={metadata}
        selectedTile={selectedTile}
        autoHighlight
        loadedTilesets={loadedTilesets}
        onAfterRender={() => updateStatWidgets()}
        getTooltip={getTooltip}
        onClick={handleClick}
        onTilesetLoad={onTilesetLoad}
        onTileLoad={onTileLoad}
        onTileUnload={onTileUnload}
      />
    </>
  );
};
