import { useEffect, useState } from "react";
import { I3SBuildingSceneLayerLoader } from "@loaders.gl/i3s";
import { load } from "@loaders.gl/core";
import { Tileset3D } from "@loaders.gl/tiles";
import styled from "styled-components";

import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import {
  buildSublayersTree,
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
  ViewStateSet,
  DragMode,
} from "../../types";

import { LayersPanel } from "../../components/comparison/layers-panel/layers-panel";
import { ComparisonParamsPanel } from "../../components/comparison/comparison-params-panel/comparison-params-panel";
import { BuildingSceneSublayer } from "@loaders.gl/i3s/dist/types";
import { EXAMPLES } from "../../constants/i3s-examples";
import { MapControllPanel } from "../../components/map-control-panel/map-control-panel";
import { DeckGlI3s } from "../../components/deck-gl-i3s/deck-gl-i3s";
import { BASE_MAPS } from "../../constants/map-styles";

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
  const forceUpdate = useForceUpdate();

  const [dragMode, setDragMode] = useState<DragMode>(DragMode.pan);
  const [examplesLeftSide, setExamplesLeftSide] =
    useState<LayerExample[]>(EXAMPLES);
  const [examplesRightSide, setExamplesRightSide] =
    useState<LayerExample[]>(EXAMPLES);
  const [baseMaps, setBaseMaps] = useState<BaseMap[]>(BASE_MAPS);
  const [selectedBaseMap, setSelectedBaseMap] = useState<BaseMap>(BASE_MAPS[0]);
  const [viewState, setViewState] = useState<ViewStateSet>(INITIAL_VIEW_STATE);
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
    useState<boolean>(true);
  const [isCompressedTexturesLeft, setIsCompressedTexturesLeft] =
    useState<boolean>(true);
  const [isCompressedGeometryRight, setIsCompressedGeometryRight] =
    useState<boolean>(true);
  const [isCompressedTexturesRight, setIsCompressedTexturesRight] =
    useState<boolean>(true);

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

  const onViewStateChange = (viewStateSet: ViewStateSet) => {
    setViewState(viewStateSet);
  };

  const onPointToLayer = (side: "left" | "right") => {
    if (side === "left" && tilesetLeftSide) {
      pointToTileset(tilesetLeftSide);
    }
    if (side === "right" && tilesetRightSide) {
      pointToTileset(tilesetRightSide);
    }
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
    });
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

  const onTilesetLoad = (tileset: Tileset3D, side: "left" | "right") => {
    if (needTransitionToTileset) {
      if (side === "left") {
        setTilesetLeftSide(tileset);
      } else {
        setTilesetRightSide(tileset);
      }
    }
  };

  const handleGeometryChangeLeft = () => {
    setIsCompressedGeometryLeft((prevValue) => !prevValue);
  };

  const handleTexturesChangeLeft = () => {
    setIsCompressedTexturesLeft((prevValue) => !prevValue);
  };

  const handleGeometryChangeRight = () => {
    setIsCompressedGeometryRight((prevValue) => !prevValue);
  };

  const handleTexturesChangeRight = () => {
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

  const getI3sLayers = (side: "left" | "right") => {
    const flattenedSublayers =
      side === "left"
        ? flattenedSublayersLeftSide
        : flattenedSublayersRightSide;
    const token = side === "left" ? tokenLeftSide : tokenRightSide;
    return flattenedSublayers
      .filter((sublayer) => sublayer.visibility)
      .map((sublayer) => ({
        id: sublayer.id,
        url: sublayer.url,
        token,
      }));
  };

  return (
    <Container layout={layout}>
      <DeckWrapper layout={layout}>
        <DeckGlI3s
          id="first-deck-container"
          parentViewState={viewState}
          dragMode={dragMode}
          showTerrain={selectedBaseMap.id === "Terrain"}
          mapStyle={selectedBaseMap.mapUrl}
          i3sLayers={getI3sLayers("left")}
          lastLayerSelectedId={tilesetLeftSide?.url || ""}
          useDracoGeometry={isCompressedGeometryLeft}
          useCompressedTextures={isCompressedTexturesLeft}
          onViewStateChange={onViewStateChange}
          onTilesetLoad={(tileset: Tileset3D) => onTilesetLoad(tileset, "left")}
        />
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
        <DeckGlI3s
          id="second-deck-container"
          parentViewState={{
            ...viewState,
            main: {
              ...viewState.main,
              transitionDuration: undefined,
              transitionInterpolator: undefined,
            },
          }}
          dragMode={dragMode}
          showTerrain={selectedBaseMap.id === "Terrain"}
          mapStyle={selectedBaseMap.mapUrl}
          i3sLayers={getI3sLayers("right")}
          lastLayerSelectedId={tilesetRightSide?.url || ""}
          useDracoGeometry={isCompressedGeometryRight}
          useCompressedTextures={isCompressedTexturesRight}
          onViewStateChange={onViewStateChange}
          onTilesetLoad={(tileset: Tileset3D) =>
            onTilesetLoad(tileset, "right")
          }
        />
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
      <MapControllPanel
        dragMode={dragMode}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onDragModeToggle={toggleDragMode}
      />
    </Container>
  );
};
