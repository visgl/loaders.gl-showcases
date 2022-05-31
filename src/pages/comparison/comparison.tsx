import { useState } from "react";
import DeckGL from "@deck.gl/react";
import {
  MapController,
  MapView,
  WebMercatorViewport,
} from "@deck.gl/core";
import styled from "styled-components";

import { StaticMap } from "react-map-gl";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import { getElevationByCentralTile } from "../../utils";
import { INITIAL_MAP_STYLE } from "../../constants/map-styles";
import { darkGrey } from "../../constants/colors";

interface layoutProps {
  layout: string;
}

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  pitch: 45,
  maxPitch: 90,
  bearing: 0,
  minZoom: 1,
  maxZoom: 30,
  zoom: 1,
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

const Container = styled.div<layoutProps>`
  display: flex;
  flex-direction: ${getCurrentLayoutProperty({
    default: "row",
    tablet: "column",
    mobile: "column",
  })};
  margin-top: 60px;
  height: calc(100% - 60px);
`;

const DeckWrapper = styled.div<layoutProps>`
  width: ${getCurrentLayoutProperty({
    default: "50%",
    tablet: "100%",
    mobile: "100%",
  })};
  height: 100%;
  position: relative;
`;

const Devider = styled.div<layoutProps>`
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

export const Comparison = () => {
  let currentViewport: WebMercatorViewport = null;
  const [terrainTiles] = useState({});
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [selectedMapStyle] = useState(INITIAL_MAP_STYLE);
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
      </DeckWrapper>
    </Container>
  );
};
