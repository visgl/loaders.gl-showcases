import { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import styled from "styled-components";

import { load } from "@loaders.gl/core";
import { lumaStats } from "@luma.gl/core";
import {
  I3SBuildingSceneLayerLoader,
  loadFeatureAttributes,
  SceneLayer3D,
} from "@loaders.gl/i3s";
import { StatsWidget } from "@probe.gl/stats-widget";

import { ControlPanel, BuildingExplorer } from "../../components";
import {
  parseTilesetFromUrl,
  parseTilesetUrlParams,
  buildSublayersTree,
  initStats,
  sumTilesetsStats,
  useForceUpdate,
} from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { INITIAL_EXAMPLE, EXAMPLES } from "../../constants/i3s-examples";
import { INITIAL_MAP_STYLE } from "../../constants/map-styles";
import { CUSTOM_EXAMPLE_VALUE } from "../../constants/i3s-examples";
import { Tile3D, Tileset3D } from "@loaders.gl/tiles";
import {
  color_brand_primary,
  color_canvas_inverted,
} from "../../constants/colors";
import { TileDetailsPanel } from "../../components/tile-details-panel/tile-details-panel";
import { FeatureAttributes } from "../../components/feature-attributes/feature-attributes";
import { Sublayer } from "../../types";
import { LayerExample } from "../../types";
import { DeckGlI3s } from "../../components/deck-gl-i3s/deck-gl-i3s";

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
  color: ${color_canvas_inverted};
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

/**
 * TODO: Add types to component
 */
export const ViewerApp = () => {
  let statsWidgetContainer = useRef(null);
  const forceUpdate = useForceUpdate();

  const [token, setToken] = useState(null);
  const [selectedMapStyle, setSelectedMapStyle] = useState(INITIAL_MAP_STYLE);
  const [selectedFeatureAttributes, setSelectedFeatureAttributes] =
    useState(null);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(-1);
  const [selectedTilesetBasePath, setSelectedTilesetBasePath] = useState(null);
  const [isAttributesLoading, setAttributesLoading] = useState(false);
  const [showBuildingExplorer, setShowBuildingExplorer] = useState(false);
  const [flattenedSublayers, setFlattenedSublayers] = useState<Tile3D[]>([]);
  const [sublayers, setSublayers] = useState<Sublayer[]>([]);
  const [tilesetsStats, setTilesetsStats] = useState(initStats());
  const [useTerrainLayer, setUseTerrainLayer] = useState(false);
  const [metadata, setMetadata] = useState<SceneLayer3D[] | null>(null);

  const [memWidget, setMemWidget] = useState<StatsWidget | null>(null);
  const [tilesetStatsWidget, setTilesetStatsWidget] =
    useState<StatsWidget | null>(null);
  const [loadedTilesets, setLoadedTilesets] = useState<Tileset3D[]>([]);

  const initMainTileset = (): LayerExample => {
    const tilesetParam = parseTilesetFromUrl();

    if (tilesetParam?.startsWith("http")) {
      return {
        id: tilesetParam,
        name: CUSTOM_EXAMPLE_VALUE,
        url: tilesetParam,
      };
    }

    if (tilesetParam in EXAMPLES) {
      return EXAMPLES[tilesetParam];
    }

    return INITIAL_EXAMPLE;
  };

  const [mainTileset, setMainTileset] = useState(initMainTileset());

  /**
   * Initialize stats widgets
   */
  useEffect(() => {
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
    const tilesetsStats = initStats(mainTileset.url);

    tilesetStatsWidget && tilesetStatsWidget.setStats(tilesetsStats);
    setTilesetsStats(tilesetsStats);
  }, [loadedTilesets]);

  /**
   * Hook to call multiple changing function based on selected tileset.
   */
  useEffect(() => {
    async function fetchMetadata(metadataUrl) {
      const metadata = await fetch(metadataUrl).then((resp) => resp.json());
      setMetadata(metadata);
    }

    async function fetchFlattenedSublayers(tilesetUrl) {
      const flattenedSublayers = await getFlattenedSublayers(tilesetUrl);
      setFlattenedSublayers(flattenedSublayers);
    }

    const params = parseTilesetUrlParams(mainTileset.url, mainTileset);
    const { tilesetUrl, token, metadataUrl } = params;

    fetchMetadata(metadataUrl);
    fetchFlattenedSublayers(tilesetUrl);

    setToken(token);
    setSublayers([]);
    setLoadedTilesets([]);
    setShowBuildingExplorer(false);
    setSelectedFeatureAttributes(null);
    setSelectedFeatureIndex(-1);
  }, [mainTileset]);

  /**
   * Tries to get Building Scene Layer sublayer urls if exists.
   * @param {string} tilesetUrl
   * @returns {string[]} Sublayer urls or tileset url.
   * TODO Add filtration mode for sublayers which were selected by user.
   */
  const getFlattenedSublayers = async (tilesetUrl) => {
    try {
      const tileset = await load(tilesetUrl, I3SBuildingSceneLayerLoader);
      const sublayersTree = buildSublayersTree(tileset.header.sublayers);
      setSublayers(sublayersTree?.sublayers || []);
      const sublayers = tileset?.sublayers.filter(
        (sublayer) => sublayer.name !== "Overview"
      );
      return sublayers;
    } catch (e) {
      return [{ url: tilesetUrl, visibility: true }];
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
  };

  const onSelectMapStyle = ({ selectedMapStyle }) => {
    setSelectedMapStyle(selectedMapStyle);
  };

  const toggleTerrain = () => {
    setUseTerrainLayer((prevValue) => !prevValue);
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

    const options = { i3s: {} };

    if (token) {
      options.i3s = { token };
    }

    setAttributesLoading(true);
    const selectedFeatureAttributes = await loadFeatureAttributes(
      info.object,
      info.index,
      options
    );
    setAttributesLoading(false);

    const selectedTilesetBasePath = info.object.tileset.basePath;
    // @ts-expect-error - Argument of type '{} | null' is not assignable to parameter of type 'SetStateAction<null>'.
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
        showBuildingExplorer={showBuildingExplorer}
        // @ts-expect-error - Type 'HTMLDivElement | null' is not assignable to type 'MutableRefObject<null>'.
        ref={(_) => (statsWidgetContainer = _)}
      />
    );
  };

  const updateSublayerVisibility = (sublayer) => {
    if (sublayer.layerType === "3DObject") {
      const flattenedSublayer = flattenedSublayers.find(
        (fSublayer) => fSublayer.id === sublayer.id
      );
      if (flattenedSublayer) {
        flattenedSublayer.visibility = sublayer.visibility;
        forceUpdate();

        if (!sublayer.visibility) {
          setLoadedTilesets((prevValues) =>
            prevValues.filter(
              (tileset) => tileset.basePath !== flattenedSublayer.url
            )
          );
        }
      }
    }
  };

  const onToggleBuildingExplorer = () => {
    setShowBuildingExplorer((prevValue) => !prevValue);
  };

  const renderControlPanel = () => {
    return (
      <ControlPanel
        tileset={mainTileset}
        onExampleChange={setMainTileset}
        onMapStyleChange={onSelectMapStyle}
        selectedMapStyle={selectedMapStyle}
        useTerrainLayer={useTerrainLayer}
        toggleTerrain={toggleTerrain}
      ></ControlPanel>
    );
  };

  const renderBuildingExplorer = () => {
    return (
      <BuildingExplorer
        sublayers={sublayers}
        onToggleBuildingExplorer={onToggleBuildingExplorer}
        onUpdateSublayerVisibility={updateSublayerVisibility}
        isShown={showBuildingExplorer}
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

  const renderAttributesPanel = () => {
    const title = selectedFeatureAttributes
      ? // @ts-expect-error - Property 'NAME' does not exist on type 'never'.
        selectedFeatureAttributes.NAME || selectedFeatureAttributes.OBJECTID
      : "";

    return (
      <TileDetailsPanel title={title} handleClosePanel={handleClosePanel}>
        <FeatureAttributes
          attributesObject={selectedFeatureAttributes}
        ></FeatureAttributes>
      </TileDetailsPanel>
    );
  };

  const renderMemory = () => {
    return (
      <StatsWidgetWrapper showMemory={!showBuildingExplorer}>
        {renderStats()}
      </StatsWidgetWrapper>
    );
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

  return (
    <>
      {renderControlPanel()}
      {selectedFeatureAttributes && renderAttributesPanel()}
      {Boolean(sublayers?.length) && renderBuildingExplorer()}
      {renderMemory()}
      <DeckGlI3s
        showTerrain={useTerrainLayer}
        mapStyle={selectedMapStyle}
        pickable={isLayerPickable()}
        i3sLayers={getI3sLayers()}
        lastLayerSelectedId={mainTileset.url}
        metadata={metadata}
        loadedTilesets={loadedTilesets}
        selectedTilesetBasePath={selectedTilesetBasePath}
        selectedIndex={selectedFeatureIndex}
        onAfterRender={() => updateStatWidgets()}
        getTooltip={getTooltip}
        onClick={handleClick}
        onTilesetLoad={onTilesetLoad}
        onTileLoad={() => updateStatWidgets()}
        onTileUnload={() => updateStatWidgets()}
      />
    </>
  );
};
