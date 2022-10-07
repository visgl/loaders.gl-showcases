import { BuildingSceneSublayer } from "@loaders.gl/i3s/dist/types";
import { useEffect, useRef, useState } from "react";
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

enum LayerType {
  parent,
  child,
  single,
}

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
  compareButtonMode: CompareButtonMode;
  dragMode: DragMode;
  loadingTime: number;
  loadTileset?: boolean;
  hasBeenCompared: boolean;
  onViewStateChange: (viewStateSet: ViewStateSet) => void;
  pointToTileset: (tileset: Tileset3D) => void;
  onChangeLayers?: (layer: LayerExample[]) => void;
  onInsertBaseMap: (baseMap: BaseMap) => void;
  onSelectBaseMap: (baseMapId: string) => void;
  onDeleteBaseMap: (baseMapId: string) => void;
  disableButtonHandler: () => void;
  onTilesetLoaded: (stats: StatsMap) => void;
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
  compareButtonMode,
  dragMode,
  loadingTime,
  loadTileset = true,
  hasBeenCompared,
  onViewStateChange,
  pointToTileset,
  onChangeLayers,
  onInsertBaseMap,
  onSelectBaseMap,
  onDeleteBaseMap,
  disableButtonHandler,
  onTilesetLoaded,
}: ComparisonSideProps) => {
  const forceUpdate = useForceUpdate();
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
  const [layers, setLayers] = useState<LayerExample[]>([]);
  const [sublayers, setSublayers] = useState<Sublayer[]>([]);
  const [tilesetStats, setTilesetStats] = useState<Stats | null>(null);
  const [memoryStats, setMemoryStats] = useState<Stats | null>(null);
  const [loadNumber, setLoadNumber] = useState<number>(0);
  const [updateStatsNumber, setUpdateStatsNumber] = useState<number>(0);

  useEffect(() => {
    if (showLayerOptions) {
      setActiveButton(ActiveButton.options);
    } else {
      setActiveButton(ActiveButton.none);
    }
    setIsCompressedGeometry(true);
    setIsCompressedTextures(true);
    setLayers([]);
  }, [mode]);

  useEffect(() => {
    if (staticLayers?.length) {
      setLayers(staticLayers);
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
    if (!layers.length || !loadTileset) {
      setFlattenedSublayers([]);
      return;
    }

    async function fetchFlattenedSublayers(
      tilesetsData: {
        id: string;
        url: string;
        token: string;
        hasChildren: boolean;
      }[]
    ) {
      const promises: Promise<any>[] = [];

      for (const data of tilesetsData) {
        if (!data.hasChildren) {
          promises.push(getFlattenedSublayers(data));
        }
      }

      Promise.all(promises).then((results) => {
        setFlattenedSublayers(results.flat());
      });
    }

    const tilesetsData: {
      id: string;
      url: string;
      token: string;
      hasChildren: boolean;
    }[] = [];

    for (const layer of layers) {
      const params = parseTilesetUrlParams(layer.url, layer);
      const { tilesetUrl, token } = params;

      tilesetsData.push({
        id: layer.id,
        url: tilesetUrl,
        token,
        hasChildren: Boolean(layer.children),
      });
    }

    fetchFlattenedSublayers(tilesetsData);
    setSublayers([]);
    disableButtonHandler();
  }, [layers, loadTileset]);

  const getFlattenedSublayers = async (tilesetData: {
    id: string;
    url: string;
    token: string;
  }) => {
    try {
      const tileset = await load(tilesetData.url, I3SBuildingSceneLayerLoader);
      const sublayersTree = buildSublayersTree(tileset.header.sublayers);
      const childSublayers = sublayersTree?.sublayers || [];
      setSublayers(childSublayers);
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

  const onWebGLInitialized = (gl) => {
    const stats = gl.stats.get("Memory Usage");
    setMemoryStats(stats);
  };

  const onChangeMainToolsPanelHandler = (active: ActiveButton) => {
    setActiveButton((prevValue) =>
      prevValue === active ? ActiveButton.none : active
    );
  };

  const onLayerInsertHandler = (newLayer: LayerExample) => {
    setExamples((prevValues) => [...prevValues, newLayer]);
    setLayers([newLayer]);
  };

  const onLayerSelectHandler = (layerId: string, parentId?: string) => {
    const { selectedExample, type } = getSelectedExampleById(layerId);

    let changedLayers: LayerExample[] = [];

    if (selectedExample) {
      switch (type) {
        case LayerType.single:
          setLayers([selectedExample]);
          changedLayers = [selectedExample];

          break;
        case LayerType.parent: {
          const children = selectedExample?.children || [];
          setLayers([...children, selectedExample]);
          changedLayers = [...children, selectedExample];
          break;
        }

        case LayerType.child: {
          const isLayerAlreadyInList = layers.some(
            (layer) => layer.id === layerId
          );

          if (isLayerAlreadyInList) {
            const filteredValues = layers.filter(
              (layer) => layer.id !== layerId
            );
            setLayers(filteredValues);
            changedLayers = filteredValues;
          } else {
            const { selectedExample: parentLayer } =
              getSelectedExampleById(parentId);

            const childrenIds =
              parentLayer?.children?.map((child) => child.id) || [];

            // Find only layers which have the same current parent.
            const childrenToSave =
              layers.filter((layer) => childrenIds?.includes(layer.id)) || [];

            const newLayers = [...childrenToSave, selectedExample];

            if (parentLayer) {
              newLayers.push(parentLayer);
            }

            setLayers(newLayers);
            changedLayers = newLayers;
          }
          break;
        }
      }

      onChangeLayers && changedLayers.length && onChangeLayers(changedLayers);
    }
  };

  const getSelectedExampleById = (
    id?: string
  ): { selectedExample: LayerExample | null; type: LayerType } => {
    let selectedExample: LayerExample | null = null;
    let type: LayerType = LayerType.single;

    for (const example of examples) {
      if (example.id === id) {
        selectedExample = example;

        if (example.children?.length) {
          type = LayerType.parent;
        }
        break;
      }

      for (const childExample of example.children || []) {
        if (childExample.id === id) {
          selectedExample = childExample;
          type = LayerType.child;
          break;
        }
      }
    }

    return { selectedExample, type };
  };

  const onLayerDeleteHandler = (id: string) => {
    setExamples((prevValues) =>
      prevValues.filter((example) => example.id !== id)
    );
    setLayers((prevValues) => prevValues.filter((layer) => layer.id !== id));
  };

  const onPointToLayerHandler = () => {
    if (tilesetRef.current) {
      pointToTileset(tilesetRef.current);
    }
  };

  const onUpdateSublayerVisibilityHandler = (sublayer: Sublayer) => {
    if (sublayer.layerType === "3DObject") {
      const flattenedSublayer = flattenedSublayers.find(
        (fSublayer) => fSublayer.id === sublayer.id
      );
      if (flattenedSublayer) {
        flattenedSublayer.visibility = sublayer.visibility;
        forceUpdate();
      }
    }
  };

  const selectedLayerIds = layers.map((layer) => layer.id);

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
        lastLayerSelectedId={tilesetRef.current?.url || ""}
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
                onLayerDelete={(id) => onLayerDeleteHandler(id)}
                onPointToLayer={onPointToLayerHandler}
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
