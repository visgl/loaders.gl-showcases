import { useState } from "react";
import DeckGL from "@deck.gl/react";
import {
  MapController,
  FlyToInterpolator,
  COORDINATE_SYSTEM,
  MapView,
  WebMercatorViewport,
} from "@deck.gl/core";
import styled from "styled-components";

import { StaticMap } from "react-map-gl";
import { Tileset3D } from "@loaders.gl/tiles";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import { I3SLoader } from "@loaders.gl/i3s";
import { getElevationByCentralTile } from "../../utils";
import { INITIAL_MAP_STYLE } from "../../constants/map-styles";
import { TRANSITION_DURATION } from "../../constants/i3s-examples";
import { darkGrey } from "../../constants/colors";
import { MainToolsPanel } from "../../components/main-tools-panel/main-tools-panel";
import { ComparisonMode } from "../../utils/enums";

interface ComparisonPageProps {
  mode: ComparisonMode;
}

interface LayoutProps {
  layout: string;
}

const INITIAL_VIEW_STATE = {
  longitude: -120,
  latitude: 34,
  pitch: 45,
  maxPitch: 90,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  zoom: 14.5,
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
  z-index: 10;

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

export const Comparison = ({ mode }: ComparisonPageProps) => {
  let currentViewport: WebMercatorViewport = null;
  const [terrainTiles] = useState({});
  const [metadata] = useState({ layers: [] });
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [needTransitionToTileset, setNeedTransitionToTileset] = useState(true);
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

  const onTilesetLoad = (tileset: Tileset3D) => {
    if (needTransitionToTileset) {
      const { zoom, cartographicCenter } = tileset;
      const [longitude, latitude] = cartographicCenter || [];
      const viewport = currentViewport;
      let pLongitue = longitude;
      let pLatitude = latitude;

      if (viewport) {
        const { pitch, bearing } = viewState;
        // @ts-expect-error - roperty 'fullExtent' does not exist on type 'never'.
        const { zmin = 0 } = metadata?.layers?.[0]?.fullExtent || {};
        /**
         * See image in the PR https://github.com/visgl/loaders.gl/pull/2046
         * For elevated tilesets cartographic center position of a tileset is not correct
         * to use it as viewState position because these positions are different.
         * We need to calculate projection of camera direction onto the ellipsoid surface.
         * We use this projection as offset to add it to the tileset cartographic center position.
         */
        const projection = zmin * Math.tan((pitch * Math.PI) / 180);
        /**
         * Convert to world coordinate system to shift the position on some distance in meters
         */
        const projectedPostion = viewport.projectPosition([
          longitude,
          latitude,
        ]);
        /**
         * Shift longitude
         */
        projectedPostion[0] +=
          projection *
          Math.sin((bearing * Math.PI) / 180) *
          viewport.distanceScales.unitsPerMeter[0];
        /**
         * Shift latitude
         */
        projectedPostion[1] +=
          projection *
          Math.cos((bearing * Math.PI) / 180) *
          viewport.distanceScales.unitsPerMeter[1];
        /**
         * Convert resulting coordinates to catrographic
         */

        [pLongitue, pLatitude] = viewport.unprojectPosition(projectedPostion);
      }

      const newViewState = {
        ...viewState,
        zoom: zoom + 2.5,
        longitude: pLongitue,
        latitude: pLatitude,
      };

      setViewState({
        ...newViewState,
        transitionDuration: TRANSITION_DURATION,
        transitionInterpolator: new FlyToInterpolator(),
      });
      setNeedTransitionToTileset(false);
    }
  };

  const loadOptions: {
    i3s: {
      coordinateSystem: number;
      token?: string;
    };
  } = {
    i3s: { coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS },
  };
  const layers1 = [
    new Tile3DLayer({
      id: `tile-layer-1`,
      data: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
      loader: I3SLoader,
      onTilesetLoad: onTilesetLoad,
      loadOptions,
    }),
  ];
  const layers2 = [
    new Tile3DLayer({
      id: `tile-layer-2`,
      data: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
      loader: I3SLoader,
      onTilesetLoad: onTilesetLoad,
      loadOptions,
    }),
  ];

  return (
    <Container layout={layout}>
      <DeckWrapper layout={layout}>
        <LeftSideToolsPanelWrapper layout={layout}>
          <MainToolsPanel
            id="tools-panel-left"
            showSettings={mode === ComparisonMode.withinLayer}
          />
        </LeftSideToolsPanelWrapper>
        <DeckGL
          id="first-deck-container"
          layers={layers1}
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
        <RightSideToolsPanelWrapper layout={layout}>
          <MainToolsPanel
            id="tools-panel-right"
            showOptions={mode === ComparisonMode.acrossLayers}
            showSettings={mode === ComparisonMode.withinLayer}
          />
        </RightSideToolsPanelWrapper>
        <DeckGL
          id="second-deck-container"
          layers={layers2}
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
