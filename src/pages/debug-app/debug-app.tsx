import type { Tile3D, Tileset3D } from "@loaders.gl/tiles";
import {
  LayerExample,
  NormalsDebugData,
  TileWarning,
  Sublayer,
  TilesetType,
  ActiveButton,
  BaseMap,
  ViewStateSet,
  BuildingSceneSublayerExtended,
  LayerViewState,
  ListItemType,
  BoundingVolumeType,
  DebugOptions,
  DebugOptionsAction,
  DebugOptionsActionKind,
  BoundingVolumeColoredBy,
  TileColoredBy,
} from "../../types";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { render } from "react-dom";
import { HuePicker, MaterialPicker } from "react-color";
import { lumaStats } from "@luma.gl/core";
import { PickingInfo } from "@deck.gl/core";

import { load } from "@loaders.gl/core";
import { I3SBuildingSceneLayerLoader } from "@loaders.gl/i3s";
import { Stats } from "@probe.gl/stats";

import { EXAMPLES } from "../../constants/i3s-examples";
import { BASE_MAPS } from "../../constants/map-styles";
import { SemanticValidator, DebugPanel } from "../../components";
import { TileTooltip } from "../../components/tile-tooltip/tile-tooltip";
import { IS_LOADED_DELAY } from "../../constants/common";
import {
  color_brand_primary,
  color_canvas_primary_inverted,
} from "../../constants/colors";
import { TileDetailsPanel } from "../../components/tile-details-panel/tile-details-panel";
import { DeckGlWrapper } from "../../components/deck-gl-wrapper/deck-gl-wrapper";
import ColorMap, {
  getRGBValueFromColorObject,
  makeRGBObjectFromColor,
} from "../../utils/debug/colors-map";
import { initStats, sumTilesetsStats } from "../../utils/stats";
import { parseTilesetUrlParams } from "../../utils/url-utils";
import { buildSublayersTree } from "../../utils/sublayers";
import { validateTile } from "../../utils/debug/tile-debug";
import {
  MapArea,
  RightSidePanelWrapper,
  RightSideToolsPanelWrapper,
} from "../../components/common";
import { MainToolsPanel } from "../../components/main-tools-panel/main-tools-panel";
import { LayersPanel } from "../../components/layers-panel/layers-panel";
import { useAppLayout } from "../../utils/hooks/layout";
import {
  findExampleAndUpdateWithViewState,
  handleSelectAllLeafsInGroup,
  initActiveLayer,
  selectNestedLayers,
} from "../../utils/layer-utils";
import { ActiveSublayer } from "../../utils/active-sublayer";
import { useSearchParams } from "react-router-dom";
import { MemoryUsagePanel } from "../../components/memory-usage-panel/memory-usage-panel";

const INITIAL_VIEW_STATE = {
  main: {
    longitude: 0,
    latitude: 0,
    pitch: 45,
    maxPitch: 90,
    bearing: 0,
    minZoom: 2,
    maxZoom: 24,
    zoom: 2,
    transitionDuration: 0,
    transitionInterpolator: null,
  },
  minimap: {
    latitude: 0,
    longitude: 0,
    zoom: 9,
    pitch: 0,
    bearing: 0,
  },
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
  color: color_canvas_primary_inverted,
};

const CURSOR_STYLE = {
  cursor: "pointer",
};

const colorMap = new ColorMap();

const INITIAL_DEBUG_OPTIONS_STATE: DebugOptions = {
  // Show minimap
  minimap: true,
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

const debugOptionsReducer = (
  state: DebugOptions,
  action: DebugOptionsAction
): DebugOptions => {
  const { type, payload } = action;

  switch (type) {
    case DebugOptionsActionKind.toggle:
      if (payload) {
        const option = payload.optionName;
        return {
          ...state,
          [option]: !state[option],
        };
      }
      return {
        ...state,
      };
    case DebugOptionsActionKind.select:
      if (payload) {
        const option = payload.optionName;
        return {
          ...state,
          [option]: payload.value,
        };
      }
      return {
        ...state,
      };
    case DebugOptionsActionKind.reset:
      return {
        ...INITIAL_DEBUG_OPTIONS_STATE,
      };
    default:
      return state;
  }
};

export const DebugApp = () => {
  const tilesetRef = useRef<Tileset3D | null>(null);
  const layout = useAppLayout();

  const [debugOptions, dispatchDebugOptions] = useReducer(
    debugOptionsReducer,
    INITIAL_DEBUG_OPTIONS_STATE
  );
  const [normalsDebugData, setNormalsDebugData] =
    useState<NormalsDebugData | null>(null);
  const [selectedTile, setSelectedTile] = useState<Tile3D | null>(null);
  const [coloredTilesMap, setColoredTilesMap] = useState({});
  const [warnings, setWarnings] = useState<TileWarning[]>([]);
  const [flattenedSublayers, setFlattenedSublayers] = useState<
    BuildingSceneSublayerExtended[]
  >([]);
  const [tilesetsStats, setTilesetsStats] = useState(initStats());
  const [memoryStats, setMemoryStats] = useState<Stats | null>(null);
  const [updateStatsNumber, setUpdateStatsNumber] = useState<number>(0);
  const [loadedTilesets, setLoadedTilesets] = useState<Tileset3D[]>([]);

  const [activeButton, setActiveButton] = useState<ActiveButton>(
    ActiveButton.none
  );
  const [examples, setExamples] = useState<LayerExample[]>(EXAMPLES);
  const [activeLayers, setActiveLayers] = useState<LayerExample[]>([]);
  const [viewState, setViewState] = useState<ViewStateSet>(INITIAL_VIEW_STATE);
  const fetchSublayersCounter = useRef<number>(0);
  const [sublayers, setSublayers] = useState<ActiveSublayer[]>([]);
  const [baseMaps, setBaseMaps] = useState<BaseMap[]>(BASE_MAPS);
  const [selectedBaseMap, setSelectedBaseMap] = useState<BaseMap>(BASE_MAPS[0]);
  const [, setSearchParams] = useSearchParams();

  const selectedLayerIds = useMemo(
    () => activeLayers.map((layer) => layer.id),
    [activeLayers]
  );
  const layers3d = useMemo(() => {
    return flattenedSublayers
      .filter((sublayer) => sublayer.visibility)
      .map((sublayer) => ({
        id: sublayer.id,
        url: sublayer.url,
        token: sublayer.token,
        type: sublayer.type || TilesetType.I3S,
      }));
  }, [flattenedSublayers]);

  useEffect(() => {
    const newActiveLayer = initActiveLayer();
    if (newActiveLayer.custom) {
      setExamples((prev) => [...prev, newActiveLayer]);
    }
    setActiveLayers([newActiveLayer]);
  }, []);

  /**
   * Hook for start using tilesets stats.
   */
  useEffect(() => {
    const tilesetsStats = initStats(activeLayers[0]?.url);
    setTilesetsStats(tilesetsStats);
  }, [loadedTilesets]);

  useEffect(() => {
    fetchSublayersCounter.current++;
    if (!activeLayers.length) {
      setFlattenedSublayers([]);
      return;
    }
    setSearchParams({ tileset: activeLayers[0].id });

    async function fetchFlattenedSublayers(
      tilesetsData: {
        id: string;
        url: string;
        token: string;
        hasChildren: boolean;
      }[],
      layerUpdateNumber: number
    ) {
      const promises: Promise<any>[] = [];

      for (const data of tilesetsData) {
        if (!data.hasChildren) {
          promises.push(getFlattenedSublayers(data));
        }
      }

      Promise.all(promises).then((results) => {
        if (layerUpdateNumber === fetchSublayersCounter.current) {
          setFlattenedSublayers(results.flat());
        }
      });
    }

    const tilesetsData: {
      id: string;
      url: string;
      token: string;
      hasChildren: boolean;
      type?: TilesetType;
    }[] = [];

    for (const layer of activeLayers) {
      const params = parseTilesetUrlParams(layer.url, layer);
      const { tilesetUrl, token } = params;

      tilesetsData.push({
        id: layer.id,
        url: tilesetUrl,
        token,
        hasChildren: Boolean(layer.layers),
        type: layer.type,
      });
    }

    fetchFlattenedSublayers(tilesetsData, fetchSublayersCounter.current);
    setSublayers([]);
    handleClearWarnings();
    setNormalsDebugData(null);
    setLoadedTilesets([]);
    colorMap._resetColorsMap();
    setColoredTilesMap({});
    setSelectedTile(null);
    dispatchDebugOptions({ type: DebugOptionsActionKind.reset });
  }, [activeLayers]);

  useEffect(() => {
    if (debugOptions.tileColorMode !== TileColoredBy.custom) {
      setColoredTilesMap({});
      setSelectedTile(null);
    }
  }, [debugOptions.tileColorMode]);

  /**
   * Tries to get Building Scene Layer sublayer urls if exists.
   * @param {string} tilesetUrl
   * @returns {string[]} Sublayer urls or tileset url.
   */
  const getFlattenedSublayers = async (tilesetData: {
    id: string;
    url: string;
    token: string;
    type?: TilesetType;
  }) => {
    try {
      const tileset = await load(tilesetData.url, I3SBuildingSceneLayerLoader);
      const sublayersTree = buildSublayersTree(tileset.header.sublayers);
      const childSublayers = sublayersTree?.sublayers || [];
      setSublayers(
        childSublayers.map((sublayer) => new ActiveSublayer(sublayer, true))
      );
      const sublayers = tileset?.sublayers
        .filter((sublayer) => sublayer.name !== "Overview")
        .map((item) => ({
          ...item,
          token: tilesetData.token,
          type: tilesetData.type,
        }));
      return sublayers;
    } catch (e) {
      return [
        {
          id: tilesetData.id,
          url: tilesetData.url,
          visibility: true,
          token: tilesetData.token,
          type: tilesetData.type,
        },
      ];
    }
  };

  const onTileLoad = (tile) => {
    setTimeout(() => {
      setUpdateStatsNumber((prev) => prev + 1);
    }, IS_LOADED_DELAY);
    handleValidateTile(tile);
  };

  const onTilesetLoad = (tileset: Tileset3D) => {
    setLoadedTilesets((prevValues: Tileset3D[]) => [...prevValues, tileset]);
    setExamples((prevExamples) =>
      findExampleAndUpdateWithViewState(tileset, prevExamples)
    );

    tilesetRef.current = tileset;
    setUpdateStatsNumber((prev) => prev + 1);
  };

  const handleValidateTile = (tile) => {
    const newWarnings = validateTile(tile);

    if (newWarnings.length) {
      setWarnings((prevValues) => [...prevValues, ...newWarnings]);
    }
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
        : color_canvas_primary_inverted,
      background: isResetButtonDisabled ? color_brand_primary : "#4F52CC",
    };
  };

  const handleClearWarnings = () => setWarnings([]);

  const renderTilePanel = () => {
    if (!selectedTile) {
      return null;
    }

    const isShowColorPicker =
      debugOptions.tileColorMode === TileColoredBy.custom;

    const tileId = selectedTile.id;
    const tileSelectedColor = makeRGBObjectFromColor(coloredTilesMap[tileId]);
    const isResetButtonDisabled = !coloredTilesMap[tileId];

    return (
      <TileDetailsPanel
        tile={selectedTile}
        handleClosePanel={handleClosePanel}
        deactiveDebugPanel={() => setActiveButton(ActiveButton.none)}
        activeDebugPanel={() => setActiveButton(ActiveButton.debug)}
      >
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

  const onChangeMainToolsPanelHandler = (active: ActiveButton) => {
    setActiveButton((prevValue) =>
      prevValue === active ? ActiveButton.none : active
    );
  };

  const onLayerInsertHandler = (newLayer: LayerExample) => {
    const newExamples = [...examples, newLayer];
    setExamples(newExamples);
    const newActiveLayers = handleSelectAllLeafsInGroup(newLayer);
    setActiveLayers(newActiveLayers);
  };

  const onLayerSelectHandler = (
    layer: LayerExample,
    rootLayer?: LayerExample
  ) => {
    const newActiveLayers: LayerExample[] = selectNestedLayers(
      layer,
      activeLayers,
      rootLayer
    );
    setActiveLayers(newActiveLayers);
  };

  const onLayerDeleteHandler = (id: string) => {
    const idsToDelete = [id];
    const layerToDelete = examples.find((layer) => layer.id === id);
    const childIds = layerToDelete
      ? handleSelectAllLeafsInGroup(layerToDelete).map((layer) => layer.id)
      : [];
    if (childIds.length) {
      idsToDelete.push(...childIds);
    }

    setExamples((prevValues) =>
      prevValues.filter((example) => example.id !== id)
    );
    setActiveLayers((prevValues) =>
      prevValues.filter((layer) => !idsToDelete.includes(layer.id))
    );
  };

  const pointToTileset = (layerViewState?: LayerViewState) => {
    if (layerViewState) {
      const { zoom, longitude, latitude } = layerViewState;

      setViewState({
        main: {
          ...viewState.main,
          zoom: zoom + 2.5,
          longitude,
          latitude,
          transitionDuration: 1000,
        },
        minimap: {
          ...viewState.minimap,
          longitude,
          latitude,
        },
      });
    }
  };

  const onUpdateSublayerVisibilityHandler = (sublayer: Sublayer) => {
    if (sublayer.layerType === "3DObject") {
      const flattenedSublayer = flattenedSublayers.find(
        (fSublayer) => fSublayer.id === sublayer.id
      );
      if (flattenedSublayer) {
        flattenedSublayer.visibility = sublayer.visibility;
        setFlattenedSublayers([...flattenedSublayers]);
      }
    }
  };

  const onInsertBaseMapHandler = (baseMap: BaseMap) => {
    setBaseMaps((prevValues) => [...prevValues, baseMap]);
    setSelectedBaseMap(baseMap);
  };

  const onSelectBaseMapHandler = (baseMapId: string) => {
    const baseMap = baseMaps.find((map) => map.id === baseMapId);

    if (baseMap) {
      setSelectedBaseMap(baseMap);
    }
  };

  const onDeleteBaseMapHandler = (baseMapId: string) => {
    setBaseMaps((prevValues) =>
      prevValues.filter((baseMap) => baseMap.id !== baseMapId)
    );

    setSelectedBaseMap(BASE_MAPS[0]);
  };

  const onViewStateChangeHandler = (viewStateSet: ViewStateSet) => {
    setViewState(viewStateSet);
  };

  const handleOnAfterRender = () => {
    sumTilesetsStats(loadedTilesets, tilesetsStats);
  };

  const onWebGLInitialized = () => {
    const stats = lumaStats.get("Memory Usage");
    setMemoryStats(stats);
  };

  const {
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
    <MapArea>
      {renderTilePanel()}
      <DeckGlWrapper
        showMinimap={minimap}
        createIndependentMinimapViewport={minimapViewport}
        parentViewState={viewState}
        showTerrain={selectedBaseMap.id === "Terrain"}
        mapStyle={selectedBaseMap.mapUrl}
        tileColorMode={tileColorMode}
        coloredTilesMap={coloredTilesMap}
        boundingVolumeType={boundingVolume ? boundingVolumeType : null}
        boundingVolumeColorMode={boundingVolumeColorMode}
        pickable={pickable}
        wireframe={wireframe}
        layers3d={layers3d}
        lastLayerSelectedId={selectedLayerIds[0] || ""}
        loadDebugTextureImage
        showDebugTexture={showUVDebugTexture}
        loadTiles={loadTiles}
        featurePicking={false}
        normalsDebugData={normalsDebugData}
        selectedTile={selectedTile}
        autoHighlight
        loadedTilesets={loadedTilesets}
        onAfterRender={handleOnAfterRender}
        getTooltip={getTooltip}
        onClick={handleClick}
        onViewStateChange={onViewStateChangeHandler}
        onTilesetLoad={onTilesetLoad}
        onTileLoad={onTileLoad}
        onWebGLInitialized={onWebGLInitialized}
      />
      <RightSideToolsPanelWrapper layout={layout}>
        <MainToolsPanel
          id="debug-tools-panel"
          activeButton={activeButton}
          showLayerOptions
          showDebug
          showValidator
          onChange={onChangeMainToolsPanelHandler}
        />
      </RightSideToolsPanelWrapper>
      {activeButton === ActiveButton.options && (
        <RightSidePanelWrapper layout={layout}>
          <LayersPanel
            id="debug--layers-panel"
            layers={examples}
            selectedLayerIds={selectedLayerIds}
            onLayerInsert={onLayerInsertHandler}
            onLayerSelect={onLayerSelectHandler}
            onLayerDelete={(id) => onLayerDeleteHandler(id)}
            onPointToLayer={(viewState) => pointToTileset(viewState)}
            type={ListItemType.Radio}
            sublayers={sublayers}
            onUpdateSublayerVisibility={onUpdateSublayerVisibilityHandler}
            onClose={() => onChangeMainToolsPanelHandler(ActiveButton.options)}
            baseMaps={baseMaps}
            selectedBaseMapId={selectedBaseMap.id}
            insertBaseMap={onInsertBaseMapHandler}
            selectBaseMap={onSelectBaseMapHandler}
            deleteBaseMap={onDeleteBaseMapHandler}
          />
        </RightSidePanelWrapper>
      )}
      {activeButton === ActiveButton.debug && (
        <RightSidePanelWrapper layout={layout}>
          <DebugPanel
            onClose={() => onChangeMainToolsPanelHandler(ActiveButton.debug)}
            debugOptions={debugOptions}
            onChangeOption={dispatchDebugOptions}
          />
        </RightSidePanelWrapper>
      )}
      {activeButton === ActiveButton.validator && (
        <SemanticValidator
          warnings={warnings}
          clearWarnings={handleClearWarnings}
        />
      )}
      {activeButton === ActiveButton.memory && (
        <RightSidePanelWrapper layout={layout}>
          <MemoryUsagePanel
            id={"debug-memory-usage-panel"}
            memoryStats={memoryStats}
            activeLayers={activeLayers}
            tilesetStats={tilesetsStats}
            contentFormats={tilesetRef.current?.contentFormats}
            updateNumber={updateStatsNumber}
            onClose={() => onChangeMainToolsPanelHandler(ActiveButton.memory)}
          />
        </RightSidePanelWrapper>
      )}
    </MapArea>
  );
};
