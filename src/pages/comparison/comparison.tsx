import { useMemo, useState } from "react";
import DeckGL from "@deck.gl/react";
import { MapController, MapView, WebMercatorViewport } from "@deck.gl/core";
import styled from "styled-components";

import { StaticMap } from "react-map-gl";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import { getElevationByCentralTile } from "../../utils";
import { INITIAL_MAP_STYLE } from "../../constants/map-styles";
import { darkGrey } from "../../constants/colors";
import { MainToolsPanel } from "../../components/main-tools-panel/main-tools-panel";
import { ActiveButton, ComparisonMode, ListItemType } from "../../utils/enums";
import { LayersPanel } from "../../components/layers-panel/layers-panel";
import { EXAMPLES } from "../../constants/i3s-examples";

type ComparisonPageProps = {
  mode: ComparisonMode;
};

type LayoutProps = {
  layout: string;
};

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  pitch: 45,
  maxPitch: 90,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  zoom: 2,
  transitionDuration: 0,
  transitionInterpolator: null,
};

const CONTROLLER_PROPS = {
  type: MapController,
  maxPitch: 60,
  inertia: true,
  scrollZoom: { speed: 0.01, smooth: true },
};

const VIEW = new MapView({
  id: "main",
  controller: { inertia: true },
  farZMultiplier: 2.02,
});

const Container = styled.div<LayoutProps>`
  display: flex;
  flex-direction: ${getCurrentLayoutProperty({
    default: "row",
    tablet: "column",
    mobile: "column-reverse",
  })};
  margin-top: 58px;
  height: calc(100% - 60px);
`;

const DeckWrapper = styled.div<LayoutProps>`
  width: ${getCurrentLayoutProperty({
    default: "50%",
    tablet: "100%",
    mobile: "100%",
  })};
  height: 100%;
  position: relative;
`;

const Devider = styled.div<LayoutProps>`
  width: ${getCurrentLayoutProperty({
    default: "14px",
    tablet: "100%",
    mobile: "100%",
  })};

  height: ${getCurrentLayoutProperty({
    default: "100%",
    tablet: "8px",
    mobile: "8px",
  })};

  background-color: ${darkGrey};
`;

const LeftSideToolsPanelWrapper = styled.div<LayoutProps>`
  position: absolute;

  left: ${getCurrentLayoutProperty({
    default: "24px",
    tablet: "24px",
    mobile: "8px",
  })};

  ${getCurrentLayoutProperty({
    default: "top: 24px;",
    tablet: "top: 16px;",
    mobile: "bottom: 8px;",
  })};
`;

const RightSideToolsPanelWrapper = styled(LeftSideToolsPanelWrapper)`
  left: auto;
  top: auto;

  ${getCurrentLayoutProperty({
    default: "right 24px",
    tablet: "left 24px",
    mobile: "left 8px",
  })};

  ${getCurrentLayoutProperty({
    default: "top: 24px;",
    tablet: "top: 16px;",
    mobile: "bottom: 8px;",
  })};
`;

const LeftLayersPanelWrapper = styled.div<LayoutProps>`
  position: absolute;
  z-index: 10;

  left: ${getCurrentLayoutProperty({
    default: "100px",
    tablet: "100px",
    mobile: "calc(50% - 180px)",
  })};

  ${getCurrentLayoutProperty({
    default: "top: 24px;",
    tablet: "top: 16px;",
    mobile: "bottom: 0;",
  })};
`;

const RightLayersPanelWrapper = styled(LeftLayersPanelWrapper)`
  left: auto;
  top: auto;

  ${getCurrentLayoutProperty({
    default: "right 100px;",
    tablet: "left: 100px;",
    mobile: "left: calc(50% - 180px);",
  })};

  ${getCurrentLayoutProperty({
    default: "top: 24px;",
    tablet: "top: 16px;",
    mobile: "bottom: 0;",
  })};
`;

export const Comparison = ({ mode }: ComparisonPageProps) => {
  let currentViewport: WebMercatorViewport = null;
  const [terrainTiles] = useState({});
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [selectedMapStyle] = useState(INITIAL_MAP_STYLE);
  const [activeLeftPanel, setActiveLeftPanel] = useState<ActiveButton>(
    ActiveButton.none
  );
  const [activeRightPanel, setActiveRightPanel] = useState<ActiveButton>(
    ActiveButton.none
  );
  const layout = useAppLayout();

  const onViewStateChange = ({ interactionState, viewState }) => {
    const { longitude, latitude, position } = viewState;

    const [, , oldElevation] = position || [0, 0, 0];
    const viewportCenterTerrainElevation =
      getElevationByCentralTile(longitude, latitude, terrainTiles) || 0;

    let cameraTerrainElevation = null;

    if (currentViewport) {
      const cameraPosition = currentViewport.unprojectPosition(
        currentViewport.cameraPosition
      );
      // @ts-expect-error - Type '0' is not assignable to type 'null'.
      cameraTerrainElevation =
        getElevationByCentralTile(
          cameraPosition[0],
          cameraPosition[1],
          terrainTiles
        ) || 0;
    }
    let elevation =
      cameraTerrainElevation === null ||
      viewportCenterTerrainElevation > cameraTerrainElevation
        ? viewportCenterTerrainElevation
        : cameraTerrainElevation;
    if (!interactionState.isZooming) {
      if (oldElevation - elevation > 5) {
        elevation = oldElevation - 5;
      } else if (elevation - oldElevation > 5) {
        elevation = oldElevation + 5;
      }
    }

    setViewState({
      ...viewState,
      position: [0, 0, elevation],
    });
  };

  const handleChangeLeftPanelVisibility = (active: ActiveButton) => {
    setActiveLeftPanel((prevValue) =>
      prevValue === active ? ActiveButton.none : active
    );
  };

  const handleChangeRightPanelVisibility = (active: ActiveButton) => {
    setActiveRightPanel((prevValue) =>
      prevValue === active ? ActiveButton.none : active
    );
  };

  const getLayerExamples = () => {
    return Object.keys(EXAMPLES).map((key) => {
      const example = EXAMPLES[key];

      return example;
    });
  };

  const layersExamples = useMemo(() => getLayerExamples(), [EXAMPLES]);

  return (
    <Container layout={layout}>
      <DeckWrapper layout={layout}>
        <DeckGL
          id="first-deck-container"
          layers={[]}
          viewState={viewState}
          views={[VIEW]}
          onViewStateChange={onViewStateChange}
          controller={CONTROLLER_PROPS}
        >
          {({ viewport }) => {
            currentViewport = viewport;
          }}
          <StaticMap mapStyle={selectedMapStyle} preventStyleDiffing />
        </DeckGL>
        <LeftSideToolsPanelWrapper layout={layout}>
          <MainToolsPanel
            id="tools-panel-left"
            active={activeLeftPanel}
            showSettings={mode === ComparisonMode.withinLayer}
            onChange={handleChangeLeftPanelVisibility}
          />
        </LeftSideToolsPanelWrapper>
        {activeLeftPanel === ActiveButton.options && (
          <LeftLayersPanelWrapper layout={layout}>
            <LayersPanel
              id="left-layers-panel"
              layers={layersExamples}
              type={ListItemType.Radio}
              baseMaps={[]}
              multipleSelection={false}
              onLayerInsert={function (): void {
                throw new Error("Function not implemented.");
              }}
              onSceneInsert={function (): void {
                throw new Error("Function not implemented.");
              }}
              onBaseMapInsert={function (): void {
                throw new Error("Function not implemented.");
              }}
              onClose={() =>
                handleChangeLeftPanelVisibility(ActiveButton.options)
              }
            />
          </LeftLayersPanelWrapper>
        )}
      </DeckWrapper>

      <Devider layout={layout} />
      <DeckWrapper layout={layout}>
        <DeckGL
          id="second-deck-container"
          layers={[]}
          viewState={viewState}
          views={[VIEW]}
          onViewStateChange={onViewStateChange}
          controller={CONTROLLER_PROPS}
        >
          {({ viewport }) => {
            currentViewport = viewport;
          }}
          <StaticMap mapStyle={selectedMapStyle} preventStyleDiffing />
        </DeckGL>
        <RightSideToolsPanelWrapper layout={layout}>
          <MainToolsPanel
            id="tools-panel-right"
            active={activeRightPanel}
            showOptions={mode === ComparisonMode.acrossLayers}
            showSettings={mode === ComparisonMode.withinLayer}
            onChange={handleChangeRightPanelVisibility}
          />
        </RightSideToolsPanelWrapper>
        {activeRightPanel === ActiveButton.options && (
          <RightLayersPanelWrapper layout={layout}>
            <LayersPanel
              id="right-layers-panel"
              layers={layersExamples}
              type={ListItemType.Radio}
              baseMaps={[]}
              multipleSelection={false}
              onLayerInsert={function (): void {
                throw new Error("Function not implemented.");
              }}
              onSceneInsert={function (): void {
                throw new Error("Function not implemented.");
              }}
              onBaseMapInsert={function (): void {
                throw new Error("Function not implemented.");
              }}
              onClose={() =>
                handleChangeRightPanelVisibility(ActiveButton.options)
              }
            />
          </RightLayersPanelWrapper>
        )}
      </DeckWrapper>
    </Container>
  );
};
