import { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import {
  MapController,
  FlyToInterpolator,
  COORDINATE_SYSTEM,
  MapView,
  WebMercatorViewport,
} from "@deck.gl/core";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import { I3SLoader, I3SBuildingSceneLayerLoader } from "@loaders.gl/i3s";
import { load } from "@loaders.gl/core";
import { Tile3D, Tileset3D } from "@loaders.gl/tiles";
import styled from "styled-components";
import { StaticMap } from "react-map-gl";

import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import {
  buildSublayersTree,
  getElevationByCentralTile,
  parseTilesetUrlParams,
  useForceUpdate,
} from "../../utils";
import { INITIAL_MAP_STYLE } from "../../constants/map-styles";
import { color_brand_primary } from "../../constants/colors";
import { MainToolsPanel } from "../../components/main-tools-panel/main-tools-panel";
import {
  ActiveButton,
  ComparisonMode,
  LayerExample,
  ListItemType,
  Sublayer,
} from "../../types";
import { LayersPanel } from "../../components/layers-panel/layers-panel";
import { BuildingSceneSublayer } from "@loaders.gl/i3s/dist/types";

const TRANSITION_DURAITON = 4000;

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
    desktop: "row",
    tablet: "column",
    mobile: "column-reverse",
  })};
  margin-top: 58px;
  height: calc(100% - 60px);
`;

const DeckWrapper = styled.div<LayoutProps>`
  width: ${getCurrentLayoutProperty({
    desktop: "50%",
    tablet: "100%",
    mobile: "100%",
  })};
  height: 100%;
  position: relative;
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

const LeftSideToolsPanelWrapper = styled.div<LayoutProps>`
  position: absolute;

  left: ${getCurrentLayoutProperty({
    desktop: "24px",
    tablet: "24px",
    mobile: "8px",
  })};

  ${getCurrentLayoutProperty({
    desktop: "top: 24px;",
    tablet: "top: 16px;",
    mobile: "bottom: 8px;",
  })};
`;

const RightSideToolsPanelWrapper = styled(LeftSideToolsPanelWrapper)`
  left: auto;
  top: auto;

  ${getCurrentLayoutProperty({
    desktop: "right 24px",
    tablet: "left 24px",
    mobile: "left 8px",
  })};

  ${getCurrentLayoutProperty({
    desktop: "top: 24px;",
    tablet: "top: 16px;",
    mobile: "bottom: 8px;",
  })};
`;

const LeftLayersPanelWrapper = styled.div<LayoutProps>`
  position: absolute;

  left: ${getCurrentLayoutProperty({
    desktop: "100px",
    tablet: "100px",
    /**
     * Make mobile panel centered horisontally
     * 180px is half the width of the mobile layers panel
     *  */
    mobile: "calc(50% - 180px)",
  })};

  ${getCurrentLayoutProperty({
    desktop: "top: 24px;",
    tablet: "top: 16px;",
    mobile: "bottom: 8px;",
  })};
`;

const RightLayersPanelWrapper = styled(LeftLayersPanelWrapper)`
  left: auto;
  top: auto;

  ${getCurrentLayoutProperty({
    desktop: "right 100px;",
    tablet: "left: 100px;",
    /**
     * Make mobile panel centered horisontally
     * 180px is half the width of the mobile layers panel
     *  */
    mobile: "left: calc(50% - 180px);",
  })};

  ${getCurrentLayoutProperty({
    desktop: "top: 24px;",
    tablet: "top: 16px;",
    mobile: "bottom: 8px;",
  })};
`;

export const Comparison = ({ mode }: ComparisonPageProps) => {
  let currentViewport: WebMercatorViewport = null;
  const forceUpdate = useForceUpdate();
  const [terrainTiles] = useState({});
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [selectedMapStyle] = useState(INITIAL_MAP_STYLE);
  const [activeLeftPanel, setActiveLeftPanel] = useState<ActiveButton>(
    ActiveButton.none
  );
  const [activeRightPanel, setActiveRightPanel] = useState<ActiveButton>(
    ActiveButton.none
  );
  const [layerLeftSide, setLayerLeftSide] = useState<LayerExample | null>(null);
  const [layerRightSide, setLayerRightSide] = useState<LayerExample | null>(
    null
  );
  const [flattenedSublayersLeftSide, setFlattenedSublayersLeftSide] = useState<
    BuildingSceneSublayer[]
  >([]);
  const [flattenedSublayersRightSide, setFlattenedSublayersRightSide] =
    useState<BuildingSceneSublayer[]>([]);
  const [tokenLeftSide, setTokenLeftSide] = useState(null);
  const [tokenRightSide, setTokenRightSide] = useState(null);
  const [sublayersLeftSide, setSublayersLeftSide] = useState<Sublayer[]>([]);
  const [sublayersRightSide, setSublayersRightSide] = useState<Sublayer[]>([]);
  const [needTransitionToTileset, setNeedTransitionToTileset] = useState(true);

  useEffect(() => {
    setActiveRightPanel(ActiveButton.none);
    setActiveLeftPanel(ActiveButton.none);
    setLayerLeftSide(null);
    setLayerRightSide(null);
  }, [mode]);

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

  /**
   * Hook to call multiple changing function based on selected tileset on the left side.
   */
  useEffect(() => {
    if (!layerLeftSide) {
      setFlattenedSublayersLeftSide([]);
      return;
    }

    async function fetchFlattenedSublayers(tilesetUrl) {
      const flattenedSublayers = await getFlattenedSublayers(
        tilesetUrl,
        "left"
      );
      setFlattenedSublayersLeftSide(flattenedSublayers);
    }

    const params = parseTilesetUrlParams(layerLeftSide.url, layerLeftSide);
    const { tilesetUrl, token } = params;

    fetchFlattenedSublayers(tilesetUrl);

    setTokenLeftSide(token);
    setSublayersLeftSide([]);
    setNeedTransitionToTileset(true);
  }, [layerLeftSide]);

  /**
   * Hook to call multiple changing function based on selected tileset on the right side.
   */
  useEffect(() => {
    if (!layerRightSide) {
      setFlattenedSublayersRightSide([]);
      return;
    }

    async function fetchFlattenedSublayers(tilesetUrl) {
      const flattenedSublayers = await getFlattenedSublayers(
        tilesetUrl,
        "right"
      );
      setFlattenedSublayersRightSide(flattenedSublayers);
    }

    const params = parseTilesetUrlParams(layerRightSide.url, layerRightSide);
    const { tilesetUrl, token } = params;

    fetchFlattenedSublayers(tilesetUrl);

    setTokenRightSide(token);
    setSublayersRightSide([]);
    setNeedTransitionToTileset(true);
  }, [layerRightSide]);

  /**
   * Tries to get Building Scene Layer sublayer urls if exists.
   * @param {string} tilesetUrl
   * @returns {string[]} Sublayer urls or tileset url.
   * TODO Add filtration mode for sublayers which were selected by user.
   */
  const getFlattenedSublayers = async (tilesetUrl, side: "left" | "right") => {
    try {
      const tileset = await load(tilesetUrl, I3SBuildingSceneLayerLoader);
      const sublayersTree = buildSublayersTree(tileset.header.sublayers);
      const childSublayers = sublayersTree?.sublayers || [];
      if (side === "left") {
        setSublayersLeftSide(childSublayers);
      } else if (side === "right") {
        setSublayersRightSide(childSublayers);
      }

      const sublayers = tileset?.sublayers.filter(
        (sublayer) => sublayer.name !== "Overview"
      );
      return sublayers;
    } catch (e) {
      return [{ url: tilesetUrl, visibility: true }];
    }
  };

  const onTilesetLoad = (tileset: Tileset3D) => {
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
        transitionDuration: TRANSITION_DURAITON,
        transitionInterpolator: new FlyToInterpolator(),
      });
      setNeedTransitionToTileset(false);
    }
  };

  const getLayers = (side: "left" | "right"): any[] => {
    let flattenedSublayers = flattenedSublayersLeftSide;
    let token = tokenLeftSide;
    if (side === "right") {
      flattenedSublayers = flattenedSublayersRightSide;
      token = tokenRightSide;
    }
    let result: any[] = [];
    if (flattenedSublayers) {
      const loadOptions: {
        i3s: {
          coordinateSystem: number;
          token?: string;
        };
      } = {
        i3s: { coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS },
      };

      if (token) {
        loadOptions.i3s = { ...loadOptions.i3s, token };
      }

      result = [
        ...result,
        ...flattenedSublayers
          .filter((sublayer) => sublayer.visibility)
          .map(
            (sublayer) =>
              new Tile3DLayer({
                id: `tile-layer-${sublayer.id}`,
                data: sublayer.url,
                loader: I3SLoader,
                onTilesetLoad: onTilesetLoad,
                pickable: false,
                loadOptions,
              })
          ),
      ];
    }
    return result;
  };

  const updateSublayerVisibility = (
    sublayer: Sublayer,
    side: "left" | "right"
  ) => {
    if (sublayer.layerType === "3DObject") {
      const flattenedSublayers =
        side === "left"
          ? flattenedSublayersLeftSide
          : flattenedSublayersRightSide;
      const flattenedSublayer = flattenedSublayers.find(
        (fSublayer) => fSublayer.id === sublayer.id
      );
      if (flattenedSublayer) {
        flattenedSublayer.visibility = sublayer.visibility;
        forceUpdate();
      }
    }
  };

  return (
    <Container layout={layout}>
      <DeckWrapper layout={layout}>
        <DeckGL
          id="first-deck-container"
          layers={getLayers("left")}
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
            activeButton={activeLeftPanel}
            showComparisonSettings={mode === ComparisonMode.withinLayer}
            onChange={handleChangeLeftPanelVisibility}
          />
        </LeftSideToolsPanelWrapper>
        {activeLeftPanel === ActiveButton.options && (
          <LeftLayersPanelWrapper layout={layout}>
            <LayersPanel
              id="left-layers-panel"
              type={ListItemType.Radio}
              baseMaps={[]}
              sublayers={sublayersLeftSide}
              onUpdateSublayerVisibility={(sublayer: Sublayer) =>
                updateSublayerVisibility(sublayer, "left")
              }
              onLayersSelect={(layers: LayerExample[]) => {
                setLayerLeftSide(layers[0]);
                if (mode === ComparisonMode.withinLayer) {
                  setLayerRightSide(layers[0]);
                }
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
          layers={getLayers("right")}
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
            activeButton={activeRightPanel}
            showLayerOptions={mode === ComparisonMode.acrossLayers}
            showComparisonSettings={mode === ComparisonMode.withinLayer}
            onChange={handleChangeRightPanelVisibility}
          />
        </RightSideToolsPanelWrapper>
        {activeRightPanel === ActiveButton.options && (
          <RightLayersPanelWrapper layout={layout}>
            <LayersPanel
              id="right-layers-panel"
              onLayersSelect={(layers: LayerExample[]) =>
                setLayerRightSide(layers[0])
              }
              type={ListItemType.Radio}
              baseMaps={[]}
              sublayers={sublayersRightSide}
              onUpdateSublayerVisibility={(sublayer: Sublayer) =>
                updateSublayerVisibility(sublayer, "right")
              }
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
