import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { Tileset3D, Tile3D } from "@loaders.gl/tiles";
import { Stats } from "@probe.gl/stats";
import { lumaStats } from "@luma.gl/core";

import {
  ActiveButton,
  ComparisonMode,
  ComparisonSideMode,
  LayerExample,
  ListItemType,
  Sublayer,
  ViewStateSet,
  CompareButtonMode,
  StatsMap,
  TilesetType,
  LayerViewState,
  Bookmark,
  PageId,
  TilesetMetadata,
} from "../../../types";
import { DeckGlWrapper } from "../../deck-gl-wrapper/deck-gl-wrapper";
import { MainToolsPanel } from "../../main-tools-panel/main-tools-panel";
import { EXAMPLES } from "../../../constants/i3s-examples";
import { LayersPanel } from "../../layers-panel/layers-panel";
import { ComparisonParamsPanel } from "../comparison-params-panel/comparison-params-panel";
import { MemoryUsagePanel } from "../../memory-usage-panel/memory-usage-panel";
import { ActiveSublayer } from "../../../utils/active-sublayer";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../../utils/hooks/layout";
import { parseTilesetUrlParams } from "../../../utils/url-utils";
import {
  findExampleAndUpdateWithViewState,
  getActiveLayersByIds,
  handleSelectAllLeafsInGroup,
  selectNestedLayers,
} from "../../../utils/layer-utils";
import {
  ComparisonLeftSidePanelWrapper,
  ComparisonRightSidePanelWrapper,
  LeftSideToolsPanelWrapper,
  RightSideToolsPanelWrapper,
} from "../../common";
import { initStats, sumTilesetsStats } from "../../../utils/stats";
import { IS_LOADED_DELAY } from "../../../constants/common";
import {
  getFlattenedSublayers,
  selectLeftLayers,
  selectLeftSublayers,
  selectRightLayers,
  selectRightSublayers,
  setFlattenedSublayers,
  updateLayerVisibility,
} from "../../../redux/slices/flattened-sublayers-slice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  selectBaseMaps,
  selectSelectedBaseMaps,
} from "../../../redux/slices/base-maps-slice";

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

type ComparisonSideProps = {
  mode: ComparisonMode;
  side: ComparisonSideMode;
  viewState: ViewStateSet;
  showLayerOptions: boolean;
  showComparisonSettings: boolean;
  staticLayers?: LayerExample[];
  activeLayersIds: string[];
  preventTransitions: boolean;
  compareButtonMode: CompareButtonMode;
  loadingTime: number;
  loadTileset?: boolean;
  hasBeenCompared: boolean;
  showBookmarks: boolean;
  loadNumber: number;
  forcedSublayers?: ActiveSublayer[] | null;
  buildingExplorerOpened: boolean;
  onBuildingExplorerOpened: (opened: boolean) => void;
  onViewStateChange: (viewStateSet: ViewStateSet) => void;
  pointToTileset: (viewState?: LayerViewState) => void;
  onChangeLayers?: (layer: LayerExample[], activeIds: string[]) => void;
  onInsertBookmarks?: (bookmarks: Bookmark[]) => void;
  onLoadingStateChange: (isLoading: boolean) => void;
  onTilesetLoaded: (stats: StatsMap) => void;
  onShowBookmarksChange: () => void;
  onAfterDeckGlRender?: () => void;
  onUpdateSublayers?: (sublayers: ActiveSublayer[]) => void;
};

export const ComparisonSide = ({
  mode,
  side,
  viewState,
  showLayerOptions,
  showComparisonSettings,
  staticLayers,
  activeLayersIds,
  preventTransitions,
  compareButtonMode,
  loadingTime,
  loadTileset = true,
  showBookmarks,
  loadNumber,
  hasBeenCompared,
  forcedSublayers,
  buildingExplorerOpened,
  onBuildingExplorerOpened,
  onViewStateChange,
  pointToTileset,
  onChangeLayers,
  onLoadingStateChange,
  onTilesetLoaded,
  onShowBookmarksChange,
  onAfterDeckGlRender,
  onInsertBookmarks,
  onUpdateSublayers,
}: ComparisonSideProps) => {
  const baseMaps = useAppSelector(selectBaseMaps);
  const selectedBaseMapId = useAppSelector(selectSelectedBaseMaps);
  const selectedBaseMap = baseMaps.find((map) => map.id === selectedBaseMapId);
  const layout = useAppLayout();

  const tilesetRef = useRef<Tileset3D | null>(null);
  const flattenedSublayers = useAppSelector(
    side === ComparisonSideMode.left ? selectLeftLayers : selectRightLayers
  );
  const bslSublayers = useAppSelector(
    side === ComparisonSideMode.left
      ? selectLeftSublayers
      : selectRightSublayers
  );
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
  const [loadedTilesets, setLoadedTilesets] = useState<Tileset3D[]>([]);
  const [tilesetsStats, setTilesetsStats] = useState(initStats());
  const [memoryStats, setMemoryStats] = useState<Stats | null>(null);
  const [updateStatsNumber, setUpdateStatsNumber] = useState<number>(0);
  const sideId = `${side}-deck-container`;
  const dispatch = useAppDispatch();

  const selectedLayerIds = useMemo(
    () => activeLayers.map((layer) => layer.id),
    [activeLayers]
  );

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
    if (compareButtonMode === CompareButtonMode.Comparing) {
      tilesetRef.current = null;
    }
  }, [activeLayersIds, compareButtonMode]);

  useEffect(() => {
    if (staticLayers) {
      const activeLayers = getActiveLayersByIds(staticLayers, activeLayersIds);

      setExamples((prevValues) =>
        staticLayers.length ? staticLayers : prevValues
      );
      setActiveLayers(activeLayers);
    }
  }, [staticLayers, activeLayersIds]);

  useEffect(() => {
    if (hasBeenCompared) {
      setActiveButton(ActiveButton.memory);
    }
  }, [hasBeenCompared]);

  useEffect(() => {
    if (!forcedSublayers) {
      return;
    }

    const updateVisibilityAll = (nestedSublayers: ActiveSublayer[]) => {
      for (const sublayer of nestedSublayers) {
        onUpdateSublayerVisibilityHandler(sublayer);
        if (sublayer.sublayers) {
          updateVisibilityAll(sublayer.sublayers);
        }
      }
    };

    updateVisibilityAll(forcedSublayers);
    setSublayers(forcedSublayers);
  }, [forcedSublayers]);

  useEffect(() => {
    if (!activeLayers.length) {
      dispatch(setFlattenedSublayers({ layers: [], side }));
      return;
    }

    const tilesetsData: TilesetMetadata[] = [];

    for (const layer of activeLayers) {
      const params = parseTilesetUrlParams(layer.url, layer);
      const { tilesetUrl, token } = params;

      tilesetsData.push({
        id: layer.id,
        url: tilesetUrl,
        token,
        hasChildren: Boolean(layer.layers),
        type: layer.type,
      });
    }

    dispatch(
      getFlattenedSublayers({
        tilesetsData,
        buildingExplorerOpened,
        side,
      })
    );
  }, [activeLayers, buildingExplorerOpened]);

  useEffect(() => {
    if (bslSublayers?.length > 0) {
      setSublayers(
        bslSublayers.map((sublayer) => new ActiveSublayer(sublayer, true))
      );
    } else {
      setSublayers([]);
    }
  }, [bslSublayers]);

  /**
   * Init statistics for loaded tilesets every time if loaded tilesets have been changed.
   */
  useEffect(() => {
    const loadedTilesetsCount = loadedTilesets.length;
    const activeLayersCount = activeLayers.length;

    if (loadedTilesetsCount && activeLayersCount) {
      const isBSL = loadedTilesetsCount > activeLayersCount;
      let statsName = activeLayers[0].url;

      if (!isBSL) {
        statsName = loadedTilesets
          .map((loadedTileset) => loadedTileset.url)
          .join("<-tileset->");
      }

      const tilesetsStats = initStats(statsName);
      setTilesetsStats(tilesetsStats);
    }
  }, [loadedTilesets]);

  /**
   * Detect which tilesets are actually shown by comparing with active layers.
   * Set loaded tilesets based on that.
   */
  useEffect(() => {
    const activeLayersUrls = activeLayers.map((activeLayer) => activeLayer.url);
    setLoadedTilesets((prevTilesets) =>
      prevTilesets.filter((tileset) => activeLayersUrls.includes(tileset.url))
    );
  }, [activeLayers]);

  const getLayers3d = () => {
    if (!loadTileset) {
      return [];
    }
    return flattenedSublayers
      .filter((sublayer) => sublayer.visibility)
      .map((sublayer) => ({
        id: sublayer.id,
        url: sublayer.url,
        token: sublayer.token,
        type: sublayer.type || TilesetType.I3S,
      }));
  };

  const onTraversalCompleteHandler = (selectedTiles) => {
    // A parent tileset of selected tiles
    const aTileset = selectedTiles?.[0]?.tileset;
    // Make sure that the actual tileset has been traversed traversed
    if (aTileset === tilesetRef.current && !aTileset.isLoaded()) {
      onLoadingStateChange(true);
    }
    return selectedTiles;
  };

  const onTilesetLoadHandler = (newTileset: Tileset3D) => {
    newTileset.setProps({ onTraversalComplete: onTraversalCompleteHandler });
    onLoadingStateChange(true);
    setLoadedTilesets((prevTilesets) => [...prevTilesets, newTileset]);
    setExamples((prevExamples) =>
      findExampleAndUpdateWithViewState(newTileset, prevExamples)
    );
    tilesetRef.current = newTileset;
    setUpdateStatsNumber((prev) => prev + 1);
    setTimeout(() => {
      if (tilesetRef.current === newTileset && newTileset.isLoaded()) {
        onLoadingStateChange(false);
        onTilesetLoaded({
          url: newTileset.url,
          tilesetStats: newTileset.stats,
          memoryStats,
          contentFormats: newTileset.contentFormats,
          isCompressedGeometry,
          isCompressedTextures,
        });
      }
    }, IS_LOADED_DELAY);
  };

  const onTileLoad = (tile: Tile3D) => {
    setTimeout(() => {
      setUpdateStatsNumber((prev) => prev + 1);
      if (tile.tileset === tilesetRef.current && tile.tileset.isLoaded()) {
        onLoadingStateChange(false);
        onTilesetLoaded({
          url: tile.tileset.url,
          tilesetStats: tile.tileset.stats,
          memoryStats,
          contentFormats: tile.tileset.contentFormats,
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

  const onLayerInsertHandler = (
    newLayer: LayerExample,
    bookmarks?: Bookmark[]
  ) => {
    const newExamples = [...examples, newLayer];
    setExamples(newExamples);
    const newActiveLayers = handleSelectAllLeafsInGroup(newLayer);
    const newActiveLayersIds = newActiveLayers.map((layer) => layer.id);
    setActiveLayers(newActiveLayers);
    onChangeLayers && onChangeLayers(newExamples, newActiveLayersIds);

    /**
     * There is no sense to use webscene bookmarks in across layers mode.
     */
    if (bookmarks?.length) {
      onInsertBookmarks && onInsertBookmarks(bookmarks);
    }
  };

  const onLayerSelectHandler = (
    layer: LayerExample,
    rootLayer?: LayerExample
  ) => {
    const newActiveLayers: LayerExample[] = selectNestedLayers(
      layer,
      activeLayers,
      rootLayer
    );
    setActiveLayers(newActiveLayers);
    const activeLayersIds = newActiveLayers.map((layer) => layer.id);
    onChangeLayers && onChangeLayers(examples, activeLayersIds);
  };

  const onLayerDeleteHandler = (id: string) => {
    const idsToDelete = [id];

    const layerToDelete = examples.find((layer) => layer.id === id);
    const childIds = layerToDelete
      ? handleSelectAllLeafsInGroup(layerToDelete).map((layer) => layer.id)
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
    onUpdateSublayers?.([...sublayers]);
    if (sublayer.layerType === "3DObject") {
      const index = flattenedSublayers.findIndex(
        (fSublayer) => fSublayer.id === sublayer.id
      );
      if (index >= 0 && flattenedSublayers[index]) {
        dispatch(
          updateLayerVisibility({
            index: index,
            visibility: sublayer.visibility,
            side,
          })
        );
      }
    }
  };

  const ToolsPanelWrapper =
    side === ComparisonSideMode.left
      ? LeftSideToolsPanelWrapper
      : RightSideToolsPanelWrapper;
  const OptionsPanelWrapper =
    side === ComparisonSideMode.left
      ? ComparisonLeftSidePanelWrapper
      : ComparisonRightSidePanelWrapper;

  const handleOnAfterRender = () => {
    sumTilesetsStats(loadedTilesets, tilesetsStats);
    onAfterDeckGlRender && onAfterDeckGlRender();
  };

  return (
    <Container layout={layout}>
      <DeckGlWrapper
        id={sideId}
        parentViewState={{
          ...viewState,
          main: {
            ...viewState.main,
          },
        }}
        showTerrain={selectedBaseMap?.id === "Terrain"}
        mapStyle={selectedBaseMap?.mapUrl}
        disableController={compareButtonMode === CompareButtonMode.Comparing}
        layers3d={getLayers3d()}
        loadNumber={loadNumber}
        lastLayerSelectedId={tilesetRef.current?.url || ""}
        useDracoGeometry={isCompressedGeometry}
        useCompressedTextures={isCompressedTextures}
        preventTransitions={preventTransitions}
        onViewStateChange={onViewStateChange}
        onWebGLInitialized={onWebGLInitialized}
        onTilesetLoad={(tileset: Tileset3D) => onTilesetLoadHandler(tileset)}
        onTileLoad={onTileLoad}
        onAfterRender={handleOnAfterRender}
      />
      {compareButtonMode === CompareButtonMode.Start && (
        <>
          <ToolsPanelWrapper layout={layout}>
            <MainToolsPanel
              id={`${side}-tools-panel`}
              activeButton={activeButton}
              bookmarksActive={showBookmarks}
              showBookmarks
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
                pageId={PageId.comparison}
                layers={examples}
                selectedLayerIds={selectedLayerIds}
                viewWidth={viewState?.main?.width}
                viewHeight={viewState?.main?.height}
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
                onBuildingExplorerOpened={onBuildingExplorerOpened}
                isAddingBookmarksAllowed={mode === ComparisonMode.withinLayer}
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
                activeLayers={activeLayers}
                tilesetStats={tilesetsStats}
                contentFormats={tilesetRef.current?.contentFormats}
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
