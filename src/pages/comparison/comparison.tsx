import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { color_brand_primary } from "../../constants/colors";
import {
  ComparisonMode,
  LayerExample,
  ViewStateSet,
  DragMode,
  ComparisonSideMode,
  CompareButtonMode,
  StatsMap,
  Bookmark,
  LayerViewState,
  StatsData,
  PageId,
} from "../../types";

import { MapControllPanel } from "../../components/map-control-panel/map-control-panel";
import { CompareButton } from "../../components/comparison/compare-button/compare-button";
import { ComparisonSide } from "../../components/comparison/comparison-side/comparison-side";
import { ComparisonLoadManager } from "../../utils/comparison-load-manager";
import { BookmarksPanel } from "../../components/bookmarks-panel/bookmarks-panel";
import { createComparisonBookmarkThumbnail } from "../../utils/deck-thumbnail-utils";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../utils/hooks/layout";
import { ActiveSublayer } from "../../utils/active-sublayer";
import { downloadJsonFile } from "../../utils/files-utils";
import { checkBookmarksByPageId } from "../../utils/bookmarks-utils";
import { Layout } from "../../utils/enums";
import { useAppDispatch } from "../../redux/hooks";
import { setDragMode } from "../../redux/slices/drag-mode-slice";
import { setColorsByAttrubute } from "../../redux/slices/colors-by-attribute-slice";
import { setInitialBaseMaps } from "../../redux/slices/base-maps-slice";

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
  margin-top: 58px;
  height: calc(100% - 58px);
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
  const [buildingExplorerOpenedLeft, setBuildingExplorerOpenedLeft] =
    useState<boolean>(false);
  const [buildingExplorerOpenedRight, setBuildingExplorerOpenedRight] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();

  const layout = useAppLayout();

  useEffect(() => {
    setLayersLeftSide([]);
    setLayersRightSide([]);
    setDisableButton([true, true]);
    setBookmarks([]);
    dispatch(setColorsByAttrubute(null));
    dispatch(setDragMode(DragMode.pan));
    return () => {
      dispatch(setInitialBaseMaps());
    };
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

  const downloadClickHandler = () => {
    downloadJsonFile(comparisonStats, "bookmarks-stats.json");
  };

  const onBookmarksUploadedHandler = (bookmarks: Bookmark[]) => {
    const bookmarksPageId = checkBookmarksByPageId(
      bookmarks,
      PageId.comparison
    );

    if (bookmarksPageId === PageId.comparison) {
      setBookmarks(bookmarks);
      onSelectBookmarkHandler(bookmarks[0].id, bookmarks);
    } else {
      console.warn(
        `Can't add bookmars with ${bookmarksPageId} pageId to the comparison app`
      );
    }
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
          pageId: PageId.comparison,
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

  const updateBookmarks = (bookmarks: Bookmark[]) => {
    setBookmarks(bookmarks);
    onSelectBookmarkHandler(bookmarks?.[0].id, bookmarks);
  };

  return (
    <Container layout={layout}>
      <ComparisonSide
        mode={mode}
        side={ComparisonSideMode.left}
        viewState={viewState}
        compareButtonMode={compareButtonMode}
        loadingTime={loadManagerRef.current.leftLoadingTime}
        hasBeenCompared={hasBeenCompared}
        showLayerOptions
        showComparisonSettings={mode === ComparisonMode.withinLayer}
        staticLayers={layersLeftSide}
        activeLayersIds={activeLayersIdsLeftSide}
        preventTransitions={preventTransitions}
        showBookmarks={showBookmarksPanel}
        loadNumber={loadNumber}
        buildingExplorerOpened={buildingExplorerOpenedLeft}
        onViewStateChange={onViewStateChange}
        pointToTileset={pointToTileset}
        onChangeLayers={(layers, activeIds) =>
          onChangeLayersHandler(layers, activeIds, ComparisonSideMode.left)
        }
        onLoadingStateChange={disableButtonHandlerLeft}
        onTilesetLoaded={(stats: StatsMap) => {
          loadManagerRef.current.resolveLeftSide(stats);
          setLeftSideLoaded(true);
        }}
        onBuildingExplorerOpened={(opened) =>
          setBuildingExplorerOpenedLeft(opened)
        }
        onShowBookmarksChange={onBookmarkClick}
        onInsertBookmarks={updateBookmarks}
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
            !layersLeftSide.length ||
            (mode === ComparisonMode.acrossLayers && !layersRightSide.length)
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
        compareButtonMode={compareButtonMode}
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
        buildingExplorerOpened={buildingExplorerOpenedRight}
        onViewStateChange={onViewStateChange}
        pointToTileset={pointToTileset}
        onChangeLayers={(layers, activeIds) =>
          onChangeLayersHandler(layers, activeIds, ComparisonSideMode.right)
        }
        onLoadingStateChange={disableButtonHandlerRight}
        onTilesetLoaded={(stats: StatsMap) => {
          loadManagerRef.current.resolveRightSide(stats);
        }}
        onBuildingExplorerOpened={(opened) =>
          setBuildingExplorerOpenedRight(opened)
        }
        onShowBookmarksChange={onBookmarkClick}
      />

      {compareButtonMode === CompareButtonMode.Start && (
        <MapControllPanel
          bearing={viewState.main.bearing}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onCompassClick={onCompassClick}
          bottom={layout === Layout.Mobile ? 8 : 16}
        />
      )}
    </Container>
  );
};
