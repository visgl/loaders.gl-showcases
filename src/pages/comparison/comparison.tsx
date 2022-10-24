import { useCallback, useEffect, useRef, useState } from "react";
import { Tileset3D } from "@loaders.gl/tiles";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
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
} from "../../types";

import { MapControllPanel } from "../../components/map-control-panel/map-control-panel";
import { CompareButton } from "../../components/comparison/compare-button/compare-button";
import { BASE_MAPS } from "../../constants/map-styles";
import { ComparisonSide } from "../../components/comparison/comparison-side/comparison-side";
import { ComparisonLoadManager } from "../../utils/comparison-load-manager";
import { BookmarksPanel } from "../../components/bookmarks-panel/bookmarks-panel";
import { createComparisonBookmarkThumbnail } from "../../utils/deck-thumbnail-utils";

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
  const [compareButtonMode, setCompareButtonMode] = useState(
    CompareButtonMode.Start
  );
  const [disableButton, setDisableButton] = useState<Array<boolean>>([
    false,
    false,
  ]);
  const [compared, setComapred] = useState<boolean>(false);
  const [leftSideLoaded, setLeftSideLoaded] = useState<boolean>(true);
  const [hasBeenCompared, setHasBeenCompared] = useState<boolean>(false);
  const [showBookmarksPanel, setShowBookmarksPanel] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const layout = useAppLayout();

  useEffect(() => {
    setLayersLeftSide([]);
    setLayersRightSide([]);
    setDisableButton([false, false]);
    setBookmarks([]);
  }, [mode]);

  useEffect(() => {
    if (compareButtonMode === CompareButtonMode.Comparing) {
      setComapred(true);
      setLeftSideLoaded(false);
    }
  }, [compareButtonMode]);

  useEffect(() => {
    const loadedHandler = () => {
      setCompareButtonMode(CompareButtonMode.Start);
      setHasBeenCompared(true);
    };
    loadManagerRef.current.addEventListener("loaded", loadedHandler);
    return () => {
      loadManagerRef.current.removeEventListener("loaded", loadedHandler);
    };
  }, []);

  const onViewStateChange = (viewStateSet: ViewStateSet) => {
    setViewState(viewStateSet);
  };

  const pointToTileset = (tileset: Tileset3D) => {
    const { zoom, cartographicCenter } = tileset;
    const [longitude, latitude] = cartographicCenter || [];

    setViewState({
      main: {
        ...viewState.main,
        zoom: zoom + 2.5,
        longitude,
        latitude,
        transitionDuration: 1000,
      },
    });
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
        return CompareButtonMode.Comparing;
      }
      loadManagerRef.current.stopLoading();
      return CompareButtonMode.Start;
    });
  };

  const downloadJsonFile = (data: {[key: string]: any}, fileName: string) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = fileName;

    link.click();
  }

  const downloadClickHandler = () => {
    const data = {
      viewState: viewState.main,
      datasets: [
        {
          ...loadManagerRef.current.leftStats,
          ellapsedTime: loadManagerRef.current.leftLoadingTime,
        },
        {
          ...loadManagerRef.current.rightStats,
          ellapsedTime: loadManagerRef.current.rightLoadingTime,
        },
      ],
    };
    downloadJsonFile(data, "comparison-stats.json");
  };

  const onBookmarksUploadedHandler = (bookmarks: Bookmark[]) => {
    setBookmarks(bookmarks);
  }
  
  const onDownloadBookmarksHandler = () => {
    downloadJsonFile(bookmarks, "bookmarks.json");
  }

  const disableButtonHandlerLeft = () => {
    setDisableButton((prevValue) => [true, prevValue[1]]);
  };

  const disableButtonHandlerRight = () => {
    setDisableButton((prevValue) => [prevValue[0], true]);
  };

  const onChangeLayersHandler = (
    layers: LayerExample[],
    side: ComparisonSideMode
  ) => {
    if (side === ComparisonSideMode.left) {
      setLayersLeftSide(layers);
    } else if (side === ComparisonSideMode.right) {
      setLayersRightSide(layers);
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
    makeScreenshot().then((imageUrl) => {
      setBookmarks((prev) => [
        ...prev,
        {
          id: uuidv4(),
          imageUrl,
          viewState,
          layersLeftSide,
          layersRightSide,
        },
      ]);
    });
  };

  const onSelectBookmarkHandler = (bookmarkId: string) => {
    const bookmark = bookmarks.find(({ id }) => id === bookmarkId);
    if (!bookmark) {
      return;
    }
    setViewState(bookmark.viewState);
    setLayersLeftSide(bookmark.layersLeftSide);
    setLayersRightSide(bookmark.layersRightSide);
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
        showBookmarks={showBookmarksPanel}
        onViewStateChange={onViewStateChange}
        pointToTileset={pointToTileset}
        onChangeLayers={(layers) =>
          onChangeLayersHandler(layers, ComparisonSideMode.left)
        }
        onInsertBaseMap={onInsertBaseMapHandler}
        onSelectBaseMap={onSelectBaseMapHandler}
        onDeleteBaseMap={onDeleteBaseMapHandler}
        disableButtonHandler={disableButtonHandlerLeft}
        onTilesetLoaded={(stats: StatsMap) => {
          loadManagerRef.current.resolveLeftSide(stats);
          setLeftSideLoaded(true);
        }}
        onShowBookmarksChange={onBookmarkClick}
      />
      <Devider layout={layout} />
      <CompareButton
        compareButtonMode={compareButtonMode}
        downloadStats={
          compareButtonMode === CompareButtonMode.Start && compared
        }
        disableButton={disableButton.includes(false)}
        disableDownloadButton={!hasBeenCompared}
        onCompareModeToggle={toggleCompareButtonMode}
        onDownloadClick={downloadClickHandler}
      />
      {showBookmarksPanel && (
        <BookmarksPanel
          id="comparison-bookmarks-panel"
          bookmarks={bookmarks}
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
        showBookmarks={showBookmarksPanel}
        onViewStateChange={onViewStateChange}
        pointToTileset={pointToTileset}
        onChangeLayers={(layers) =>
          onChangeLayersHandler(layers, ComparisonSideMode.right)
        }
        onInsertBaseMap={onInsertBaseMapHandler}
        onSelectBaseMap={onSelectBaseMapHandler}
        onDeleteBaseMap={onDeleteBaseMapHandler}
        disableButtonHandler={disableButtonHandlerRight}
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
