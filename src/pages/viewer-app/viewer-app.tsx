import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import { lumaStats } from "@luma.gl/core";
import { loadFeatureAttributes, StatisticsInfo } from "@loaders.gl/i3s";
import { v4 as uuidv4 } from "uuid";
import { Stats } from "@probe.gl/stats";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { EXAMPLES } from "../../constants/i3s-examples";
import { Tileset3D } from "@loaders.gl/tiles";

import { DeckGlWrapper } from "../../components/deck-gl-wrapper/deck-gl-wrapper";
import { AttributesPanel } from "../../components/attributes-panel/attributes-panel";
import { initStats, sumTilesetsStats } from "../../utils/stats";
import { parseTilesetUrlParams } from "../../utils/url-utils";
import {
  FeatureAttributes,
  Sublayer,
  LayerExample,
  TilesetType,
  ActiveButton,
  LayerViewState,
  ViewStateSet,
  ListItemType,
  Layout,
  Bookmark,
  DragMode,
  PageId,
  TilesetMetadata,
} from "../../types";
import { useAppLayout } from "../../utils/hooks/layout";
import {
  BottomToolsPanelWrapper,
  AttributesSidePanelWrapper,
  MapArea,
  RightSidePanelWrapper,
  OnlyToolsPanelWrapper,
} from "../../components/common";
import { MainToolsPanel } from "../../components/main-tools-panel/main-tools-panel";
import { LayersPanel } from "../../components/layers-panel/layers-panel";
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
import { IS_LOADED_DELAY } from "../../constants/common";
import { MobileToolsPanel } from "../../components/mobile-tools-panel/mobile-tools-panel";
import { BookmarksPanel } from "../../components/bookmarks-panel/bookmarks-panel";
import { MapControllPanel } from "../../components/map-control-panel/map-control-panel";
import { createViewerBookmarkThumbnail } from "../../utils/deck-thumbnail-utils";
import { downloadJsonFile } from "../../utils/files-utils";
import { checkBookmarksByPageId } from "../../utils/bookmarks-utils";
import {
  getFlattenedSublayers,
  selectLayers,
  selectSublayers,
  setFlattenedSublayers,
  updateLayerVisibility,
} from "../../redux/slices/flattened-sublayers-slice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setDragMode } from "../../redux/slices/drag-mode-slice";
import { setColorsByAttrubute } from "../../redux/slices/colors-by-attribute-slice";
import {
  selectBaseMaps,
  selectSelectedBaseMaps,
  setInitialBaseMaps,
} from "../../redux/slices/base-maps-slice";

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
};

export const ViewerApp = () => {
  const tilesetRef = useRef<Tileset3D | null>(null);
  const layout = useAppLayout();

  const [selectedFeatureAttributes, setSelectedFeatureAttributes] =
    useState<FeatureAttributes | null>(null);
  const [tilesetStatisticsInfo, setTilesetStatisticsInfo] = useState<
    StatisticsInfo[] | null
  >(null);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(-1);
  const [selectedTilesetBasePath, setSelectedTilesetBasePath] =
    useState<string>("");
  const [isAttributesLoading, setAttributesLoading] = useState(false);
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
  const [viewState, setViewState] = useState<ViewStateSet>(INITIAL_VIEW_STATE);
  const [sublayers, setSublayers] = useState<ActiveSublayer[]>([]);
  const [buildingExplorerOpened, setBuildingExplorerOpened] =
    useState<boolean>(false);
  const [, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const baseMaps = useAppSelector(selectBaseMaps);
  const selectedBaseMapId = useAppSelector(selectSelectedBaseMaps);
  const selectedBaseMap = baseMaps.find((map) => map.id === selectedBaseMapId);

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

  /**
   * Initialize stats widgets
   */
  useEffect(() => {
    const newActiveLayer = initActiveLayer();
    if (newActiveLayer.custom) {
      setExamples((prev) => [...prev, newActiveLayer]);
    }
    setActiveLayers([newActiveLayer]);
    dispatch(setColorsByAttrubute(null));
    dispatch(setDragMode(DragMode.pan));
    return () => {
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

    dispatch(
      getFlattenedSublayers({
        tilesetsData,
        buildingExplorerOpened,
      })
    );
    setLoadedTilesets([]);
    setSelectedFeatureAttributes(null);
    setSelectedFeatureIndex(-1);
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

  const onTileLoad = () => {
    setTimeout(() => {
      setUpdateStatsNumber((prev) => prev + 1);
    }, IS_LOADED_DELAY);
  };

  const onTilesetLoad = (tileset: Tileset3D) => {
    setLoadedTilesets((prevValues: Tileset3D[]) => [...prevValues, tileset]);
    setExamples((prevExamples) =>
      findExampleAndUpdateWithViewState(tileset, prevExamples)
    );
    tilesetRef.current = tileset;
    setUpdateStatsNumber((prev) => prev + 1);
  };

  const isLayerPickable = () => {
    const layerType = loadedTilesets?.[0]?.tileset?.layerType;

    switch (layerType) {
      case "IntegratedMesh":
        return false;
      default:
        return true;
    }
  };

  const handleClosePanel = useCallback(() => {
    setSelectedFeatureAttributes(null);
    setSelectedFeatureIndex(-1);
  }, []);

  const handleClick = async (info) => {
    if (!info.object || info.index < 0 || !info.layer) {
      handleClosePanel();
      return;
    }
    const options = info.object.tileset?.loadOptions || { i3s: {} };
    setAttributesLoading(true);
    const selectedFeatureAttributes = await loadFeatureAttributes(
      info.object,
      info.index,
      options
    );

    const selectedTilesetBasePath = info.object.tileset.basePath;
    const statisticsInfo = info.object.tileset?.tileset?.statisticsInfo;

    if (statisticsInfo) {
      setTilesetStatisticsInfo(statisticsInfo);
    }

    setAttributesLoading(false);
    setSelectedFeatureAttributes(selectedFeatureAttributes);
    setSelectedFeatureIndex(info.index);
    setSelectedTilesetBasePath(selectedTilesetBasePath);
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

  const renderAttributesPanel = () => (
    <AttributesSidePanelWrapper layout={layout}>
      <AttributesPanel
        title={
          selectedFeatureAttributes?.NAME ||
          selectedFeatureAttributes?.OBJECTID ||
          ""
        }
        onClose={handleClosePanel}
        tilesetName={activeLayers[0]?.name}
        attributes={selectedFeatureAttributes}
        statisticsInfo={tilesetStatisticsInfo}
        tilesetBasePath={selectedTilesetBasePath}
      />
    </AttributesSidePanelWrapper>
  );

  const onChangeMainToolsPanelHandler = (active: ActiveButton) => {
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

  const pointToTileset = useCallback((layerViewState?: LayerViewState) => {
    if (layerViewState) {
      setViewState((viewStatePrev) => {
        const { zoom, longitude, latitude } = layerViewState;
        return {
          main: {
            ...viewStatePrev.main,
            zoom: zoom + 2.5,
            longitude,
            latitude,
            transitionDuration: 1000,
          },
        };
      });
    }
  }, []);

  const onUpdateSublayerVisibilityHandler = (sublayer: Sublayer) => {
    if (sublayer.layerType === "3DObject") {
      const index = flattenedSublayers.findIndex(
        (fSublayer) => fSublayer.id === sublayer.id
      );
      if (index >= 0 && flattenedSublayers[index]) {
        dispatch(
          updateLayerVisibility({
            index: index,
            visibility: sublayer.visibility,
          })
        );
      }
    }
  };

  const onViewStateChangeHandler = (viewStateSet: ViewStateSet) => {
    setViewState(viewStateSet);
  };

  const onWebGLInitialized = () => {
    const stats = lumaStats.get("Memory Usage");
    setMemoryStats(stats);
  };

  const handleOnAfterRender = () => {
    sumTilesetsStats(loadedTilesets, tilesetsStats);
  };

  const onBookmarkClick = useCallback(() => {
    setShowBookmarksPanel((prev) => !prev);
  }, []);

  const makeScreenshot = async () => {
    const imageUrl = await createViewerBookmarkThumbnail(
      "#viewer-deck-container-wrapper"
    );

    if (!imageUrl) {
      throw new Error();
    }
    return imageUrl;
  };

  const addBookmarkHandler = () => {
    const newBookmarkId = uuidv4();
    setSelectedBookmarkId(newBookmarkId);
    makeScreenshot().then((imageUrl) => {
      setBookmarks((prev) => [
        ...prev,
        {
          id: newBookmarkId,
          pageId: PageId.viewer,
          imageUrl,
          viewState,
          layersLeftSide: activeLayers,
          layersRightSide: [],
          activeLayersIdsLeftSide: [...selectedLayerIds],
          activeLayersIdsRightSide: [],
        },
      ]);
    });
  };

  const onSelectBookmarkHandler = (
    bookmarkId: string,
    newBookmarks?: Bookmark[]
  ) => {
    const bookmark = (newBookmarks || bookmarks).find(
      ({ id }) => id === bookmarkId
    );
    if (!bookmark) {
      return;
    }
    setSelectedBookmarkId(bookmark.id);
    setPreventTransitions(true);
    setViewState(bookmark.viewState);
    setExamples(bookmark.layersLeftSide);
    setActiveLayers(
      getActiveLayersByIds(
        bookmark.layersLeftSide,
        bookmark.activeLayersIdsLeftSide
      )
    );
  };

  const onDeleteBookmarkHandler = useCallback((bookmarkId: string) => {
    setBookmarks((prev) =>
      prev.filter((bookmark) => bookmark.id !== bookmarkId)
    );
  }, []);

  const onEditBookmarkHandler = (bookmarkId: string) => {
    makeScreenshot().then((imageUrl) => {
      setBookmarks((prev) =>
        prev.map((bookmark) =>
          bookmark.id === bookmarkId
            ? {
                ...bookmark,
                imageUrl,
                viewState,
                layersLeftSide: activeLayers,
                layersRightSide: [],
                activeLayersIdsLeftSide: selectedLayerIds,
                activeLayersIdsRightSide: [],
              }
            : bookmark
        )
      );
    });
  };

  const onCloseBookmarkPanel = useCallback(() => {
    setShowBookmarksPanel(false);
  }, []);

  const onDownloadBookmarksHandler = () => {
    downloadJsonFile(bookmarks, "bookmarks.json");
  };

  const onBookmarksUploadedHandler = (bookmarks: Bookmark[]) => {
    const bookmarksPageId = checkBookmarksByPageId(bookmarks, PageId.viewer);

    if (bookmarksPageId === PageId.viewer) {
      setBookmarks(bookmarks);
      onSelectBookmarkHandler(bookmarks[0].id, bookmarks);
    } else {
      console.warn(
        `Can't add bookmars with ${bookmarksPageId} pageId to the viewer app`
      );
    }
  };

  const onZoomIn = useCallback(() => {
    setViewState((viewStatePrev) => {
      const { zoom, maxZoom } = viewStatePrev.main;
      const zoomEqualityCondition = zoom === maxZoom;

      return {
        main: {
          ...viewStatePrev.main,
          zoom: zoomEqualityCondition ? maxZoom : zoom + 1,
          transitionDuration: zoomEqualityCondition ? 0 : 1000,
        },
      };
    });
  }, []);

  const onZoomOut = useCallback(() => {
    setViewState((viewStatePrev) => {
      const { zoom, minZoom } = viewStatePrev.main;
      const zoomEqualityCondition = zoom === minZoom;

      return {
        main: {
          ...viewStatePrev.main,
          zoom: zoomEqualityCondition ? minZoom : zoom - 1,
          transitionDuration: zoomEqualityCondition ? 0 : 1000,
        },
      };
    });
  }, []);

  const onCompassClick = useCallback(() => {
    setViewState((viewStatePrev) => ({
      main: {
        ...viewStatePrev.main,
        bearing: 0,
        transitionDuration: 1000,
      },
    }));
  }, []);

  return (
    <MapArea>
      {selectedFeatureAttributes && renderAttributesPanel()}
      <DeckGlWrapper
        id="viewer-deck-container"
        parentViewState={{
          ...viewState,
          main: {
            ...viewState.main,
          },
        }}
        showTerrain={selectedBaseMap?.id === "Terrain"}
        mapStyle={selectedBaseMap?.mapUrl}
        pickable={isLayerPickable()}
        layers3d={layers3d}
        lastLayerSelectedId={selectedLayerIds[0] || ""}
        loadedTilesets={loadedTilesets}
        selectedTilesetBasePath={selectedTilesetBasePath}
        selectedIndex={selectedFeatureIndex}
        onAfterRender={handleOnAfterRender}
        getTooltip={getTooltip}
        onClick={handleClick}
        onViewStateChange={onViewStateChangeHandler}
        onTilesetLoad={onTilesetLoad}
        onTileLoad={onTileLoad}
        onWebGLInitialized={onWebGLInitialized}
        preventTransitions={preventTransitions}
      />

      {layout !== Layout.Mobile && (
        <OnlyToolsPanelWrapper layout={layout}>
          <MainToolsPanel
            id="viewer--tools-panel"
            activeButton={activeButton}
            showLayerOptions
            showBookmarks
            bookmarksActive={showBookmarksPanel}
            onChange={onChangeMainToolsPanelHandler}
            onShowBookmarksChange={onBookmarkClick}
          />
        </OnlyToolsPanelWrapper>
      )}
      {layout === Layout.Mobile && (
        <BottomToolsPanelWrapper layout={layout}>
          <MobileToolsPanel
            id={"mobile-viewer-tools-panel"}
            activeButton={activeButton}
            onChange={onChangeMainToolsPanelHandler}
            showBookmarks
            bookmarksActive={showBookmarksPanel}
            onShowBookmarksChange={onBookmarkClick}
          />
        </BottomToolsPanelWrapper>
      )}
      {activeButton === ActiveButton.options && (
        <RightSidePanelWrapper layout={layout}>
          <LayersPanel
            id="viewer--layers-panel"
            pageId={PageId.viewer}
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
            onBuildingExplorerOpened={(opened) =>
              setBuildingExplorerOpened(opened)
            }
          />
        </RightSidePanelWrapper>
      )}
      {activeButton === ActiveButton.memory && (
        <RightSidePanelWrapper layout={layout}>
          <MemoryUsagePanel
            id={"viewer-memory-usage-panel"}
            memoryStats={memoryStats}
            activeLayers={activeLayers}
            tilesetStats={tilesetsStats}
            contentFormats={tilesetRef.current?.contentFormats}
            updateNumber={updateStatsNumber}
            onClose={() => onChangeMainToolsPanelHandler(ActiveButton.memory)}
          />
        </RightSidePanelWrapper>
      )}

      {showBookmarksPanel && (
        <BookmarksPanel
          id="viewer-bookmarks-panel"
          bookmarks={bookmarks}
          selectedBookmarkId={selectedBookmarkId}
          disableBookmarksAdding={!activeLayers.length}
          onClose={onBookmarkClick}
          onAddBookmark={addBookmarkHandler}
          onSelectBookmark={onSelectBookmarkHandler}
          onCollapsed={onCloseBookmarkPanel}
          onDownloadBookmarks={onDownloadBookmarksHandler}
          onClearBookmarks={() => setBookmarks([])}
          onBookmarksUploaded={onBookmarksUploadedHandler}
          onDeleteBookmark={onDeleteBookmarkHandler}
          onEditBookmark={onEditBookmarkHandler}
        />
      )}
      <MapControllPanel
        bearing={viewState.main.bearing}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onCompassClick={onCompassClick}
      />
    </MapArea>
  );
};
