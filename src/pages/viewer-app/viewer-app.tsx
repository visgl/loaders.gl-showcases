import { useEffect, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import styled from "styled-components";
import { load } from "@loaders.gl/core";
import { lumaStats } from "@luma.gl/core";
import {
  I3SBuildingSceneLayerLoader,
  loadFeatureAttributes,
  StatisticsInfo,
} from "@loaders.gl/i3s";
import { StatsWidget } from "@probe.gl/stats-widget";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { EXAMPLES } from "../../constants/i3s-examples";
import { BASE_MAPS } from "../../constants/map-styles";
import { Tileset3D } from "@loaders.gl/tiles";
import {
  color_brand_primary,
  color_canvas_primary_inverted,
} from "../../constants/colors";

import { DeckGlWrapper } from "../../components/deck-gl-wrapper/deck-gl-wrapper";
import { AttributesPanel } from "../../components/attributes-panel/attributes-panel";
import { initStats, sumTilesetsStats } from "../../utils/stats";
import {
  parseTilesetUrlParams,
} from "../../utils/url-utils";
import { buildSublayersTree } from "../../utils/sublayers";
import {
  FeatureAttributes,
  Sublayer,
  LayerExample,
  ColorsByAttribute,
  TilesetType,
  ActiveButton,
  LayerViewState,
  ViewStateSet,
  ListItemType,
  BaseMap,
  BuildingSceneSublayerExtended,
} from "../../types";
import { useAppLayout } from "../../utils/hooks/layout";
import {
  MapArea,
  RightSidePanelWrapper,
  RightSideToolsPanelWrapper,
} from "../../components/common";
import { MainToolsPanel } from "../../components/main-tools-panel/main-tools-panel";
import { LayersPanel } from "../../components/layers-panel/layers-panel";
import {
  findExampleAndUpdateWithViewState,
  handleSelectAllLeafsInGroup,
  initActiveLayer,
  selectNestedLayers,
} from "../../utils/layer-utils";
import { ActiveSublayer } from "../../utils/active-sublayer";
import { useSearchParams } from "react-router-dom";

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

const StatsWidgetWrapper = styled.div<{ showMemory: boolean }>`
  display: flex;
`;

const StatsWidgetContainer = styled.div<{
  showBuildingExplorer: boolean;
  hasSublayers: boolean;
}>`
  display: ${(props) => (props.showBuildingExplorer ? "none" : "flex")};
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  top: ${(props) => (props.hasSublayers ? "260px" : "200px")};
  background: ${color_brand_primary};
  color: ${color_canvas_primary_inverted};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: left;
  color: rgba(255, 255, 255, 0.6);
  z-index: 3;
  bottom: 15px;
  word-break: break-word;
  padding: 24px;
  border-radius: 8px;
  line-height: 135%;
  bottom: auto;
  width: 277px;
  left: 10px;
  max-height: calc(100% - 280px);
  overflow: auto;
`;

export const ViewerApp = () => {
  let statsWidgetContainer = useRef(null);
  const layout = useAppLayout();

  const [selectedFeatureAttributes, setSelectedFeatureAttributes] =
    useState<FeatureAttributes | null>(null);
  const [colorsByAttribute, setColorsByAttribute] =
    useState<ColorsByAttribute | null>(null);
  const [tilesetStatisticsInfo, setTilesetStatisticsInfo] = useState<
    StatisticsInfo[] | null
  >(null);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(-1);
  const [selectedTilesetBasePath, setSelectedTilesetBasePath] =
    useState<string>("");
  const [isAttributesLoading, setAttributesLoading] = useState(false);
  const [flattenedSublayers, setFlattenedSublayers] = useState<
    BuildingSceneSublayerExtended[]
  >([]);
  const [tilesetsStats, setTilesetsStats] = useState(initStats());
  const [memWidget, setMemWidget] = useState<StatsWidget | null>(null);
  const [tilesetStatsWidget, setTilesetStatsWidget] =
    useState<StatsWidget | null>(null);
  const [loadedTilesets, setLoadedTilesets] = useState<Tileset3D[]>([]);

  const [activeButton, setActiveButton] = useState<ActiveButton>(
    ActiveButton.none
  );
  const [examples, setExamples] = useState<LayerExample[]>(EXAMPLES);
  const [activeLayers, setActiveLayers] = useState<LayerExample[]>([]);
  const [viewState, setViewState] = useState<ViewStateSet>(INITIAL_VIEW_STATE);
  const fetchSublayersCounter = useRef<number>(0);
  const [sublayers, setSublayers] = useState<ActiveSublayer[]>([]);
  const [baseMaps, setBaseMaps] = useState<BaseMap[]>(BASE_MAPS);
  const [selectedBaseMap, setSelectedBaseMap] = useState<BaseMap>(BASE_MAPS[0]);
  const [, setSearchParams] = useSearchParams();

  const selectedLayerIds = useMemo(
    () => activeLayers.map((layer) => layer.id),
    [activeLayers]
  );
  const layers3d = useMemo(() => {
    return flattenedSublayers
      .filter((sublayer) => sublayer.visibility)
      .map((sublayer) => ({
        id: sublayer.id,
        url: sublayer.url,
        token: sublayer.token,
        type: sublayer.type || TilesetType.I3S,
      }));
  }, [flattenedSublayers]);

  /**
   * Initialize stats widgets
   */
  useEffect(() => {
    const newActiveLayer = initActiveLayer();
    if (newActiveLayer.custom) {
      setExamples((prev) => [...prev, newActiveLayer]);
    }
    setActiveLayers([newActiveLayer]);
    const memoryUsage = lumaStats.get("Memory Usage");
    const memWidget = new StatsWidget(memoryUsage, {
      framesPerUpdate: 1,
      formatters: {
        "GPU Memory": "memory",
        "Buffer Memory": "memory",
        "Renderbuffer Memory": "memory",
        "Texture Memory": "memory",
      },
      // @ts-expect-error - Type 'MutableRefObject<null>' is missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, dir, and 275 more.
      container: statsWidgetContainer,
    });

    setMemWidget(memWidget);

    // @ts-expect-error - Argument of type 'null' is not assignable to parameter of type 'Stats'.
    const tilesetStatsWidget = new StatsWidget(null, {
      container: statsWidgetContainer,
      formatters: {
        "Tile Memory Use": "memory",
      },
    });
    setTilesetStatsWidget(tilesetStatsWidget);
  }, []);

  /**
   * Hook for start using tilesets stats.
   */
  useEffect(() => {
    const tilesetsStats = initStats(activeLayers[0]?.url);

    tilesetStatsWidget && tilesetStatsWidget.setStats(tilesetsStats);
    setTilesetsStats(tilesetsStats);
  }, [loadedTilesets]);

  useEffect(() => {
    fetchSublayersCounter.current++;
    if (!activeLayers.length) {
      setFlattenedSublayers([]);
      return;
    }
    setSearchParams({ tileset: activeLayers[0].id });

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
      type?: TilesetType;
    }[] = [];

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

    fetchFlattenedSublayers(tilesetsData, fetchSublayersCounter.current);
    setSublayers([]);
    setLoadedTilesets([]);
    setSelectedFeatureAttributes(null);
    setSelectedFeatureIndex(-1);
  }, [activeLayers]);

  /**
   * Tries to get Building Scene Layer sublayer urls if exists.
   * @param {string} tilesetUrl
   * @returns {string[]} Sublayer urls or tileset url.
   */
  const getFlattenedSublayers = async (tilesetData: {
    id: string;
    url: string;
    token: string;
    type?: TilesetType;
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
        .map((item) => ({
          ...item,
          token: tilesetData.token,
          type: tilesetData.type,
        }));
      return sublayers;
    } catch (e) {
      return [
        {
          id: tilesetData.id,
          url: tilesetData.url,
          visibility: true,
          token: tilesetData.token,
          type: tilesetData.type,
        },
      ];
    }
  };

  /**
   * Updates stats, called every frame
   */
  const updateStatWidgets = () => {
    memWidget && memWidget.update();

    sumTilesetsStats(loadedTilesets, tilesetsStats);
    tilesetStatsWidget && tilesetStatsWidget.update();
  };

  const onTilesetLoad = (tileset: Tileset3D) => {
    setLoadedTilesets((prevValues: Tileset3D[]) => [...prevValues, tileset]);
    setExamples((prevExamples) =>
      findExampleAndUpdateWithViewState(tileset, prevExamples)
    );
  };

  const isLayerPickable = () => {
    const layerType = loadedTilesets?.[0]?.tileset?.layerType;

    switch (layerType) {
      case "IntegratedMesh":
        return false;
      default:
        return true;
    }
  };

  const handleClosePanel = () => {
    setSelectedFeatureAttributes(null);
    setSelectedFeatureIndex(-1);
  };

  const handleClick = async (info) => {
    if (!info.object || info.index < 0 || !info.layer) {
      handleClosePanel();
      return;
    }
    const options = info.object.tileset?.loadOptions || { i3s: {} };
    setAttributesLoading(true);
    const selectedFeatureAttributes = await loadFeatureAttributes(
      info.object,
      info.index,
      options
    );

    const selectedTilesetBasePath = info.object.tileset.basePath;
    const statisticsInfo = info.object.tileset?.tileset?.statisticsInfo;

    if (statisticsInfo) {
      setTilesetStatisticsInfo(statisticsInfo);
    }

    setAttributesLoading(false);
    setSelectedFeatureAttributes(selectedFeatureAttributes);
    setSelectedFeatureIndex(info.index);
    setSelectedTilesetBasePath(selectedTilesetBasePath);
  };

  const renderStats = () => {
    // TODO - too verbose, get more default styling from stats widget?
    return (
      <StatsWidgetContainer
        id="stats-panel"
        hasSublayers={Boolean(sublayers.length)}
        showBuildingExplorer={false}
        // @ts-expect-error - Type 'HTMLDivElement | null' is not assignable to type 'MutableRefObject<null>'.
        ref={(_) => (statsWidgetContainer = _)}
      />
    );
  };

  const getTooltip = () => {
    if (isAttributesLoading) {
      // eslint-disable-next-line no-undef
      const tooltip = document.createElement("div");
      render(<FontAwesomeIcon icon={faSpinner} />, tooltip);
      return { html: tooltip.innerHTML };
    }

    return null;
  };

  const renderAttributesPanel = () => (
    <AttributesPanel
      title={
        selectedFeatureAttributes?.NAME ||
        selectedFeatureAttributes?.OBJECTID ||
        ""
      }
      onClose={handleClosePanel}
      tilesetName={activeLayers[0]?.name}
      attributes={selectedFeatureAttributes}
      statisticsInfo={tilesetStatisticsInfo}
      tilesetBasePath={selectedTilesetBasePath}
      colorsByAttribute={colorsByAttribute}
      onColorsByAttributeChange={setColorsByAttribute}
    />
  );

  const renderMemory = () => {
    return <StatsWidgetWrapper showMemory>{renderStats()}</StatsWidgetWrapper>;
  };

  const onChangeMainToolsPanelHandler = (active: ActiveButton) => {
    setActiveButton((prevValue) =>
      prevValue === active ? ActiveButton.none : active
    );
  };

  const onLayerInsertHandler = (newLayer: LayerExample) => {
    const newExamples = [...examples, newLayer];
    setExamples(newExamples);
    const newActiveLayers = handleSelectAllLeafsInGroup(newLayer);
    setActiveLayers(newActiveLayers);
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

  const pointToTileset = (layerViewState?: LayerViewState) => {
    if (layerViewState) {
      const { zoom, longitude, latitude } = layerViewState;

      setViewState({
        main: {
          ...viewState.main,
          zoom: zoom + 2.5,
          longitude,
          latitude,
          transitionDuration: 1000,
        },
      });
    }
  };

  const onUpdateSublayerVisibilityHandler = (sublayer: Sublayer) => {
    if (sublayer.layerType === "3DObject") {
      const flattenedSublayer = flattenedSublayers.find(
        (fSublayer) => fSublayer.id === sublayer.id
      );
      if (flattenedSublayer) {
        flattenedSublayer.visibility = sublayer.visibility;
        setFlattenedSublayers([...flattenedSublayers]);
      }
    }
  };

  const onInsertBaseMapHandler = (baseMap: BaseMap) => {
    setBaseMaps((prevValues) => [...prevValues, baseMap]);
    setSelectedBaseMap(baseMap);
  };

  const onSelectBaseMapHandler = (baseMapId: string) => {
    const baseMap = baseMaps.find((map) => map.id === baseMapId);

    if (baseMap) {
      setSelectedBaseMap(baseMap);
    }
  };

  const onDeleteBaseMapHandler = (baseMapId: string) => {
    setBaseMaps((prevValues) =>
      prevValues.filter((baseMap) => baseMap.id !== baseMapId)
    );

    setSelectedBaseMap(BASE_MAPS[0]);
  };

  const onViewStateChangeHandler = (viewStateSet: ViewStateSet) => {
    setViewState(viewStateSet);
  };

  return (
    <MapArea>
      {selectedFeatureAttributes && renderAttributesPanel()}
      {renderMemory()}
      <DeckGlWrapper
        parentViewState={{
          ...viewState,
          main: {
            ...viewState.main,
          },
        }}
        showTerrain={selectedBaseMap.id === "Terrain"}
        mapStyle={selectedBaseMap.mapUrl}
        pickable={isLayerPickable()}
        layers3d={layers3d}
        lastLayerSelectedId={selectedLayerIds[0] || ""}
        loadedTilesets={loadedTilesets}
        selectedTilesetBasePath={selectedTilesetBasePath}
        selectedIndex={selectedFeatureIndex}
        colorsByAttribute={colorsByAttribute}
        onAfterRender={() => updateStatWidgets()}
        getTooltip={getTooltip}
        onClick={handleClick}
        onViewStateChange={onViewStateChangeHandler}
        onTilesetLoad={onTilesetLoad}
        onTileLoad={() => updateStatWidgets()}
        onTileUnload={() => updateStatWidgets()}
      />
      <RightSideToolsPanelWrapper layout={layout}>
        <MainToolsPanel
          id="viewer--tools-panel"
          activeButton={activeButton}
          showLayerOptions
          onChange={onChangeMainToolsPanelHandler}
        />
      </RightSideToolsPanelWrapper>
      {activeButton === ActiveButton.options && (
        <RightSidePanelWrapper layout={layout}>
          <LayersPanel
            id="viewer--layers-panel"
            layers={examples}
            selectedLayerIds={selectedLayerIds}
            onLayerInsert={onLayerInsertHandler}
            onLayerSelect={onLayerSelectHandler}
            onLayerDelete={(id) => onLayerDeleteHandler(id)}
            onPointToLayer={(viewState) => pointToTileset(viewState)}
            type={ListItemType.Radio}
            sublayers={sublayers}
            onUpdateSublayerVisibility={onUpdateSublayerVisibilityHandler}
            onClose={() => onChangeMainToolsPanelHandler(ActiveButton.options)}
            baseMaps={baseMaps}
            selectedBaseMapId={selectedBaseMap.id}
            insertBaseMap={onInsertBaseMapHandler}
            selectBaseMap={onSelectBaseMapHandler}
            deleteBaseMap={onDeleteBaseMapHandler}
          />
        </RightSidePanelWrapper>
      )}
    </MapArea>
  );
};
