import { useEffect, useState } from "react";
import { Tileset3D } from "@loaders.gl/tiles";
import { MapController } from "@deck.gl/core";
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
} from "../../types";

import { MapControllPanel } from "../../components/map-control-panel/map-control-panel";
import { CompareButton } from "../../components/comparison/compare-button/compare-button";
import { BASE_MAPS } from "../../constants/map-styles";
import { ComparisonSide } from "../../components/comparison/comparison-side/comparison-side";

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
  const [dragMode, setDragMode] = useState<DragMode>(DragMode.pan);
  const [baseMaps, setBaseMaps] = useState<BaseMap[]>(BASE_MAPS);
  const [selectedBaseMap, setSelectedBaseMap] = useState<BaseMap>(BASE_MAPS[0]);
  const [viewState, setViewState] = useState<ViewStateSet>(INITIAL_VIEW_STATE);
  const [layerLeftSide, setLayerLeftSide] = useState<LayerExample | null>(null);
  const [needTransitionToTileset, setNeedTransitionToTileset] = useState(true);
  const [compareButtonMode, setCompareButtonMode] = useState(
    CompareButtonMode.Start
  );
  const [disableController, setDisableController] = useState<any>(null);
  const [disableButton, setDisableButton] = useState<Array<boolean>>([
    false,
    false,
  ]);
  const [isResolved, setIsResolved] = useState<boolean>(false);

  const layout = useAppLayout();

  useEffect(() => {
    setLayerLeftSide(null);
  }, [mode]);

  useEffect(() => {
    setDisableController({
      type: MapController,
      maxPitch: 60,
      inertia: true,
      scrollZoom: { speed: 0.01, smooth: true },
      touchRotate: true,
      dragMode,
    });
    if (compareButtonMode === CompareButtonMode.Comparing) {
      setDisableController({
        scrollZoom: false,
        doubleClickZoom: false,
        dragRotate: false,
        dragPan: false,
        touchRotate: false,
        touchZoom: false,
        keyboard: false,
      });
    }
  }, [compareButtonMode]);

  const onViewStateChange = (viewStateSet: ViewStateSet) => {
    setViewState(viewStateSet);
  };

  const pointToTileset = (tileset: Tileset3D) => {
    if (needTransitionToTileset) {
      const { zoom, cartographicCenter } = tileset;
      const [longitude, latitude] = cartographicCenter || [];

      const newViewState = {
        ...viewState,
        zoom: zoom + 2.5,
        longitude,
        latitude,
      };

      setViewState({
        ...newViewState,
      });
    }
    setNeedTransitionToTileset(false);
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
        return CompareButtonMode.Comparing;
      }
      return CompareButtonMode.Start;
    });
  };

  const disableButtonHandlerLeft = (disable: boolean) => {
    setDisableButton((prevValue) => [disable, prevValue[1]]);
  };

  const disableButtonHandlerRight = (disable: boolean) => {
    setDisableButton((prevValue) => [prevValue[0], disable]);
  };

  const onChangeLayerHandler = (layer: LayerExample) => {
    if (mode === ComparisonMode.withinLayer) {
      setLayerLeftSide(layer);
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

  return (
    <Container layout={layout}>
      <ComparisonSide
        mode={mode}
        side={ComparisonSideMode.left}
        viewState={viewState}
        selectedBaseMap={selectedBaseMap}
        baseMaps={baseMaps}
        compareButtonMode={compareButtonMode}
        disableController={disableController}
        showLayerOptions
        showComparisonSettings={mode === ComparisonMode.withinLayer}
        onViewStateChange={onViewStateChange}
        pointToTileset={pointToTileset}
        onChangeLayer={onChangeLayerHandler}
        onInsertBaseMap={onInsertBaseMapHandler}
        onSelectBaseMap={onSelectBaseMapHandler}
        onDeleteBaseMap={onDeleteBaseMapHandler}
        onRequestTransitionToTileset={() => {
          setNeedTransitionToTileset(true);
        }}
        disableButtonHandler={disableButtonHandlerLeft}
        onTilesetLoaded={(pending) => setIsResolved(pending)}
      />
      <Devider layout={layout} />
      <CompareButton
        compareButtonMode={compareButtonMode}
        downloadStats={
          isResolved && compareButtonMode === CompareButtonMode.Start
        }
        disableButton={disableButton.includes(false)}
        onCompareModeToggle={toggleCompareButtonMode}
      />

      <ComparisonSide
        mode={mode}
        side={ComparisonSideMode.right}
        viewState={viewState}
        selectedBaseMap={selectedBaseMap}
        baseMaps={baseMaps}
        compareButtonMode={compareButtonMode}
        disableController={disableController}
        showLayerOptions={mode === ComparisonMode.acrossLayers ? true : false}
        showComparisonSettings={mode === ComparisonMode.withinLayer}
        staticLayer={mode === ComparisonMode.withinLayer ? layerLeftSide : null}
        onViewStateChange={onViewStateChange}
        pointToTileset={pointToTileset}
        onInsertBaseMap={onInsertBaseMapHandler}
        onSelectBaseMap={onSelectBaseMapHandler}
        onDeleteBaseMap={onDeleteBaseMapHandler}
        onRequestTransitionToTileset={() => setNeedTransitionToTileset(true)}
        disableButtonHandler={disableButtonHandlerRight}
        onTilesetLoaded={(isLoaded) => setIsResolved(isLoaded)}
      />
      <MapControllPanel
        bearing={viewState.main.bearing}
        dragMode={dragMode}
        compareButtonMode={compareButtonMode}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onCompassClick={onCompassClick}
        onDragModeToggle={toggleDragMode}
      />
    </Container>
  );
};
