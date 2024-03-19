import type { Tile3D, Tileset3D } from "@loaders.gl/tiles";
import {
  type LayerExample,
  type NormalsDebugData,
  type TileWarning,
  type Sublayer,
  TilesetType,
  ActiveButton,
  type LayerViewState,
  ListItemType,
  TileColoredBy,
  Layout,
  type Bookmark,
  DragMode,
  type MinimapPosition,
  type TileSelectedColor,
  PageId,
  BaseMapGroup,
  type TilesetMetadata,
} from "../../types";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// eslint-disable-next-line react/no-deprecated
import { render } from "react-dom";
import { lumaStats } from "@luma.gl/core";
import {
  type PickingInfo,
  type InteractionStateChange,
  type ViewState,
} from "@deck.gl/core";

import { v4 as uuidv4 } from "uuid";
import { type Stats } from "@probe.gl/stats";

import { EXAMPLES } from "../../constants/i3s-examples";
import { SemanticValidator, DebugPanel } from "../../components";
import { TileTooltip } from "../../components/tile-tooltip/tile-tooltip";
import { IS_LOADED_DELAY } from "../../constants/common";
import { TileDetailsPanel } from "../../components/tile-details-panel/tile-details-panel";
import { DeckGlWrapper } from "../../components/deck-gl-wrapper/deck-gl-wrapper";
import ColorMap, {
  getRGBValueFromColorObject,
  makeRGBObjectFromColor,
} from "../../utils/debug/colors-map";
import { initStats, sumTilesetsStats } from "../../utils/stats";
import {
  parseTilesetUrlParams,
  urlParamsToViewState,
  viewStateToUrlParams,
} from "../../utils/url-utils";
import { validateTile } from "../../utils/debug/tile-debug";
import {
  BottomToolsPanelWrapper,
  MapArea,
  RightSidePanelWrapper,
  OnlyToolsPanelWrapper,
  CenteredContainer,
} from "../../components/common";
import { MainToolsPanel } from "../../components/main-tools-panel/main-tools-panel";
import { LayersPanel } from "../../components/layers-panel/layers-panel";
import { useAppLayout } from "../../utils/hooks/layout";
import {
  findExampleAndUpdateWithViewState,
  getActiveLayersByIds,
  handleSelectAllLeafsInGroup,
  initActiveLayer,
  selectNestedLayers,
} from "../../utils/layer-utils";
import { ActiveSublayer } from "../../utils/active-sublayer";
import { useSearchParams } from "react-router-dom";
import { MemoryUsagePanel } from "../../components/memory-usage-panel/memory-usage-panel";
import { MobileToolsPanel } from "../../components/mobile-tools-panel/mobile-tools-panel";
import { BookmarksPanel } from "../../components/bookmarks-panel/bookmarks-panel";
import { downloadJsonFile } from "../../utils/files-utils";
import { createViewerBookmarkThumbnail } from "../../utils/deck-thumbnail-utils";
import { MapControlPanel } from "../../components/map-control-panel/map-control-panel";
import { checkBookmarksByPageId } from "../../utils/bookmarks-utils";
import { type ColorResult } from "react-color";
import { TileColorSection } from "../../components/tile-details-panel/tile-color-section";
import { generateBinaryNormalsDebugData } from "../../utils/debug/normals-utils";
import {
  getFlattenedSublayers,
  selectLayers,
  selectSublayers,
  setFlattenedSublayers,
  updateLayerVisibility,
} from "../../redux/slices/flattened-sublayers-slice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setDragMode } from "../../redux/slices/drag-mode-slice";
import {
  setColorsByAttrubute,
  setFiltersByAttrubute,
} from "../../redux/slices/symbolization-slice";
import {
  resetDebugOptions,
  setDebugOptions,
  selectDebugOptions,
  selectPickable,
} from "../../redux/slices/debug-options-slice";
import {
  setInitialBaseMaps,
  selectSelectedBaseMapId,
} from "../../redux/slices/base-maps-slice";
import { clearBSLStatisitcsSummary } from "../../redux/slices/i3s-stats-slice";
import {
  selectViewState,
  setViewState,
} from "../../redux/slices/view-state-slice";
import { selectSelectedBaseMap } from "../../redux/slices/base-maps-slice";
import { ArcgisWrapper } from "../../components/arcgis-wrapper/arcgis-wrapper";
import { WarningPanel } from "../../components/layers-panel/warning/warning-panel";

const DEFAULT_TRIANGLES_PERCENTAGE = 30; // Percentage of triangles to show normals for.
const DEFAULT_NORMALS_LENGTH = 20; // Normals length in meters

const colorMap = new ColorMap();

export const DebugApp = () => {
  const tilesetRef = useRef<Tileset3D | null>(null);
  const layout = useAppLayout();
  const debugOptions = useAppSelector(selectDebugOptions);
  const selectedBaseMap = useAppSelector(selectSelectedBaseMap);
  const [normalsDebugData, setNormalsDebugData] =
    useState<NormalsDebugData | null>(null);
  const [trianglesPercentage, setTrianglesPercentage] = useState(
    DEFAULT_TRIANGLES_PERCENTAGE
  );
  const [normalsLength, setNormalsLength] = useState(DEFAULT_NORMALS_LENGTH);
  const [selectedTile, setSelectedTile] = useState<Tile3D | null>(null);
  const selectedTileRef = useRef<Tile3D | null>(selectedTile);
  const [coloredTilesMap, setColoredTilesMap] = useState({});
  const [warnings, setWarnings] = useState<TileWarning[]>([]);
  const flattenedSublayers = useAppSelector(selectLayers);
  const bslSublayers = useAppSelector(selectSublayers);
  const [tilesetsStats, setTilesetsStats] = useState(initStats());
  const [memoryStats, setMemoryStats] = useState<Stats | null>(null);
  const [updateStatsNumber, setUpdateStatsNumber] = useState<number>(0);
  const [loadedTilesets, setLoadedTilesets] = useState<Tileset3D[]>([]);

  const [activeButton, setActiveButton] = useState<ActiveButton>(
    ActiveButton.none
  );
  const [showBookmarksPanel, setShowBookmarksPanel] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<string>("");
  const [preventTransitions, setPreventTransitions] = useState<boolean>(false);
  const [examples, setExamples] = useState<LayerExample[]>(EXAMPLES);
  const [activeLayers, setActiveLayers] = useState<LayerExample[]>([]);
  const globalViewState = useAppSelector(selectViewState);
  const [sublayers, setSublayers] = useState<ActiveSublayer[]>([]);
  const [buildingExplorerOpened, setBuildingExplorerOpened] =
    useState<boolean>(false);
  const MapWrapper =
    selectedBaseMap?.group === BaseMapGroup.ArcGIS
      ? ArcgisWrapper
      : DeckGlWrapper;

  const [stateUrlViewStateParams, setStateUrlViewStateParams] =
    useState<ViewState>({});
  const [wrongBookmarkPageId, setWrongBookmarkPageId] = useState<PageId | null>(
    null
  );
  const [, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const selectedLayerIds = useMemo(
    () => activeLayers.map((layer) => layer.id),
    [activeLayers]
  );

  const isMobileLayout = layout === Layout.Mobile;

  const minimapPosition: MinimapPosition = useMemo(() => {
    return {
      x: isMobileLayout ? "2%" : "1%",
      y: isMobileLayout ? "1%" : "79%",
    };
  }, []);

  const layers3d = useMemo(() => {
    return flattenedSublayers
      .filter((sublayer) => sublayer.visibility)
      .map((sublayer) => ({
        id: sublayer.id,
        url: sublayer.url,
        token: sublayer.token,
        type: sublayer.type ?? TilesetType.I3S,
      }));
  }, [flattenedSublayers]);

  useEffect(() => {
    const newActiveLayer = initActiveLayer();
    if (newActiveLayer.custom) {
      setExamples((prev) => [...prev, newActiveLayer]);
    }
    setActiveLayers([newActiveLayer]);
    dispatch(setColorsByAttrubute(null));
    dispatch(setDragMode(DragMode.pan));
    dispatch(setDebugOptions({ minimap: true }));

    setStateUrlViewStateParams(urlParamsToViewState(globalViewState));

    return () => {
      dispatch(resetDebugOptions());
      dispatch(setInitialBaseMaps());
    };
  }, []);

  /**
   * Hook for start using tilesets stats.
   */
  useEffect(() => {
    const tilesetsStats = initStats(activeLayers[0]?.url);
    setTilesetsStats(tilesetsStats);
  }, [loadedTilesets]);

  useEffect(() => {
    if (!activeLayers.length) {
      dispatch(setFlattenedSublayers({ layers: [] }));
      return;
    }
    setSearchParams({ tileset: activeLayers[0].id }, { replace: true });

    const tilesetsData: TilesetMetadata[] = [];

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

    void dispatch(
      getFlattenedSublayers({
        tilesetsData,
        buildingExplorerOpened,
      })
    );
    handleClearWarnings();
    setNormalsDebugData(null);
    setLoadedTilesets([]);
    colorMap._resetColorsMap();
    setColoredTilesMap({});
    setSelectedTile(null);
    dispatch(resetDebugOptions());
    dispatch(
      setDebugOptions({
        minimap: !(selectedBaseMap?.group === BaseMapGroup.ArcGIS),
      })
    );
    dispatch(clearBSLStatisitcsSummary());
    dispatch(setFiltersByAttrubute({ filter: null }));
  }, [activeLayers, buildingExplorerOpened]);

  useEffect(() => {
    if (bslSublayers?.length > 0) {
      setSublayers(
        bslSublayers.map((sublayer) => new ActiveSublayer(sublayer, true))
      );
    } else {
      setSublayers([]);
    }
  }, [bslSublayers]);

  useEffect(() => {
    if (debugOptions.tileColorMode !== TileColoredBy.custom) {
      setColoredTilesMap({});
      setSelectedTile(null);
    }
  }, [debugOptions.tileColorMode]);

  useEffect(() => {
    selectedTileRef.current = selectedTile;
  }, [selectedTile]);

  const onTileLoad = (tile) => {
    setTimeout(() => {
      if (isMounted.current) {
        setUpdateStatsNumber((prev) => prev + 1);
      }
    }, IS_LOADED_DELAY);
    handleValidateTile(tile);
  };

  const onTilesetLoad = (tileset: Tileset3D) => {
    tileset.setProps({ onTraversalComplete: onTraversalCompleteHandler });
    setLoadedTilesets((prevValues: Tileset3D[]) => [...prevValues, tileset]);
    setExamples((prevExamples) =>
      findExampleAndUpdateWithViewState(tileset, prevExamples)
    );

    tilesetRef.current = tileset;
    setUpdateStatsNumber((prev) => prev + 1);
    if (Object.keys(stateUrlViewStateParams).length > 0) {
      const { longitude, latitude } = stateUrlViewStateParams;
      setViewState({
        ...globalViewState,
        main: { ...globalViewState.main, ...stateUrlViewStateParams },
        minimap: {
          ...globalViewState.minimap,
          longitude,
          latitude,
        },
      });
      setStateUrlViewStateParams({});
    }
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

  const onTraversalCompleteHandler = (selectedTiles: Tile3D[]) => {
    const tileIndex = selectedTiles.findIndex(
      (tile: Tile3D) => tile === selectedTileRef.current
    );
    if (tileIndex === -1 && isMounted.current) {
      setSelectedTile(null);
    }
    return selectedTiles;
  };

  const handleClick = (info: PickingInfo) => {
    if (!info.object) {
      handleCloseTilePanel();
      return;
    }
    setNormalsDebugData(null);
    setSelectedTile(info.object);
  };

  const handleCloseTilePanel = () => {
    setSelectedTile(null);
    setNormalsDebugData(null);
  };

  const handleSelectTileColor = (
    tileId: string,
    selectedColor: ColorResult
  ) => {
    const color = getRGBValueFromColorObject(selectedColor);
    const updatedMap = {
      ...coloredTilesMap,
      ...{ [tileId]: color },
    };

    setColoredTilesMap(updatedMap);
  };

  const handleResetColor = (tileId: string) => {
    const updatedColoredMap = { ...coloredTilesMap };
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete updatedColoredMap[tileId];
    setColoredTilesMap(updatedColoredMap);
  };

  const handleClearWarnings = () => {
    setWarnings([]);
  };

  const onShowNormals = (tile) => {
    if (normalsDebugData === null) {
      setNormalsDebugData(generateBinaryNormalsDebugData(tile));
    } else {
      setNormalsDebugData(null);
    }
  };

  const onChangeTrianglesPercentage = (tile, newValue) => {
    if (normalsDebugData?.length) {
      setNormalsDebugData(generateBinaryNormalsDebugData(tile));
    }

    const percent = validateTrianglesPercentage(newValue);
    setTrianglesPercentage(percent);
  };

  const onChangeNormalsLength = (tile, newValue) => {
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

    const isShowColorPicker =
      debugOptions.tileColorMode === TileColoredBy.custom;

    const tileId = selectedTile.id;
    const tileSelectedColor: TileSelectedColor = makeRGBObjectFromColor(
      coloredTilesMap[tileId]
    );
    const isResetButtonDisabled = !coloredTilesMap[tileId];

    return (
      <TileDetailsPanel
        tile={selectedTile}
        trianglesPercentage={trianglesPercentage}
        normalsLength={normalsLength}
        onShowNormals={onShowNormals}
        onChangeTrianglesPercentage={onChangeTrianglesPercentage}
        onChangeNormalsLength={onChangeNormalsLength}
        handleClosePanel={handleCloseTilePanel}
        deactiveDebugPanel={() => {
          setActiveButton(ActiveButton.none);
        }}
        activeDebugPanel={() => {
          setActiveButton(ActiveButton.debug);
        }}
      >
        {isShowColorPicker && (
          <TileColorSection
            tileId={tileId}
            tileSelectedColor={tileSelectedColor}
            isResetButtonDisabled={isResetButtonDisabled}
            handleResetColor={handleResetColor}
            handleSelectTileColor={handleSelectTileColor}
          />
        )}
      </TileDetailsPanel>
    );
  };

  const onChangeMainToolsPanelHandler = (active: ActiveButton) => {
    if (layout !== Layout.Desktop) {
      handleCloseTilePanel();
    }

    setActiveButton((prevValue) =>
      prevValue === active ? ActiveButton.none : active
    );
  };

  const updateBookmarks = (bookmarks: Bookmark[]) => {
    setBookmarks(bookmarks);
    onSelectBookmarkHandler(bookmarks?.[0].id, bookmarks);
  };

  const onLayerInsertHandler = (
    newLayer: LayerExample,
    bookmarks?: Bookmark[]
  ) => {
    const newExamples = [...examples, newLayer];
    setExamples(newExamples);
    const newActiveLayers = handleSelectAllLeafsInGroup(newLayer);
    setActiveLayers(newActiveLayers);
    setPreventTransitions(false);

    if (bookmarks?.length) {
      updateBookmarks(bookmarks);
    }
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
    setPreventTransitions(false);
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

  const pointToTileset = useCallback(
    (layerViewState?: LayerViewState) => {
      if (layerViewState) {
        const { zoom, longitude, latitude } = layerViewState;
        const newViewState = {
          main: {
            ...globalViewState.main,
            zoom: zoom + 2.5,
            longitude,
            latitude,
            transitionDuration: 1000,
          },
          minimap: {
            ...globalViewState.minimap,
            longitude,
            latitude,
          },
        };
        dispatch(setViewState(newViewState));
      }
    },
    [globalViewState]
  );

  const onUpdateSublayerVisibilityHandler = (sublayer: Sublayer) => {
    if (sublayer.layerType === "3DObject") {
      const index = flattenedSublayers.findIndex(
        (fSublayer) => fSublayer.id === sublayer.id
      );
      if (index >= 0 && flattenedSublayers[index]) {
        dispatch(
          updateLayerVisibility({
            index,
            visibility: sublayer.visibility,
          })
        );
      }
    }
  };

  const handleOnAfterRender = () => {
    sumTilesetsStats(loadedTilesets, tilesetsStats);
  };

  const onWebGLInitialized = () => {
    const stats = lumaStats.get("Memory Usage");
    setMemoryStats(stats);
  };

  const onBookmarkClick = useCallback(() => {
    setShowBookmarksPanel((prev) => !prev);
  }, []);

  const makeScreenshot = async () => {
    const imageUrl = await createViewerBookmarkThumbnail(
      "#debug-deck-container-wrapper"
    );

    if (!imageUrl) {
      throw new Error();
    }
    return imageUrl;
  };

  const addBookmarkHandler = () => {
    const newBookmarkId = uuidv4();
    makeScreenshot()
      .then((imageUrl) => {
        setBookmarks((prev) => [
          ...prev,
          {
            id: newBookmarkId,
            pageId: PageId.debug,
            imageUrl,
            viewState: globalViewState,
            debugOptions,
            layersLeftSide: activeLayers,
            layersRightSide: [],
            activeLayersIdsLeftSide: [...selectedLayerIds],
            activeLayersIdsRightSide: [],
          },
        ]);
        setSelectedBookmarkId(newBookmarkId);
      })
      .catch(() => {
        console.error("Make screenshot operation has failed");
      });
  };

  const onSelectBookmarkHandler = (
    bookmarkId: string,
    newBookmarks?: Bookmark[]
  ) => {
    const bookmark = (newBookmarks ?? bookmarks).find(
      ({ id }) => id === bookmarkId
    );
    if (!bookmark) {
      return;
    }
    setSelectedBookmarkId(bookmark.id);
    setPreventTransitions(true);
    dispatch(setViewState(bookmark.viewState));
    setExamples(bookmark.layersLeftSide);
    setActiveLayers(
      getActiveLayersByIds(
        bookmark.layersLeftSide,
        bookmark.activeLayersIdsLeftSide
      )
    );

    setTimeout(() => {
      if (bookmark?.debugOptions) {
        dispatch(setDebugOptions(bookmark.debugOptions));
      }
    }, IS_LOADED_DELAY);
  };

  const onDeleteBookmarkHandler = useCallback((bookmarkId: string) => {
    setBookmarks((prev) =>
      prev.filter((bookmark) => bookmark.id !== bookmarkId)
    );
  }, []);

  const onEditBookmarkHandler = (bookmarkId: string) => {
    makeScreenshot()
      .then((imageUrl) => {
        setBookmarks((prev) =>
          prev.map((bookmark) =>
            bookmark.id === bookmarkId
              ? {
                  ...bookmark,
                  imageUrl,
                  viewState: globalViewState,
                  debugOptions,
                  layersLeftSide: activeLayers,
                  layersRightSide: [],
                  activeLayersIdsLeftSide: selectedLayerIds,
                  activeLayersIdsRightSide: [],
                }
              : bookmark
          )
        );
      })
      .catch(() => {
        console.error("Make screenshot operation has failed");
      });
  };

  const onCloseBookmarkPanel = useCallback(() => {
    setShowBookmarksPanel(false);
  }, []);

  const onDownloadBookmarksHandler = () => {
    downloadJsonFile(bookmarks, "bookmarks.json");
  };

  const onBookmarksUploadedHandler = (bookmarks: Bookmark[]) => {
    const bookmarksPageId = checkBookmarksByPageId(bookmarks, PageId.debug);

    if (bookmarksPageId === PageId.debug) {
      setBookmarks(bookmarks);
      onSelectBookmarkHandler(bookmarks[0].id, bookmarks);
    } else {
      setWrongBookmarkPageId(bookmarksPageId);
    }
  };

  const onZoomIn = useCallback(() => {
    const { zoom, maxZoom } = globalViewState.main;
    const zoomEqualityCondition = zoom === maxZoom;
    const newViewState = {
      main: {
        ...globalViewState.main,
        zoom: zoomEqualityCondition ? maxZoom : zoom + 1,
        transitionDuration: zoomEqualityCondition ? 0 : 1000,
      },
      minimap: {
        ...globalViewState.minimap,
      },
    };
    dispatch(setViewState(newViewState));
  }, [globalViewState]);

  const onZoomOut = useCallback(() => {
    const { zoom, minZoom } = globalViewState.main;
    const zoomEqualityCondition = zoom === minZoom;
    const newViewState = {
      main: {
        ...globalViewState.main,
        zoom: zoomEqualityCondition ? minZoom : zoom - 1,
        transitionDuration: zoomEqualityCondition ? 0 : 1000,
      },
      minimap: {
        ...globalViewState.minimap,
      },
    };
    dispatch(setViewState(newViewState));
  }, [globalViewState]);

  const onCompassClick = useCallback(() => {
    dispatch(
      setViewState({
        main: {
          ...globalViewState.main,
          bearing: 0,
          transitionDuration: 1000,
        },
        minimap: {
          ...globalViewState.minimap,
        },
      })
    );
  }, [globalViewState]);

  const onInteractionStateChange = (
    interactionStateChange: InteractionStateChange
  ) => {
    const { isDragging, inTransition, isZooming, isPanning, isRotating } =
      interactionStateChange;
    if (
      !isDragging &&
      !inTransition &&
      !isZooming &&
      !isPanning &&
      !isRotating &&
      isMounted.current
    ) {
      setSearchParams(viewStateToUrlParams(globalViewState), { replace: true });
    }
  };

  return (
    <MapArea>
      {renderTilePanel()}
      <MapWrapper
        id="debug-deck-container"
        coloredTilesMap={coloredTilesMap}
        normalsTrianglesPercentage={trianglesPercentage}
        normalsLength={normalsLength}
        pickable={useAppSelector(selectPickable)}
        layers3d={layers3d}
        lastLayerSelectedId={selectedLayerIds[0] || ""}
        loadDebugTextureImage
        featurePicking={false}
        normalsDebugData={normalsDebugData}
        selectedTile={selectedTile}
        autoHighlight
        loadedTilesets={loadedTilesets}
        minimapPosition={minimapPosition}
        onAfterRender={handleOnAfterRender}
        getTooltip={getTooltip}
        onClick={handleClick}
        onTilesetLoad={onTilesetLoad}
        onTileLoad={onTileLoad}
        onWebGLInitialized={onWebGLInitialized}
        preventTransitions={preventTransitions}
        onInteractionStateChange={onInteractionStateChange}
      />
      {layout !== Layout.Mobile && (
        <OnlyToolsPanelWrapper $layout={layout}>
          <MainToolsPanel
            id="debug-tools-panel"
            activeButton={activeButton}
            showLayerOptions
            showDebug
            showValidator
            showBookmarks
            onChange={onChangeMainToolsPanelHandler}
            bookmarksActive={showBookmarksPanel}
            onShowBookmarksChange={onBookmarkClick}
          />
        </OnlyToolsPanelWrapper>
      )}
      {layout === Layout.Mobile && (
        <BottomToolsPanelWrapper $layout={layout}>
          <MobileToolsPanel
            id={"mobile-debug-tools-panel"}
            activeButton={activeButton}
            showDebug
            showValidator
            showBookmarks
            onChange={onChangeMainToolsPanelHandler}
            bookmarksActive={showBookmarksPanel}
            onShowBookmarksChange={onBookmarkClick}
          />
        </BottomToolsPanelWrapper>
      )}
      {activeButton === ActiveButton.options && (
        <RightSidePanelWrapper $layout={layout}>
          <LayersPanel
            id="debug--layers-panel"
            pageId={PageId.debug}
            layers={examples}
            selectedLayerIds={selectedLayerIds}
            onLayerInsert={onLayerInsertHandler}
            onLayerSelect={onLayerSelectHandler}
            onLayerDelete={(id) => {
              onLayerDeleteHandler(id);
            }}
            onPointToLayer={(viewState) => {
              pointToTileset(viewState);
            }}
            type={ListItemType.Radio}
            sublayers={sublayers}
            onUpdateSublayerVisibility={onUpdateSublayerVisibilityHandler}
            onClose={() => {
              onChangeMainToolsPanelHandler(ActiveButton.options);
            }}
            onBuildingExplorerOpened={(opened) => {
              setBuildingExplorerOpened(opened);
            }}
          />
        </RightSidePanelWrapper>
      )}
      {activeButton === ActiveButton.debug && (
        <RightSidePanelWrapper $layout={layout}>
          <DebugPanel
            onClose={() => {
              onChangeMainToolsPanelHandler(ActiveButton.debug);
            }}
          />
        </RightSidePanelWrapper>
      )}
      {activeButton === ActiveButton.validator && (
        <RightSidePanelWrapper $layout={layout}>
          <SemanticValidator
            warnings={warnings}
            clearWarnings={handleClearWarnings}
            onClose={() => {
              onChangeMainToolsPanelHandler(ActiveButton.validator);
            }}
          />
        </RightSidePanelWrapper>
      )}
      {activeButton === ActiveButton.memory && (
        <RightSidePanelWrapper $layout={layout}>
          <MemoryUsagePanel
            id={"debug-memory-usage-panel"}
            memoryStats={memoryStats}
            activeLayers={activeLayers}
            tilesetStats={tilesetsStats}
            contentFormats={tilesetRef.current?.contentFormats}
            updateNumber={updateStatsNumber}
            onClose={() => {
              onChangeMainToolsPanelHandler(ActiveButton.memory);
            }}
          />
        </RightSidePanelWrapper>
      )}
      {showBookmarksPanel && (
        <BookmarksPanel
          id="debug-bookmarks-panel"
          bookmarks={bookmarks}
          selectedBookmarkId={selectedBookmarkId}
          disableBookmarksAdding={!activeLayers.length}
          onClose={onBookmarkClick}
          onAddBookmark={addBookmarkHandler}
          onSelectBookmark={onSelectBookmarkHandler}
          onCollapsed={onCloseBookmarkPanel}
          onDownloadBookmarks={onDownloadBookmarksHandler}
          onClearBookmarks={() => {
            setBookmarks([]);
          }}
          onBookmarksUploaded={onBookmarksUploadedHandler}
          onDeleteBookmark={onDeleteBookmarkHandler}
          onEditBookmark={onEditBookmarkHandler}
        />
      )}
      <MapControlPanel
        bearing={globalViewState.main.bearing}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onCompassClick={onCompassClick}
        isDragModeVisible={selectedBaseMap?.group !== BaseMapGroup.ArcGIS}
      />
      {wrongBookmarkPageId && (
        <CenteredContainer>
          <WarningPanel
            title={`This bookmark is only suitable for ${wrongBookmarkPageId} mode`}
            onConfirm={() => {
              setWrongBookmarkPageId(null);
            }}
          />
        </CenteredContainer>
      )}
    </MapArea>
  );
};
