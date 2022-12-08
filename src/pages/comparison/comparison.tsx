import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { color_brand_primary } from "../../constants/colors";
import {
  ComparisonMode,
  LayerExample,
  BaseMap,
  ViewStateSet,
  DragMode,
  ComparisonSideMode,
  CompareButtonMode,
  StatsMap,
  Bookmark,
  LayerViewState,
  StatsData,
} from "../../types";

import { MapControllPanel } from "../../components/map-control-panel/map-control-panel";
import { CompareButton } from "../../components/comparison/compare-button/compare-button";
import { BASE_MAPS } from "../../constants/map-styles";
import { ComparisonSide } from "../../components/comparison/comparison-side/comparison-side";
import { ComparisonLoadManager } from "../../utils/comparison-load-manager";
import { BookmarksPanel } from "../../components/bookmarks-panel/bookmarks-panel";
import { createComparisonBookmarkThumbnail } from "../../utils/deck-thumbnail-utils";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../utils/hooks/layout";
import { ActiveSublayer } from "../../utils/active-sublayer";

type ComparisonPageProps = {
  mode: ComparisonMode;
};

type LayoutProps = {
  layout: string;
};

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

const Container = styled.div<LayoutProps>`
  display: flex;
  flex-direction: ${getCurrentLayoutProperty({
    desktop: "row",
    tablet: "column",
    mobile: "column-reverse",
  })};
  margin-top: 60px;
  height: calc(100% - 60px);
`;

const Devider = styled.div<LayoutProps>`
  width: ${getCurrentLayoutProperty({
    desktop: "14px",
    tablet: "100%",
    mobile: "100%",
  })};

  height: ${getCurrentLayoutProperty({
    desktop: "100%",
    tablet: "8px",
    mobile: "8px",
  })};

  background-color: ${color_brand_primary};
`;

export const Comparison = ({ mode }: ComparisonPageProps) => {
  const loadManagerRef = useRef<ComparisonLoadManager>(
    new ComparisonLoadManager()
  );

  const [dragMode, setDragMode] = useState<DragMode>(DragMode.pan);
  const [baseMaps, setBaseMaps] = useState<BaseMap[]>(BASE_MAPS);
  const [selectedBaseMap, setSelectedBaseMap] = useState<BaseMap>(BASE_MAPS[0]);
  const [viewState, setViewState] = useState<ViewStateSet>(INITIAL_VIEW_STATE);
  const [layersLeftSide, setLayersLeftSide] = useState<LayerExample[]>([]);
  const [layersRightSide, setLayersRightSide] = useState<LayerExample[]>([]);
  const [activeLayersIdsLeftSide, setActiveLayersIdsLeftSide] = useState<
    string[]
  >([]);
  const [activeLayersIdsRightSide, setActiveLayersIdsRightSide] = useState<
    string[]
  >([]);
  const [comparisonStats, setComparisonStats] = useState<StatsData[]>([]);

  const [compareButtonMode, setCompareButtonMode] = useState(
    CompareButtonMode.Start
  );
  // This ref will have always updated compareButtonMode state. It is used in callbacks
  const compareButtonModeRef = useRef<CompareButtonMode>(
    CompareButtonMode.Start
  );
  compareButtonModeRef.current = compareButtonMode;

  const [disableButton, setDisableButton] = useState<Array<boolean>>([
    true,
    true,
  ]);
  const [leftSideLoaded, setLeftSideLoaded] = useState<boolean>(true);
  const [hasBeenCompared, setHasBeenCompared] = useState<boolean>(false);
  const [showBookmarksPanel, setShowBookmarksPanel] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [preventTransitions, setPreventTransitions] = useState<boolean>(true);
  const [sublayersLeftSide, setSublayersLeftSide] = useState<
    null | ActiveSublayer[]
  >(null);
  const [loadNumber, setLoadNumber] = useState<number>(0);
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<string>("");

  const layout = useAppLayout();

  useEffect(() => {
    setLayersLeftSide([]);
    setLayersRightSide([]);
    setDisableButton([true, true]);
    setBookmarks([]);
  }, [mode]);

  useEffect(() => {
    if (compareButtonMode === CompareButtonMode.Comparing) {
      setLeftSideLoaded(false);
      setPreventTransitions(true);
      setComparisonStats([]);
    }
  }, [compareButtonMode]);

  useEffect(() => {
    const loadedHandler = () => {
      const selectedBookmarkIndex = bookmarks.findIndex(
        (bookmark) => bookmark.id === selectedBookmarkId
      );

      if (
        loadManagerRef.current.leftStats &&
        loadManagerRef.current.rightStats
      ) {
        const leftSideStats = JSON.parse(
          JSON.stringify(loadManagerRef.current.leftStats)
        );
        const rightSideStats = JSON.parse(
          JSON.stringify(loadManagerRef.current.rightStats)
        );

        const data: StatsData = {
          viewState: viewState.main,
          datasets: [
            {
              ...leftSideStats,
              ellapsedTime: loadManagerRef.current.leftLoadingTime,
            },
            {
              ...rightSideStats,
              ellapsedTime: loadManagerRef.current.rightLoadingTime,
            },
          ],
        };
        setComparisonStats((prev) => [...prev, data]);
      }

      if (
        !bookmarks.length ||
        selectedBookmarkIndex === -1 ||
        selectedBookmarkIndex === bookmarks.length - 1
      ) {
        setCompareButtonMode(CompareButtonMode.Start);
        setHasBeenCompared(true);
      } else {
        loadManagerRef.current.startLoading();
        onSelectBookmarkHandler(bookmarks[selectedBookmarkIndex + 1].id);
        setLoadNumber((prev) => prev + 1);
        setLeftSideLoaded(false);
      }
    };
    loadManagerRef.current.addEventListener("loaded", loadedHandler);
    return () => {
      loadManagerRef.current.removeEventListener("loaded", loadedHandler);
    };
  }, [selectedBookmarkId, bookmarks, viewState.main]);

  const onViewStateChange = (viewStateSet: ViewStateSet) => {
    setViewState(viewStateSet);
    if (hasBeenCompared) {
      loadManagerRef.current.leftLoadingTime = 0;
      loadManagerRef.current.rightLoadingTime = 0;
    }
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
      });
    }
  };

  const onZoomIn = () => {
    const { zoom, maxZoom } = viewState.main;

    if (zoom >= maxZoom) {
      return;
    }

    setViewState({
      main: {
        ...viewState.main,
        zoom: zoom + 1,
        transitionDuration: 1000,
      },
    });
  };

  const onZoomOut = () => {
    const { zoom, minZoom } = viewState.main;

    if (zoom <= minZoom) {
      return;
    }

    setViewState({
      main: {
        ...viewState.main,
        zoom: zoom - 1,
        transitionDuration: 1000,
      },
    });
  };

  const onCompassClick = () => {
    setViewState({
      main: {
        ...viewState.main,
        bearing: 0,
        transitionDuration: 1000,
      },
    });
  };

  const toggleDragMode = () => {
    setDragMode((prev) => {
      if (prev === DragMode.pan) {
        return DragMode.rotate;
      }
      return DragMode.pan;
    });
  };

  const toggleCompareButtonMode = () => {
    setCompareButtonMode((prev) => {
      if (prev === CompareButtonMode.Start) {
        loadManagerRef.current.startLoading();
        setHasBeenCompared(false);
        setLoadNumber((prev) => prev + 1);
        if (bookmarks.length) {
          onSelectBookmarkHandler(bookmarks[0].id);
        }
        return CompareButtonMode.Comparing;
      }
      loadManagerRef.current.stopLoading();
      return CompareButtonMode.Start;
    });
  };

  const downloadJsonFile = (data: { [key: string]: any }, fileName: string) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = fileName;

    link.click();
  };

  const downloadClickHandler = () => {
    downloadJsonFile(comparisonStats, "bookmarks-stats.json");
  };

  const onBookmarksUploadedHandler = (bookmarks: Bookmark[]) => {
    setBookmarks(bookmarks);
    onSelectBookmarkHandler(bookmarks[0].id);
  };

  const onDownloadBookmarksHandler = () => {
    downloadJsonFile(bookmarks, "bookmarks.json");
  };

  const disableButtonHandlerLeft = (state = true) => {
    setDisableButton((prevValue) => [
      compareButtonModeRef.current === CompareButtonMode.Start ? state : false,
      prevValue[1],
    ]);
  };

  const disableButtonHandlerRight = (state = true) => {
    setDisableButton((prevValue) => [
      prevValue[0],
      compareButtonModeRef.current === CompareButtonMode.Start ? state : false,
    ]);
  };

  const onChangeLayersHandler = (
    layers: LayerExample[],
    activeIds: string[],
    side: ComparisonSideMode
  ) => {
    setPreventTransitions(false);
    if (side === ComparisonSideMode.left) {
      setLayersLeftSide(layers);
      setActiveLayersIdsLeftSide(activeIds);
    } else if (side === ComparisonSideMode.right) {
      setLayersRightSide(layers);
      setActiveLayersIdsRightSide(activeIds);
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

  const onBookmarkClick = useCallback(() => {
    setShowBookmarksPanel((prev) => !prev);
  }, []);

  const onCloseBookmarkPanel = useCallback(() => {
    setShowBookmarksPanel(false);
  }, []);

  const makeScreenshot = async () => {
    const imageUrl = await createComparisonBookmarkThumbnail(
      "#left-deck-container-wrapper",
      "#right-deck-container-wrapper"
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
          imageUrl,
          viewState,
          layersLeftSide,
          layersRightSide,
          activeLayersIdsLeftSide: [...activeLayersIdsLeftSide],
          activeLayersIdsRightSide: [...activeLayersIdsRightSide],
        },
      ]);
    });
  };

  const onSelectBookmarkHandler = (bookmarkId: string) => {
    const bookmark = bookmarks.find(({ id }) => id === bookmarkId);
    if (!bookmark) {
      return;
    }
    setSelectedBookmarkId(bookmark.id);
    setPreventTransitions(true);
    setViewState(bookmark.viewState);
    setLayersLeftSide(bookmark.layersLeftSide);
    setLayersRightSide(bookmark.layersRightSide);
    setActiveLayersIdsLeftSide(bookmark.activeLayersIdsLeftSide);
    setActiveLayersIdsRightSide(bookmark.activeLayersIdsRightSide);
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
                layersLeftSide,
                layersRightSide,
                activeLayersIdsLeftSide,
                activeLayersIdsRightSide,
              }
            : bookmark
        )
      );
    });
  };

  return (
    <Container layout={layout}>
      <ComparisonSide
        mode={mode}
        side={ComparisonSideMode.left}
        viewState={viewState}
        selectedBaseMap={selectedBaseMap}
        baseMaps={baseMaps}
        compareButtonMode={compareButtonMode}
        dragMode={dragMode}
        loadingTime={loadManagerRef.current.leftLoadingTime}
        hasBeenCompared={hasBeenCompared}
        showLayerOptions
        showComparisonSettings={mode === ComparisonMode.withinLayer}
        staticLayers={layersLeftSide}
        activeLayersIds={activeLayersIdsLeftSide}
        preventTransitions={preventTransitions}
        showBookmarks={showBookmarksPanel}
        loadNumber={loadNumber}
        onViewStateChange={onViewStateChange}
        pointToTileset={pointToTileset}
        onChangeLayers={(layers, activeIds) =>
          onChangeLayersHandler(layers, activeIds, ComparisonSideMode.left)
        }
        onInsertBaseMap={onInsertBaseMapHandler}
        onSelectBaseMap={onSelectBaseMapHandler}
        onDeleteBaseMap={onDeleteBaseMapHandler}
        onLoadingStateChange={disableButtonHandlerLeft}
        onTilesetLoaded={(stats: StatsMap) => {
          loadManagerRef.current.resolveLeftSide(stats);
          setLeftSideLoaded(true);
        }}
        onShowBookmarksChange={onBookmarkClick}
        onInsertBookmarks={setBookmarks}
        onUpdateSublayers={(sublayers) => setSublayersLeftSide(sublayers)}
      />
      <Devider layout={layout} />
      <CompareButton
        compareButtonMode={compareButtonMode}
        downloadStats={
          compareButtonMode === CompareButtonMode.Start && hasBeenCompared
        }
        disableButton={disableButton.includes(true)}
        disableDownloadButton={!hasBeenCompared}
        onCompareModeToggle={toggleCompareButtonMode}
        onDownloadClick={downloadClickHandler}
      />
      {showBookmarksPanel && compareButtonMode === CompareButtonMode.Start && (
        <BookmarksPanel
          id="comparison-bookmarks-panel"
          bookmarks={bookmarks}
          selectedBookmarkId={selectedBookmarkId}
          disableBookmarksAdding={
            !layersLeftSide.length || !layersRightSide.length
          }
          onClose={onCloseBookmarkPanel}
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

      <ComparisonSide
        mode={mode}
        side={ComparisonSideMode.right}
        viewState={viewState}
        selectedBaseMap={selectedBaseMap}
        baseMaps={baseMaps}
        compareButtonMode={compareButtonMode}
        dragMode={dragMode}
        loadingTime={loadManagerRef.current.rightLoadingTime}
        loadTileset={leftSideLoaded}
        hasBeenCompared={hasBeenCompared}
        showLayerOptions={mode === ComparisonMode.acrossLayers ? true : false}
        showComparisonSettings={mode === ComparisonMode.withinLayer}
        staticLayers={
          mode === ComparisonMode.withinLayer ? layersLeftSide : layersRightSide
        }
        activeLayersIds={
          mode === ComparisonMode.withinLayer
            ? activeLayersIdsLeftSide
            : activeLayersIdsRightSide
        }
        preventTransitions={preventTransitions}
        showBookmarks={showBookmarksPanel}
        forcedSublayers={
          mode === ComparisonMode.withinLayer ? sublayersLeftSide : null
        }
        loadNumber={loadNumber}
        onViewStateChange={onViewStateChange}
        pointToTileset={pointToTileset}
        onChangeLayers={(layers, activeIds) =>
          onChangeLayersHandler(layers, activeIds, ComparisonSideMode.right)
        }
        onInsertBaseMap={onInsertBaseMapHandler}
        onSelectBaseMap={onSelectBaseMapHandler}
        onDeleteBaseMap={onDeleteBaseMapHandler}
        onLoadingStateChange={disableButtonHandlerRight}
        onTilesetLoaded={(stats: StatsMap) => {
          loadManagerRef.current.resolveRightSide(stats);
        }}
        onShowBookmarksChange={onBookmarkClick}
      />

      {compareButtonMode === CompareButtonMode.Start && (
        <MapControllPanel
          bearing={viewState.main.bearing}
          dragMode={dragMode}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onCompassClick={onCompassClick}
          onDragModeToggle={toggleDragMode}
        />
      )}
    </Container>
  );
};
