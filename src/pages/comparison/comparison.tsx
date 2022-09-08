import { useEffect, useRef, useState, useCallback } from "react";
import { Tileset3D } from "@loaders.gl/tiles";
import styled from "styled-components";

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
} from "../../types";

import { MapControllPanel } from "../../components/map-control-panel/map-control-panel";
import { CompareButton } from "../../components/comparison/compare-button/compare-button";
import { BASE_MAPS } from "../../constants/map-styles";
import { ComparisonSide } from "../../components/comparison/comparison-side/comparison-side";
import { ComparisonLoadManager } from "../../utils/comparison-load-manager";

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
  const [layerLeftSide, setLayerLeftSide] = useState<LayerExample | null>(null);
  const [compareButtonMode, setCompareButtonMode] = useState(
    CompareButtonMode.Start
  );
  const [disableButton, setDisableButton] = useState<Array<boolean>>([
    false,
    false,
  ]);
  const [compared, setComapred] = useState<boolean>(false);
  const [leftSideLoaded, setLeftSideLoaded] = useState<boolean>(true);

  const layout = useAppLayout();

  useEffect(() => {
    setLayerLeftSide(null);
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
    };
    loadManagerRef.current.addEventListener("loaded", loadedHandler);
    return () => {
      loadManagerRef.current.removeEventListener("loaded", loadedHandler);
    };
  }, []);

  const onViewStateChange = (viewStateSet: ViewStateSet) => {
    setViewState(viewStateSet);
  };

  const pointToTileset = useCallback((tileset: Tileset3D) => {
    setViewState((viewStatePrev) => {
      const { zoom, cartographicCenter } = tileset;
      const [longitude, latitude] = cartographicCenter || [];
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

  const toggleDragMode = useCallback(() => {
    setDragMode((prev) => {
      if (prev === DragMode.pan) {
        return DragMode.rotate;
      }
      return DragMode.pan;
    });
  }, []);

  const toggleCompareButtonMode = useCallback(() => {
    setCompareButtonMode((prev) => {
      if (prev === CompareButtonMode.Start) {
        loadManagerRef.current.startLoading();
        return CompareButtonMode.Comparing;
      }
      return CompareButtonMode.Start;
    });
  }, []);

  const downloadClickHandler = useCallback(() => {
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
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "comparison-stats.json";

    link.click();
  }, []);

  const disableButtonHandlerLeft = useCallback(() => {
    setDisableButton((prevValue) => [true, prevValue[1]]);
  }, []);

  const disableButtonHandlerRight = useCallback(() => {
    setDisableButton((prevValue) => [prevValue[0], true]);
  }, []);

  const onChangeLayerHandler = useCallback(
    (layer: LayerExample) => {
      if (mode === ComparisonMode.withinLayer) {
        setLayerLeftSide(layer);
      }
    },
    [mode]
  );

  const onInsertBaseMapHandler = useCallback((baseMap: BaseMap) => {
    setBaseMaps((prevValues) => [...prevValues, baseMap]);
    setSelectedBaseMap(baseMap);
  }, []);

  const onSelectBaseMapHandler = useCallback((baseMapId: string) => {
    const baseMap = baseMaps.find((map) => map.id === baseMapId);

    if (baseMap) {
      setSelectedBaseMap(baseMap);
    }
  }, []);

  const onDeleteBaseMapHandler = useCallback((baseMapId: string) => {
    setBaseMaps((prevValues) =>
      prevValues.filter((baseMap) => baseMap.id !== baseMapId)
    );

    setSelectedBaseMap(BASE_MAPS[0]);
  }, []);

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
        showLayerOptions
        showComparisonSettings={mode === ComparisonMode.withinLayer}
        onViewStateChange={onViewStateChange}
        pointToTileset={pointToTileset}
        onChangeLayer={onChangeLayerHandler}
        onInsertBaseMap={onInsertBaseMapHandler}
        onSelectBaseMap={onSelectBaseMapHandler}
        onDeleteBaseMap={onDeleteBaseMapHandler}
        disableButtonHandler={disableButtonHandlerLeft}
        onTilesetLoaded={(stats: StatsMap) => {
          loadManagerRef.current.resolveLeftSide(stats);
          setLeftSideLoaded(true);
        }}
      />
      <Devider layout={layout} />
      <CompareButton
        compareButtonMode={compareButtonMode}
        downloadStats={
          compareButtonMode === CompareButtonMode.Start && compared
        }
        disableButton={disableButton.includes(false)}
        onCompareModeToggle={toggleCompareButtonMode}
        onDownloadClick={downloadClickHandler}
      />

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
        showLayerOptions={mode === ComparisonMode.acrossLayers ? true : false}
        showComparisonSettings={mode === ComparisonMode.withinLayer}
        staticLayer={mode === ComparisonMode.withinLayer ? layerLeftSide : null}
        onViewStateChange={onViewStateChange}
        pointToTileset={pointToTileset}
        onInsertBaseMap={onInsertBaseMapHandler}
        onSelectBaseMap={onSelectBaseMapHandler}
        onDeleteBaseMap={onDeleteBaseMapHandler}
        disableButtonHandler={disableButtonHandlerRight}
        onTilesetLoaded={(stats: StatsMap) => {
          loadManagerRef.current.resolveRightSide(stats);
        }}
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
