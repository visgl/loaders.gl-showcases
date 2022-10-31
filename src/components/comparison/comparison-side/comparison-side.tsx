import { BuildingSceneSublayer } from "@loaders.gl/i3s/dist/types";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Tileset3D, Tile3D } from "@loaders.gl/tiles";
import { Stats } from "@probe.gl/stats";
import { load } from "@loaders.gl/core";
import { I3SBuildingSceneLayerLoader } from "@loaders.gl/i3s";
import { lumaStats } from "@luma.gl/core";

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
  LayerViewState,
} from "../../../types";
import { getCurrentLayoutProperty, useAppLayout } from "../../../utils/layout";
import { DeckGlI3s } from "../../deck-gl-i3s/deck-gl-i3s";
import { MainToolsPanel } from "../../main-tools-panel/main-tools-panel";
import { EXAMPLES } from "../../../constants/i3s-examples";
import { LayersPanel } from "../layers-panel/layers-panel";
import { buildSublayersTree, parseTilesetUrlParams } from "../../../utils";
import { ComparisonParamsPanel } from "../comparison-params-panel/comparison-params-panel";
import { MemoryUsagePanel } from "../../../components/comparison/memory-usage-panel/memory-usage-panel";
import { ActiveSublayer } from "../../../utils/active-sublayer";

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

/** Delay to await asynchronous traversal of the tileset **/
const IS_LOADED_DELAY = 500;

type ComparisonSideProps = {
  mode: ComparisonMode;
  side: ComparisonSideMode;
  viewState: ViewStateSet;
  selectedBaseMap: BaseMap;
  baseMaps: BaseMap[];
  showLayerOptions: boolean;
  showComparisonSettings: boolean;
  staticLayers?: LayerExample[];
  activeLayersIds: string[];
  compareButtonMode: CompareButtonMode;
  dragMode: DragMode;
  loadingTime: number;
  loadTileset?: boolean;
  hasBeenCompared: boolean;
  showBookmarks: boolean;
  onViewStateChange: (viewStateSet: ViewStateSet) => void;
  pointToTileset: (viewState?: LayerViewState) => void;
  onChangeLayers?: (layer: LayerExample[], activeIds: string[]) => void;
  onInsertBaseMap: (baseMap: BaseMap) => void;
  onSelectBaseMap: (baseMapId: string) => void;
  onDeleteBaseMap: (baseMapId: string) => void;
  disableButtonHandler: () => void;
  onTilesetLoaded: (stats: StatsMap) => void;
  onShowBookmarksChange: () => void;
  onAfterDeckGlRender?: () => void;
};

type BuildingSceneSublayerWithToken = BuildingSceneSublayer & {
  token?: string;
};

export const ComparisonSide = ({
  mode,
  side,
  viewState,
  selectedBaseMap,
  baseMaps,
  showLayerOptions,
  showComparisonSettings,
  staticLayers,
  activeLayersIds,
  compareButtonMode,
  dragMode,
  loadingTime,
  loadTileset = true,
  showBookmarks,
  hasBeenCompared,
  onViewStateChange,
  pointToTileset,
  onChangeLayers,
  onInsertBaseMap,
  onSelectBaseMap,
  onDeleteBaseMap,
  disableButtonHandler,
  onTilesetLoaded,
  onShowBookmarksChange,
  onAfterDeckGlRender,
}: ComparisonSideProps) => {
  const layout = useAppLayout();

  const tilesetRef = useRef<Tileset3D | null>(null);
  const [flattenedSublayers, setFlattenedSublayers] = useState<
    BuildingSceneSublayerWithToken[]
  >([]);
  const [isCompressedGeometry, setIsCompressedGeometry] =
    useState<boolean>(true);
  const [isCompressedTextures, setIsCompressedTextures] =
    useState<boolean>(true);
  const [activeButton, setActiveButton] = useState<ActiveButton>(
    ActiveButton.none
  );
  const [examples, setExamples] = useState<LayerExample[]>(EXAMPLES);
  const [activeLayers, setActiveLayers] = useState<LayerExample[]>([]);
  const [sublayers, setSublayers] = useState<ActiveSublayer[]>([]);
  const [tilesetStats, setTilesetStats] = useState<Stats | null>(null);
  const [memoryStats, setMemoryStats] = useState<Stats | null>(null);
  const [loadNumber, setLoadNumber] = useState<number>(0);
  const [updateStatsNumber, setUpdateStatsNumber] = useState<number>(0);
  const sideId = `${side}-deck-container`;
  const fetchSublayersCounter = useRef<number>(0);
  const [preventTransitions, setPreventTransitions] = useState<boolean>(true);

  useEffect(() => {
    if (showLayerOptions) {
      setActiveButton(ActiveButton.options);
    } else {
      setActiveButton(ActiveButton.none);
    }
    setIsCompressedGeometry(true);
    setIsCompressedTextures(true);
    setActiveLayers([]);
  }, [mode]);

  useEffect(() => {
    if (staticLayers) {
      const getActiveLayersByIds = (
        staticLayers: LayerExample[],
        activeIds: string[] = [],
        activeLayers: LayerExample[] = []
      ) => {
        for (const layer of staticLayers) {
          if (activeIds.includes(layer.id)) {
            activeLayers.push(layer);
          }

          if (layer?.layers?.length) {
            getActiveLayersByIds(layer?.layers, activeIds, activeLayers);
          }
        }

        return activeLayers;
      };

      const activeLayers = getActiveLayersByIds(staticLayers, activeLayersIds);

      setExamples((prevValues) =>
        staticLayers.length ? staticLayers : prevValues
      );
      setActiveLayers(activeLayers);
    }
  }, [staticLayers]);

  useEffect(() => {
    if (compareButtonMode === CompareButtonMode.Comparing) {
      setLoadNumber((prev) => prev + 1);
    }
  }, [compareButtonMode]);

  useEffect(() => {
    if (hasBeenCompared) {
      setActiveButton(ActiveButton.memory);
    }
  }, [hasBeenCompared]);

  useEffect(() => {
    fetchSublayersCounter.current++;
    if (!activeLayers.length || !loadTileset) {
      setFlattenedSublayers([]);
      return;
    }

    async function fetchFlattenedSublayers(
      tilesetsData: {
        id: string;
        url: string;
        token: string;
        hasChildren: boolean;
      }[],
      layerUpdateNumber: number
    ) {
      const promises: Promise<any>[] = [];

      for (const data of tilesetsData) {
        if (!data.hasChildren) {
          promises.push(getFlattenedSublayers(data));
        }
      }

      Promise.all(promises).then((results) => {
        if (layerUpdateNumber === fetchSublayersCounter.current) {
          setFlattenedSublayers(results.flat());
        }
      });
    }

    const tilesetsData: {
      id: string;
      url: string;
      token: string;
      hasChildren: boolean;
    }[] = [];

    for (const layer of activeLayers) {
      const params = parseTilesetUrlParams(layer.url, layer);
      const { tilesetUrl, token } = params;

      tilesetsData.push({
        id: layer.id,
        url: tilesetUrl,
        token,
        hasChildren: Boolean(layer.layers),
      });
    }

    fetchFlattenedSublayers(tilesetsData, fetchSublayersCounter.current);
    setSublayers([]);
    disableButtonHandler();
  }, [activeLayers, loadTileset]);

  const getFlattenedSublayers = async (tilesetData: {
    id: string;
    url: string;
    token: string;
  }) => {
    try {
      const tileset = await load(tilesetData.url, I3SBuildingSceneLayerLoader);
      const sublayersTree = buildSublayersTree(tileset.header.sublayers);
      const childSublayers = sublayersTree?.sublayers || [];
      setSublayers(
        childSublayers.map((sublayer) => new ActiveSublayer(sublayer, true))
      );
      const sublayers = tileset?.sublayers
        .filter((sublayer) => sublayer.name !== "Overview")
        .map((item) => ({ ...item, token: tilesetData.token }));
      return sublayers;
    } catch (e) {
      return [
        {
          id: tilesetData.id,
          url: tilesetData.url,
          visibility: true,
          token: tilesetData.token,
        },
      ];
    }
  };

  const getI3sLayers = () => {
    return flattenedSublayers
      .filter((sublayer) => sublayer.visibility)
      .map((sublayer) => ({
        id: sublayer.id,
        url: sublayer.url,
        token: sublayer?.token,
      }));
  };

  const onTilesetLoadHandler = (newTileset: Tileset3D) => {
    setTilesetStats(newTileset.stats);
    setExamples((prevExamples) =>
      findExampleAndUpdateWithTileset(newTileset, prevExamples)
    );
    tilesetRef.current = newTileset;
    setUpdateStatsNumber((prev) => prev + 1);
    setTimeout(() => {
      if (newTileset.isLoaded()) {
        onTilesetLoaded({
          url: newTileset.url,
          tilesetStats: newTileset.stats,
          memoryStats,
          isCompressedGeometry,
          isCompressedTextures,
        });
      }
    }, IS_LOADED_DELAY);
  };

  const findExampleAndUpdateWithTileset = (
    tileset: Tileset3D,
    examples: LayerExample[]
  ): LayerExample[] => {
    // Shallow copy of example objects to prevent mutation of the state object.
    const examplesCopy = [...examples];

    for (const example of examplesCopy) {
      // We can't compare by tileset.url === example.url because BSL and Scene examples url is not loaded as tileset.
      if (tileset.url.includes(example.url) && !example.viewState) {
        const { zoom, cartographicCenter } = tileset;
        const [longitude, latitude] = cartographicCenter || [];
        example.viewState = { zoom, latitude, longitude };
        break;
      }

      if (example.layers) {
        example.layers = findExampleAndUpdateWithTileset(
          tileset,
          example.layers
        );
      }
    }

    return examplesCopy;
  };

  const flattenLayersTree = (
    layer: LayerExample,
    flattened: LayerExample[] = []
  ): LayerExample[] => {
    flattened.push(layer);

    if (layer?.layers?.length) {
      for (const childLayer of layer.layers) {
        flattenLayersTree(childLayer, flattened);
      }
    }

    return flattened;
  };

  const onTileLoad = (tile: Tile3D) => {
    setTimeout(() => {
      setUpdateStatsNumber((prev) => prev + 1);
      if (tile.tileset === tilesetRef.current && tile.tileset.isLoaded()) {
        onTilesetLoaded({
          url: tile.tileset.url,
          tilesetStats: tile.tileset.stats,
          memoryStats,
          isCompressedGeometry,
          isCompressedTextures,
        });
      }
    }, IS_LOADED_DELAY);
  };

  const onWebGLInitialized = () => {
    const stats = lumaStats.get(`Memory Usage${sideId}`);
    setMemoryStats(stats);
  };

  const onChangeMainToolsPanelHandler = (active: ActiveButton) => {
    setActiveButton((prevValue) =>
      prevValue === active ? ActiveButton.none : active
    );
  };

  const onLayerInsertHandler = (newLayer: LayerExample) => {
    setExamples((prevValues) => [...prevValues, newLayer]);
    const flattenedLayers = getAllLayersInGroupsTree(newLayer);
    setActiveLayers(flattenedLayers);
  };

  const getAllLayersInGroupsTree = (
    layer: LayerExample,
    leafs: LayerExample[] = []
  ) => {
    if (layer?.layers?.length) {
      for (const childLayer of layer.layers) {
        leafs = getAllLayersInGroupsTree(childLayer, leafs);
      }
    } else {
      leafs.push(layer);
    }

    return leafs;
  };

  const handleSelectGroupLayer = (
    layer: LayerExample,
    isMainGroup: boolean,
    rootLayer?: LayerExample
  ) => {
    const activeLayerIdsFromRoot = rootLayer
      ? getAllLayersInGroupsTree(rootLayer).map((layer) => layer.id)
      : [];
    const activeLayersInSelectedGroup = activeLayers.filter((activeLayer) =>
      activeLayerIdsFromRoot.includes(activeLayer.id)
    );
    const layersInGroupsTree = getAllLayersInGroupsTree(layer);
    const selectedChildrenIds = layersInGroupsTree.map((child) => child.id);
    const isGroupAlreadySelected = activeLayers.some((activeLayer) =>
      selectedChildrenIds.includes(activeLayer.id)
    );

    if (isGroupAlreadySelected && !isMainGroup) {
      return activeLayers.filter(
        (activeLayer) => !selectedChildrenIds.includes(activeLayer.id)
      );
    }

    if (isMainGroup) {
      return layersInGroupsTree;
    }

    return [...activeLayersInSelectedGroup, ...layersInGroupsTree];
  };

  const handleSelectLeafLayer = (
    layer: LayerExample,
    rootLayer?: LayerExample
  ) => {
    const isLayerAlreadySelected = activeLayers.some(
      (activeLayer) => activeLayer.id === layer.id
    );

    if (isLayerAlreadySelected) {
      return activeLayers.filter((activeLayer) => activeLayer.id !== layer.id);
    }

    const activeLayerIdsFromRoot = rootLayer
      ? getAllLayersInGroupsTree(rootLayer).map((layer) => layer.id)
      : [];
    const activeLayersInSelectedGroup = activeLayers.filter((activeLayer) =>
      activeLayerIdsFromRoot.includes(activeLayer.id)
    );

    return [...activeLayersInSelectedGroup, layer];
  };

  const getActiveLayerIds = (
    layers: LayerExample[],
    activeLayerIds: string[] = []
  ) => {
    for (const layer of layers) {
      activeLayerIds.push(layer.id);

      if (layer?.layers?.length) {
        getActiveLayerIds(layer?.layers, activeLayerIds);
      }
    }

    return activeLayerIds;
  };

  const onLayerSelectHandler = (
    layer: LayerExample,
    rootLayer?: LayerExample
  ) => {
    const isGroup = !!layer?.layers?.length;
    const isUnitLayer = !rootLayer && !isGroup;
    const isLeaf = rootLayer && !isGroup;
    const isMainGroup = isGroup && !rootLayer;

    let newActiveLayers: LayerExample[] = [];

    switch (true) {
      case isUnitLayer:
        newActiveLayers = [layer];
        break;
      case isGroup:
        newActiveLayers = handleSelectGroupLayer(layer, isMainGroup, rootLayer);
        break;
      case isLeaf:
        newActiveLayers = handleSelectLeafLayer(layer, rootLayer);
        break;
    }

    setActiveLayers(newActiveLayers);
    setPreventTransitions(false);
    const activeLayersIds = getActiveLayerIds(newActiveLayers);
    onChangeLayers &&
      newActiveLayers.length &&
      onChangeLayers(examples, activeLayersIds);
  };

  const onLayerDeleteHandler = (id: string) => {
    const idsToDelete = [id];

    const layerToDelete = activeLayers.find((layer) => layer.id === id);
    const childIds = layerToDelete
      ? flattenLayersTree(layerToDelete).map((layer) => layer.id)
      : [];

    if (childIds.length) {
      idsToDelete.push(...childIds);
    }

    setExamples((prevValues) =>
      prevValues.filter((example) => example.id !== id)
    );
    setActiveLayers((prevValues) =>
      prevValues.filter((layer) => !idsToDelete.includes(layer.id))
    );
  };

  const onUpdateSublayerVisibilityHandler = (sublayer: Sublayer) => {
    if (sublayer.layerType === "3DObject") {
      const flattenedSublayer = flattenedSublayers.find(
        (fSublayer) => fSublayer.id === sublayer.id
      );
      if (flattenedSublayer) {
        flattenedSublayer.visibility = sublayer.visibility;
        setSublayers([...sublayers]);
      }
    }
  };

  const onViewStateChangeHandler = (viewStateSet: ViewStateSet) => {
    setPreventTransitions(true);
    onViewStateChange(viewStateSet);
  };

  const selectedLayerIds = activeLayers.map((layer) => layer.id);

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
        id={sideId}
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
        lastLayerSelectedId={tilesetRef.current?.url || ""}
        useDracoGeometry={isCompressedGeometry}
        useCompressedTextures={isCompressedTextures}
        preventTransitions={preventTransitions}
        onViewStateChange={onViewStateChangeHandler}
        onWebGLInitialized={onWebGLInitialized}
        onTilesetLoad={(tileset: Tileset3D) => onTilesetLoadHandler(tileset)}
        onTileLoad={onTileLoad}
        onAfterRender={onAfterDeckGlRender}
      />
      {compareButtonMode === CompareButtonMode.Start && (
        <>
          <ToolsPanelWrapper layout={layout}>
            <MainToolsPanel
              id={`${side}-tools-panel`}
              activeButton={activeButton}
              showBookmarks={showBookmarks}
              showLayerOptions={showLayerOptions}
              showComparisonSettings={showComparisonSettings}
              onChange={onChangeMainToolsPanelHandler}
              onShowBookmarksChange={onShowBookmarksChange}
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
                onLayerDelete={(id) => onLayerDeleteHandler(id)}
                onPointToLayer={(viewState) => pointToTileset(viewState)}
                type={ListItemType.Radio}
                sublayers={sublayers}
                onUpdateSublayerVisibility={onUpdateSublayerVisibilityHandler}
                onClose={() =>
                  onChangeMainToolsPanelHandler(ActiveButton.options)
                }
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
                updateNumber={updateStatsNumber}
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
