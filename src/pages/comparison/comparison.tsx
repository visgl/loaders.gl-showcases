import { useEffect, useState } from "react";
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
} from "../../types";

import { MapControllPanel } from "../../components/map-control-panel/map-control-panel";
import { BASE_MAPS } from "../../constants/map-styles";
import StatsWidget from "@probe.gl/stats-widget";
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
  const [glContext, setGlContext] = useState<any>(null);
  const [memWidget, setMemWidget] = useState<any>(null);
  const [statsLeftSide, setStatsLeftSide] = useState<any>([]);
  const [statsRightSide, setStatsRightSide] = useState<any>([]);

  const layout = useAppLayout();

  useEffect(() => {
    setLayerLeftSide(null);
  }, [mode]);

  useEffect(() => {
    const memoryUsage = glContext?.stats.get("Memory Usage");
    const memWidget = new StatsWidget(memoryUsage, {
      framesPerUpdate: 1,
      formatters: {
        "GPU Memory": "memory",
        "Buffer Memory": "memory",
        "Renderbuffer Memory": "memory",
        "Texture Memory": "memory",
      },
    });

    console.log(memWidget)

    setMemWidget(memWidget);
  }, [glContext]);

  const onViewStateChange = (viewStateSet: ViewStateSet) => {
    setViewState(viewStateSet);
  };

  const onWebGLInitialized = (gl) => {
    setGlContext(gl);
  };

  const updateStatWidgets = () => {
    memWidget && memWidget.update();
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

  const toggleDragMode = () => {
    setDragMode((prev) => {
      if (prev === DragMode.pan) {
        return DragMode.rotate;
      }
      return DragMode.pan;
    });
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
        dragMode={dragMode}
        selectedBaseMap={selectedBaseMap}
        baseMaps={baseMaps}
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
      />

      <Devider layout={layout} />
      <ComparisonSide
        mode={mode}
        side={ComparisonSideMode.right}
        viewState={viewState}
        dragMode={dragMode}
        selectedBaseMap={selectedBaseMap}
        baseMaps={baseMaps}
        showLayerOptions={mode === ComparisonMode.acrossLayers ? true : false}
        showComparisonSettings={mode === ComparisonMode.withinLayer}
        staticLayer={mode === ComparisonMode.withinLayer ? layerLeftSide : null}
        onViewStateChange={onViewStateChange}
        pointToTileset={pointToTileset}
        onInsertBaseMap={onInsertBaseMapHandler}
        onSelectBaseMap={onSelectBaseMapHandler}
        onDeleteBaseMap={onDeleteBaseMapHandler}
        onRequestTransitionToTileset={() => setNeedTransitionToTileset(true)}
      />
      <MapControllPanel
        dragMode={dragMode}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onDragModeToggle={toggleDragMode}
      />
    </Container>
  );
};
