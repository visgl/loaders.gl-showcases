import { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import { TerrainLayer, Tile3DLayer } from "@deck.gl/geo-layers";
import {
  MapController,
  FlyToInterpolator,
  COORDINATE_SYSTEM,
  MapView,
  WebMercatorViewport,
} from "@deck.gl/core";
import { I3SLoader, I3SBuildingSceneLayerLoader } from "@loaders.gl/i3s";
import { load } from "@loaders.gl/core";
import { Tileset3D } from "@loaders.gl/tiles";
import styled from "styled-components";
import { StaticMap } from "react-map-gl";

import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import { MAP_STYLES } from "../../constants/map-styles";
import {
  buildSublayersTree,
  getElevationByCentralTile,
  parseTilesetUrlParams,
  useForceUpdate,
} from "../../utils";
import { color_brand_primary } from "../../constants/colors";
import { MainToolsPanel } from "../../components/main-tools-panel/main-tools-panel";
import {
  ActiveButton,
  ComparisonMode,
  LayerExample,
  ListItemType,
  Sublayer,
  BaseMap,
} from "../../types";

import { LayersPanel } from "../../components/comparison/layers-panel/layers-panel";
import { ComparisonParamsPanel } from "../../components/comparison/comparison-params-panel/comparison-params-panel";
import { BuildingSceneSublayer } from "@loaders.gl/i3s/dist/types";

import { EXAMPLES } from "../../constants/i3s-examples";

import DarkMap from "../../../public/icons/dark-map.png";
import LightMap from "../../../public/icons/light-map.png";
import TerrainMap from "../../../public/icons/terrain-map.png";
import { MapControllPanel } from "../../components/map-control-panel/map-control-panel";

export const BASE_MAPS: BaseMap[] = [
  {
    id: "Dark",
    name: "Dark",
    iconUrl: DarkMap,
    mapUrl: MAP_STYLES.Dark,
  },
  {
    id: "Light",
    name: "Light",
    iconUrl: LightMap,
    mapUrl: MAP_STYLES.Light,
  },
  { id: "Terrain", name: "Terrain", iconUrl: TerrainMap, mapUrl: null },
];

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

const LeftPanelWrapper = styled.div<LayoutProps>`
  position: absolute;
  z-index: 2;

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

const RightPanelWrapper = styled(LeftPanelWrapper)`
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

  const [examplesLeftSide, setExamplesLeftSide] =
    useState<LayerExample[]>(EXAMPLES);
  const [examplesRightSide, setExamplesRightSide] =
    useState<LayerExample[]>(EXAMPLES);
  const [baseMaps, setBaseMaps] = useState<BaseMap[]>(BASE_MAPS);
  const [selectedBaseMap, setSelectedBaseMap] = useState<BaseMap>(BASE_MAPS[0]);
  const [terrainTiles, setTerrainTiles] = useState({});
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
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
  const [tilesetLeftSide, setTilesetLeftSide] = useState<Tileset3D | null>(
    null
  );
  const [tilesetRightSide, setTilesetRightSide] = useState<Tileset3D | null>(
    null
  );
  const [needTransitionToTileset, setNeedTransitionToTileset] = useState(true);
  const [isCompressedGeometryLeft, setIsCompressedGeometryLeft] =
    useState<boolean>(false);
  const [isCompressedTexturesLeft, setIsCompressedTexturesLeft] =
    useState<boolean>(false);
  const [isCompressedGeometryRight, setIsCompressedGeometryRight] =
    useState<boolean>(false);
  const [isCompressedTexturesRight, setIsCompressedTexturesRight] =
    useState<boolean>(false);
  const [counter, setCounter] = useState(0);

  const MAPZEN_TERRAIN_IMAGES = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`;
  const ARCGIS_STREET_MAP_SURFACE_IMAGES =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const MAPZEN_ELEVATION_DECODE_PARAMETERS = {
    rScaler: 256,
    gScaler: 1,
    bScaler: 1 / 256,
    offset: -32768,
  };
  const TERRAIN_LAYER_MAX_ZOOM = 15;

  useEffect(() => {
    if (mode === ComparisonMode.acrossLayers) {
      setActiveRightPanel(ActiveButton.options);
    } else {
      setActiveRightPanel(ActiveButton.none);
    }
    setActiveLeftPanel(ActiveButton.options);
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

  const onPointToLayer = (side: "left" | "right") => {
    if (side === "left" && tilesetLeftSide) {
      pointToTileset(tilesetLeftSide);
    }
    if (side === "right" && tilesetRightSide) {
      pointToTileset(tilesetRightSide);
    }
  };

  const onTerrainTileLoad = (tile) => {
    const {
      bbox: { east, north, south, west },
    } = tile;

    setTerrainTiles((prevValue) => ({
      ...prevValue,
      [`${east};${north};${south};${west}`]: tile,
    }));
  };

  const renderTerrainLayer = () => {
    return new TerrainLayer({
      id: "terrain",
      maxZoom: TERRAIN_LAYER_MAX_ZOOM,
      elevationDecoder: MAPZEN_ELEVATION_DECODE_PARAMETERS,
      elevationData: MAPZEN_TERRAIN_IMAGES,
      texture: ARCGIS_STREET_MAP_SURFACE_IMAGES,
      onTileLoad: (tile) => onTerrainTileLoad(tile),
      color: [255, 255, 255],
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

  const pointToTileset = (tileset: Tileset3D) => {
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
  };

  const onTilesetLoad = (tileset: Tileset3D, side: "left" | "right") => {
    if (needTransitionToTileset) {
      if (side === "left") {
        setTilesetLeftSide(tileset);
      } else {
        setTilesetRightSide(tileset);
      }
      pointToTileset(tileset);
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
          useDracoGeometry: boolean;
          useCompressedTextures: boolean;
        };
      } = {
        i3s: {
          coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
          useDracoGeometry:
            side === "left"
              ? isCompressedGeometryLeft
              : isCompressedGeometryRight,
          useCompressedTextures:
            side === "left"
              ? isCompressedTexturesLeft
              : isCompressedTexturesRight,
        },
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
                id: `tile-layer-${sublayer.id}${counter}`,
                data: sublayer.url,
                loader: I3SLoader,
                onTilesetLoad: (tileset: Tileset3D) =>
                  onTilesetLoad(tileset, side),
                pickable: false,
                loadOptions,
              })
          ),
      ];
    }

    if (selectedBaseMap.id === "Terrain") {
      const terrainLayer = renderTerrainLayer();
      result.push(terrainLayer);
    }

    return result;
  };

  const handleGeometryChangeLeft = () => {
    setCounter((prevValue) => prevValue + 1);
    setIsCompressedGeometryLeft((prevValue) => !prevValue);
  };

  const handleTexturesChangeLeft = () => {
    setCounter((prevValue) => prevValue + 1);
    setIsCompressedTexturesLeft((prevValue) => !prevValue);
  };

  const handleGeometryChangeRight = () => {
    setCounter((prevValue) => prevValue + 1);
    setIsCompressedGeometryRight((prevValue) => !prevValue);
  };

  const handleTexturesChangeRight = () => {
    setCounter((prevValue) => prevValue + 1);
    setIsCompressedTexturesRight((prevValue) => !prevValue);
  };

  const handleInsertExample = (
    newLayer: LayerExample,
    side: "left" | "right"
  ) => {
    switch (side) {
      case "left":
        setExamplesLeftSide((prevValues) => [...prevValues, newLayer]);
        setLayerLeftSide(newLayer);
        break;
      case "right":
        setExamplesRightSide((prevValues) => [...prevValues, newLayer]);
        setLayerRightSide(newLayer);
        break;
    }
  };

  const handleDeleteExample = (id: string, side: "left" | "right") => {
    switch (side) {
      case "left":
        setExamplesLeftSide((prevValues) =>
          prevValues.filter((example) => example.id !== id)
        );
        setLayerLeftSide(null);
        break;
      case "right":
        setExamplesRightSide((prevValues) =>
          prevValues.filter((example) => example.id !== id)
        );
        setLayerRightSide(null);
        break;
    }
  };

  const handleSelectExample = (id: string, side: "left" | "right") => {
    switch (side) {
      case "left": {
        const selectedExample = examplesLeftSide.find(
          (example) => example.id === id
        );

        if (selectedExample) {
          if (mode === ComparisonMode.withinLayer) {
            setLayerRightSide(selectedExample);
          }

          setLayerLeftSide(selectedExample);
        }

        break;
      }
      case "right": {
        const selectedExample = examplesRightSide.find(
          (example) => example.id === id
        );

        if (selectedExample) {
          setLayerRightSide(selectedExample);
        }
      }
    }
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

  const handleInsertBaseMap = (baseMap: BaseMap) => {
    setBaseMaps((prevValues) => [...prevValues, baseMap]);
    setSelectedBaseMap(baseMap);
  };

  const handleSelectBaseMap = (baseMapId: string) => {
    const baseMap = baseMaps.find((map) => map.id === baseMapId);

    if (baseMap) {
      setSelectedBaseMap(baseMap);
    }
  };

  const handleDeleteBaseMap = (baseMapId: string) => {
    setBaseMaps((prevValues) =>
      prevValues.filter((baseMap) => baseMap.id !== baseMapId)
    );

    setSelectedBaseMap(BASE_MAPS[0]);
  };

  const selectedLeftSideLayerIds = layerLeftSide ? [layerLeftSide.id] : [];
  const selectedRightSideLayerIds = layerRightSide ? [layerRightSide.id] : [];

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
          {selectedBaseMap.id !== "Terrain" && (
            <StaticMap mapStyle={selectedBaseMap.mapUrl} preventStyleDiffing />
          )}
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
          <LeftPanelWrapper layout={layout}>
            <LayersPanel
              id="left-layers-panel"
              type={ListItemType.Radio}
              layers={examplesLeftSide}
              selectedLayerIds={selectedLeftSideLayerIds}
              onLayerInsert={(newLayer) =>
                handleInsertExample(newLayer, "left")
              }
              onLayerSelect={(id: string) => handleSelectExample(id, "left")}
              onLayerDelete={(id) => handleDeleteExample(id, "left")}
              sublayers={sublayersLeftSide}
              onUpdateSublayerVisibility={(sublayer: Sublayer) => {
                updateSublayerVisibility(sublayer, "left");
                if (mode === ComparisonMode.withinLayer) {
                  updateSublayerVisibility(sublayer, "right");
                }
              }}
              onPointToLayer={() => onPointToLayer("left")}
              onClose={() =>
                handleChangeLeftPanelVisibility(ActiveButton.options)
              }
              baseMaps={baseMaps}
              selectedBaseMapId={selectedBaseMap.id}
              insertBaseMap={handleInsertBaseMap}
              selectBaseMap={handleSelectBaseMap}
              deleteBaseMap={handleDeleteBaseMap}
            />
          </LeftPanelWrapper>
        )}
        {activeLeftPanel === ActiveButton.settings && (
          <LeftPanelWrapper layout={layout}>
            <ComparisonParamsPanel
              id="left-comparison-params-panel"
              isCompressedGeometry={isCompressedGeometryLeft}
              isCompressedTextures={isCompressedTexturesLeft}
              onGeometryChange={handleGeometryChangeLeft}
              onTexturesChange={handleTexturesChangeLeft}
              onClose={() =>
                handleChangeLeftPanelVisibility(ActiveButton.settings)
              }
            />
          </LeftPanelWrapper>
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
          {selectedBaseMap.id !== "Terrain" && (
            <StaticMap mapStyle={selectedBaseMap.mapUrl} preventStyleDiffing />
          )}
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
          <RightPanelWrapper layout={layout}>
            <LayersPanel
              id="right-layers-panel"
              layers={examplesRightSide}
              selectedLayerIds={selectedRightSideLayerIds}
              onLayerInsert={(newLayer) =>
                handleInsertExample(newLayer, "right")
              }
              onLayerSelect={(id: string) => handleSelectExample(id, "right")}
              onLayerDelete={(id) => handleDeleteExample(id, "right")}
              onPointToLayer={() => onPointToLayer("right")}
              type={ListItemType.Radio}
              sublayers={sublayersRightSide}
              onUpdateSublayerVisibility={(sublayer: Sublayer) =>
                updateSublayerVisibility(sublayer, "right")
              }
              onClose={() =>
                handleChangeRightPanelVisibility(ActiveButton.options)
              }
              baseMaps={baseMaps}
              selectedBaseMapId={selectedBaseMap.id}
              insertBaseMap={handleInsertBaseMap}
              selectBaseMap={handleSelectBaseMap}
              deleteBaseMap={handleDeleteBaseMap}
            />
          </RightPanelWrapper>
        )}
        {activeRightPanel === ActiveButton.settings && (
          <RightPanelWrapper layout={layout}>
            <ComparisonParamsPanel
              id="right-comparison-params-panel"
              isCompressedGeometry={isCompressedGeometryRight}
              isCompressedTextures={isCompressedTexturesRight}
              onGeometryChange={handleGeometryChangeRight}
              onTexturesChange={handleTexturesChangeRight}
              onClose={() =>
                handleChangeRightPanelVisibility(ActiveButton.settings)
              }
            />
          </RightPanelWrapper>
        )}
      </DeckWrapper>
      <MapControllPanel />
    </Container>
  );
};
