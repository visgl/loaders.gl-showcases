import { BuildingSceneSublayer } from "@loaders.gl/i3s/dist/types";
import { useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import { Tileset3D, Tile3D } from "@loaders.gl/tiles";
import { Stats } from "@probe.gl/stats";
import { load } from "@loaders.gl/core";
import { I3SBuildingSceneLayerLoader } from "@loaders.gl/i3s";

import {
  ActiveButton,
  BaseMap,
  ComparisonMode,
  ComparisonSideMode,
  LayerExample,
  ListItemType,
  Sublayer,
  ViewStateSet,
  CompareButtonMode,
  DragMode,
  StatsMap,
} from "../../../types";
import { getCurrentLayoutProperty, useAppLayout } from "../../../utils/layout";
import { DeckGlI3s } from "../../deck-gl-i3s/deck-gl-i3s";
import { MainToolsPanel } from "../../main-tools-panel/main-tools-panel";
import { EXAMPLES } from "../../../constants/i3s-examples";
import { LayersPanel } from "../layers-panel/layers-panel";
import {
  buildSublayersTree,
  parseTilesetUrlParams,
  useForceUpdate,
} from "../../../utils";
import { ComparisonParamsPanel } from "../comparison-params-panel/comparison-params-panel";
import { MemoryUsagePanel } from "../../../components/comparison/memory-usage-panel/memory-usage-panel";

type LayoutProps = {
  layout: string;
};

const Container = styled.div<LayoutProps>`
  width: ${getCurrentLayoutProperty({
    desktop: "50%",
    tablet: "100%",
    mobile: "100%",
  })};
  height: 100%;
  position: relative;
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

const LeftSidePanelWrapper = styled.div<LayoutProps>`
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

const RightSidePanelWrapper = styled(LeftSidePanelWrapper)`
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

type ComparisonSideProps = {
  mode: ComparisonMode;
  side: ComparisonSideMode;
  viewState: ViewStateSet;
  selectedBaseMap: BaseMap;
  baseMaps: BaseMap[];
  showLayerOptions: boolean;
  showComparisonSettings: boolean;
  staticLayer?: LayerExample | null;
  compareButtonMode: CompareButtonMode;
  dragMode: DragMode;
  loadingTime: number;
  loadTileset?: boolean;
  onViewStateChange: (viewStateSet: ViewStateSet) => void;
  pointToTileset: (tileset: Tileset3D) => void;
  onChangeLayer?: (layer: LayerExample) => void;
  onInsertBaseMap: (baseMap: BaseMap) => void;
  onSelectBaseMap: (baseMapId: string) => void;
  onDeleteBaseMap: (baseMapId: string) => void;
  disableButtonHandler: () => void;
  onTilesetLoaded: (stats: StatsMap) => void;
};

/** Delay to await asynchronous traversal of the tileset **/
const IS_LOADED_DELAY = 500;

export const ComparisonSide = ({
  mode,
  side,
  viewState,
  selectedBaseMap,
  baseMaps,
  showLayerOptions,
  showComparisonSettings,
  staticLayer,
  compareButtonMode,
  dragMode,
  loadingTime,
  loadTileset = true,
  onViewStateChange,
  pointToTileset,
  onChangeLayer,
  onInsertBaseMap,
  onSelectBaseMap,
  onDeleteBaseMap,
  disableButtonHandler,
  onTilesetLoaded,
}: ComparisonSideProps) => {
  const layout = useAppLayout();
  const [token, setToken] = useState(null);
  const [flattenedSublayers, setFlattenedSublayers] = useState<
    BuildingSceneSublayer[]
  >([]);
  const [tileset, setTileset] = useState<Tileset3D | null>(null);
  const [isCompressedGeometry, setIsCompressedGeometry] =
    useState<boolean>(true);
  const [isCompressedTextures, setIsCompressedTextures] =
    useState<boolean>(true);
  const [activeButton, setActiveButton] = useState<ActiveButton>(
    ActiveButton.none
  );
  const [examples, setExamples] = useState<LayerExample[]>(EXAMPLES);
  const [layer, setLayer] = useState<LayerExample | null>(null);
  const [sublayers, setSublayers] = useState<Sublayer[]>([]);
  const [tilesetStats, setTilesetStats] = useState<Stats | null>(null);
  const [memoryStats, setMemoryStats] = useState<Stats | null>(null);
  const [loadNumber, setLoadNumber] = useState<number>(0);

  useEffect(() => {
    if (showLayerOptions) {
      setActiveButton(ActiveButton.options);
    } else {
      setActiveButton(ActiveButton.none);
    }
    setLayer(null);
  }, [mode]);

  useEffect(() => {
    if (staticLayer) {
      setLayer(staticLayer);
    }
  }, [staticLayer]);

  useEffect(() => {
    if (compareButtonMode === CompareButtonMode.Comparing) {
      setActiveButton(ActiveButton.memory);
      setLoadNumber((prev) => prev + 1);
    }
  }, [compareButtonMode]);

  useEffect(() => {
    if (!layer || !loadTileset) {
      setFlattenedSublayers([]);
      return;
    }

    async function fetchFlattenedSublayers(tilesetUrl) {
      const flattenedSublayers = await getFlattenedSublayers(tilesetUrl);
      setFlattenedSublayers(flattenedSublayers);
    }

    const params = parseTilesetUrlParams(layer.url, layer);
    const { tilesetUrl, token } = params;

    fetchFlattenedSublayers(tilesetUrl);

    setToken(token);
    setSublayers([]);
    disableButtonHandler();
  }, [layer, loadTileset]);

  const getFlattenedSublayers = async (tilesetUrl) => {
    try {
      const tileset = await load(tilesetUrl, I3SBuildingSceneLayerLoader);
      const sublayersTree = buildSublayersTree(tileset.header.sublayers);
      const childSublayers = sublayersTree?.sublayers || [];
      setSublayers(childSublayers);
      const sublayers = tileset?.sublayers.filter(
        (sublayer) => sublayer.name !== "Overview"
      );
      return sublayers;
    } catch (e) {
      return [{ url: tilesetUrl, visibility: true }];
    }
  };

  const getI3sLayers = () => {
    return flattenedSublayers
      .filter((sublayer) => sublayer.visibility)
      .map((sublayer) => ({
        id: sublayer.id,
        url: sublayer.url,
        token,
      }));
  };

  const onTilesetLoadHandler = (tileset: Tileset3D) => {
    setTilesetStats(tileset.stats);
    setTileset(tileset);
    setTimeout(() => {
      if (tileset.isLoaded()) {
        onTilesetLoaded({
          url: tileset.url,
          tilesetStats: tileset.stats,
          memoryStats,
        });
      }
    }, IS_LOADED_DELAY);
  };

  const onTileLoad = (tile: Tile3D) => {
    setTimeout(() => {
      if (tile.tileset.isLoaded()) {
        onTilesetLoaded({
          url: tile.tileset.url,
          tilesetStats: tile.tileset.stats,
          memoryStats,
        });
      }
    }, IS_LOADED_DELAY);
  };

  const onWebGLInitialized = (gl) => {
    const stats = gl.stats.get("Memory Usage");
    setMemoryStats(stats);
  };

  const onChangeMainToolsPanelHandler = useCallback((active: ActiveButton) => {
    setActiveButton((prevValue) =>
      prevValue === active ? ActiveButton.none : active
    );
  }, []);

  const onLayerInsertHandler = useCallback((newLayer: LayerExample) => {
    setExamples((prevValues) => [...prevValues, newLayer]);
    setLayer(newLayer);
  }, []);

  const onLayerSelectHandler = useCallback((id: string) => {
    const selectedExample = examples.find((example) => example.id === id);

    if (selectedExample) {
      setLayer(selectedExample);
      onChangeLayer && onChangeLayer(selectedExample);
    }
  }, []);

  const onLayerDeleteHandler = useCallback((id: string) => {
    setExamples((prevValues) =>
      prevValues.filter((example) => example.id !== id)
    );
    setLayer(null);
  }, []);

  const onPointToLayerHandler = useCallback(() => {
    if (tileset) {
      pointToTileset(tileset);
    }
  }, [tileset]);

  const onUpdateSublayerVisibilityHandler = useCallback(
    (sublayer: Sublayer) => {
      if (sublayer.layerType === "3DObject") {
        const flattenedSublayer = flattenedSublayers.find(
          (fSublayer) => fSublayer.id === sublayer.id
        );
        if (flattenedSublayer) {
          flattenedSublayer.visibility = sublayer.visibility;
          useForceUpdate();
        }
      }
    },
    []
  );

  const onClose = useCallback(() => {
    onChangeMainToolsPanelHandler(ActiveButton.options);
  }, []);

  const selectedLayerIds = useMemo(() => (layer ? [layer.id] : []), [layer]);

  const ToolsPanelWrapper =
    side === ComparisonSideMode.left
      ? LeftSideToolsPanelWrapper
      : RightSideToolsPanelWrapper;

  const OptionsPanelWrapper =
    side === ComparisonSideMode.left
      ? LeftSidePanelWrapper
      : RightSidePanelWrapper;

  return (
    <Container layout={layout}>
      <DeckGlI3s
        id={`${side}-deck-container`}
        parentViewState={{
          ...viewState,
          main: {
            ...viewState.main,
          },
        }}
        showTerrain={selectedBaseMap.id === "Terrain"}
        mapStyle={selectedBaseMap.mapUrl}
        dragMode={dragMode}
        disableController={compareButtonMode === CompareButtonMode.Comparing}
        i3sLayers={getI3sLayers()}
        loadNumber={loadNumber}
        lastLayerSelectedId={tileset?.url || ""}
        useDracoGeometry={isCompressedGeometry}
        useCompressedTextures={isCompressedTextures}
        preventTransitions={compareButtonMode === CompareButtonMode.Comparing}
        onViewStateChange={onViewStateChange}
        onWebGLInitialized={onWebGLInitialized}
        onTilesetLoad={(tileset: Tileset3D) => onTilesetLoadHandler(tileset)}
        onTileLoad={onTileLoad}
      />
      {compareButtonMode === CompareButtonMode.Start && (
        <>
          <ToolsPanelWrapper layout={layout}>
            <MainToolsPanel
              id={`${side}-tools-panel`}
              activeButton={activeButton}
              showLayerOptions={showLayerOptions}
              showComparisonSettings={showComparisonSettings}
              onChange={onChangeMainToolsPanelHandler}
            />
          </ToolsPanelWrapper>
          {activeButton === ActiveButton.options && (
            <OptionsPanelWrapper layout={layout}>
              <LayersPanel
                id={`${side}-layers-panel`}
                layers={examples}
                selectedLayerIds={selectedLayerIds}
                onLayerInsert={onLayerInsertHandler}
                onLayerSelect={onLayerSelectHandler}
                onLayerDelete={onLayerDeleteHandler}
                onPointToLayer={onPointToLayerHandler}
                type={ListItemType.Radio}
                sublayers={sublayers}
                onUpdateSublayerVisibility={onUpdateSublayerVisibilityHandler}
                onClose={onClose}
                baseMaps={baseMaps}
                selectedBaseMapId={selectedBaseMap.id}
                insertBaseMap={onInsertBaseMap}
                selectBaseMap={onSelectBaseMap}
                deleteBaseMap={onDeleteBaseMap}
              />
            </OptionsPanelWrapper>
          )}
          {activeButton === ActiveButton.settings && (
            <OptionsPanelWrapper layout={layout}>
              <ComparisonParamsPanel
                id={`${side}-comparison-params-panel`}
                isCompressedGeometry={isCompressedGeometry}
                isCompressedTextures={isCompressedTextures}
                onGeometryChange={() =>
                  setIsCompressedGeometry((prevValue) => !prevValue)
                }
                onTexturesChange={() =>
                  setIsCompressedTextures((prevValue) => !prevValue)
                }
                onClose={() =>
                  onChangeMainToolsPanelHandler(ActiveButton.settings)
                }
              />
            </OptionsPanelWrapper>
          )}
          {activeButton === ActiveButton.memory && (
            <OptionsPanelWrapper layout={layout}>
              <MemoryUsagePanel
                id={`${side}-memory-usage-panel`}
                memoryStats={memoryStats}
                tilesetStats={tilesetStats}
                loadingTime={loadingTime}
                onClose={() =>
                  onChangeMainToolsPanelHandler(ActiveButton.memory)
                }
              />
            </OptionsPanelWrapper>
          )}
        </>
      )}
    </Container>
  );
};
