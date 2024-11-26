import { Map as MaplibreMap } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import {
  MapController,
  type InteractionState,
  type WebMercatorViewport,
  FlyToInterpolator, type PickingInfo, View,
} from "@deck.gl/core";
import type { Tile3D, Tileset3D } from "@loaders.gl/tiles";
import { type SceneLayer3D } from "@loaders.gl/i3s";
import { CONTRAST_MAP_STYLES } from "../../constants/map-styles";
import {
  type NormalsDebugData,
  type TilesetType,
  type MinimapPosition,
  type FiltersByAttribute,
} from "../../types";
import {
  selectDebugTextureForTile,
  selectOriginalTextureForTile,
} from "../../utils/debug/texture-selector-utils";
import { getElevationByCentralTile } from "../../utils/terrain-elevation";
import { getLonLatWithElevationOffset } from "../../utils/elevation-utils";

import { useAppDispatch } from "../../redux/hooks";

import { renderLayers } from "../../utils/deckgl/render-layers";
import { layerFilterCreator } from "../../utils/deckgl/layers-filter";
import { setViewState } from "../../redux/slices/view-state-slice";
import { useDeckGl } from "../../hooks/use-deckgl-hook/use-deckgl-hook";

import styled from "styled-components";

const WrapperAttributionContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: end;
`;

const AttributionContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  margin: 8px;
`;

const TRANSITION_DURAITON = 4000;

interface DeckGlI3sProps {
  /** DeckGL component id */
  id?: string;
  /** User selected tiles colors */
  coloredTilesMap?: Record<string, string>;
  /** Allows layers picking to handle mouse events */
  pickable?: boolean;
  /** Layers loading data  */
  layers3d: Array<{
    id?: number;
    url?: string;
    token?: string | null;
    type: TilesetType;
  }>;
  /** Last selected layer id. Prop to reset some settings when new layer selected */
  lastLayerSelectedId: string;
  /** Load debug texture image */
  loadDebugTextureImage?: boolean;
  /** If `true` picking will select I3S features
   * If `false` picking will select the whole tile
   */
  featurePicking?: boolean;
  /** Data for normals visualization */
  normalsDebugData?: NormalsDebugData | null;
  /** Percentage of triangles to show normals for */
  normalsTrianglesPercentage?: number;
  /** Normals lenght in meters */
  normalsLength?: number;
  /** http://<root-url>/SceneServer json */
  metadata?: { layers: SceneLayer3D[] } | null;
  /** Basepath of the tileset of the selected tile */
  selectedTilesetBasePath?: string | null;
  /** Tile, selected by picking event */
  selectedTile?: Tile3D | null;
  /** Index of picked object */
  selectedIndex?: number;
  /** Deckgl flag to highlight picked objects automaticaly */
  autoHighlight?: boolean;
  /** List of initialized tilesets */
  loadedTilesets?: Tileset3D[];
  /** I3S option to choose type of geometry */
  useDracoGeometry?: boolean;
  /** I3S option to choose type of textures */
  useCompressedTextures?: boolean;
  /** enables or disables viewport interactivity */
  disableController?: boolean;
  /** allows update a layer */
  loadNumber?: number;
  /** prevent transition to a layer */
  preventTransitions?: boolean;
  /** calculate position of minimap */
  minimapPosition?: MinimapPosition;
  /** side for compare mode */
  filtersByAttribute?: FiltersByAttribute | null;
  onWebGLInitialized?: (gl: any) => void;
  /** DeckGL after render callback */
  onAfterRender?: () => void;
  /** DeckGL onInteractionStateChange callback */
  onInteractionStateChange?: (interactionState: InteractionState) => void;
  /** DeckGL callback. On layer hover behavior */
  getTooltip?: (info: { object: Tile3D; index: number; layer: any }) => void;
  /** DeckGL callback. On layer click behavior */
  onClick?: (info: PickingInfo) => void;
  /** Tile3DLayer callback. Triggers after a tileset was initialized */
  onTilesetLoad: (tileset: Tileset3D) => void;
  /** Tile3DLayer callback. Triggers after tile content was loaded */
  onTileLoad?: (tile: Tile3D) => void;
  /** Tile3DLayer callback. Triggers after tile contenst was unloaded */
  onTileUnload?: (tile: Tile3D) => void;
  /** Tile3DLayer callback. Triggers post traversal completion */
  onTraversalComplete?: (selectedTiles: Tile3D[]) => Tile3D[];
}

export const DeckGlWrapper = ({
  id,
  coloredTilesMap,
  pickable = false,
  layers3d,
  lastLayerSelectedId,
  loadDebugTextureImage = false,
  featurePicking = true,
  normalsDebugData,
  normalsTrianglesPercentage = 100,
  normalsLength = 1,
  metadata,
  selectedTilesetBasePath,
  selectedTile,
  selectedIndex,
  autoHighlight = false,
  loadedTilesets = [],
  useDracoGeometry = true,
  useCompressedTextures = true,
  disableController = false,
  loadNumber = 0,
  preventTransitions = false,
  minimapPosition,
  filtersByAttribute,
  onWebGLInitialized,
  onAfterRender,
  onInteractionStateChange,
  getTooltip,
  onClick,
  onTilesetLoad,
  onTileLoad,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTileUnload = () => {},
  onTraversalComplete = (selectedTiles) => selectedTiles,
}: DeckGlI3sProps) => {
  const {
    dragMode,
    showMinimap,
    loadTiles,
    createIndependentMinimapViewport,
    tileColorMode,
    boundingVolumeColorMode,
    wireframe,
    showTerrain,
    mapStyle,
    boundingVolume,
    boundingVolumeType,
    colorsByAttribute,
    globalViewState,
    terrainTiles,
    needTransitionToTileset,
    VIEWS,
    viewState,
    showDebugTextureRef,
    uvDebugTextureRef,
    setNeedTransitionToTileset,
    setTerrainTiles,
  } = useDeckGl(
    lastLayerSelectedId,
    loadDebugTextureImage,
    loadedTilesets,
    disableController,
    minimapPosition
  );
  const dispatch = useAppDispatch();
  const getViews = () => (showMinimap ? VIEWS : [VIEWS[0]]);
  let currentViewport: WebMercatorViewport = null;

  const onViewStateChangeHandler = ({
    interactionState,
    viewState,
    viewId,
  }) => {
    const {
      longitude,
      latitude,
      position: [, , oldElevation],
    } = viewState;

    const viewportCenterTerrainElevation =
      getElevationByCentralTile(longitude, latitude, terrainTiles) ?? 0;
    let cameraTerrainElevation: number | null = null;

    if (currentViewport) {
      const cameraPosition = currentViewport.unprojectPosition(
        currentViewport.cameraPosition
      );
      cameraTerrainElevation =
        getElevationByCentralTile(
          cameraPosition[0],
          cameraPosition[1],
          terrainTiles
        ) ?? 0;
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

    let newViewState;
    if (viewId === "minimap") {
      newViewState = {
        main: {
          ...globalViewState.main,
          longitude: viewState.longitude,
          latitude: viewState.latitude,
          position: [0, 0, elevation],
        },
        minimap: viewState,
      };
    } else {
      newViewState = {
        main: {
          ...viewState,
          position: [0, 0, elevation],
        },
        minimap: {
          ...globalViewState.minimap,
          longitude: viewState.longitude,
          latitude: viewState.latitude,
        },
      };
    }
    dispatch(setViewState(newViewState));
  };

  const onTilesetLoadHandler = (tileset: Tileset3D) => {
    if (needTransitionToTileset && !preventTransitions) {
      const { zoom, cartographicCenter } = tileset;
      const [longitude, latitude] = cartographicCenter ?? [];
      const viewport = new VIEWS[0].ViewportType(globalViewState.main);
      const {
        main: { pitch, bearing },
      } = globalViewState;

      const { zmin = 0 } = metadata?.layers?.[0]?.fullExtent ?? {};
      const [pLongitude, pLatitude] = getLonLatWithElevationOffset(
        zmin,
        pitch,
        bearing,
        longitude,
        latitude,
        viewport
      );

      const newViewState = {
        main: {
          ...globalViewState.main,
          zoom: zoom + 2,
          longitude: pLongitude,
          latitude: pLatitude,
          bearing: 0,
          pitch: 45,
          transitionDuration: TRANSITION_DURAITON,
          transitionInterpolator: new FlyToInterpolator(),
        },
        minimap: {
          ...globalViewState.minimap,
          longitude: pLongitude,
          latitude: pLatitude,
        },
      };
      setNeedTransitionToTileset(false);
      dispatch(setViewState(newViewState));
    }

    const viewportTraversersMap = {
      main: "main",
      minimap: createIndependentMinimapViewport ? "minimap" : "main",
    };
    tileset.setProps({
      viewportTraversersMap,
      loadTiles,
    });
    onTilesetLoad(tileset);
  };

  const onTileLoadHandler = async (tile) => {
    if (!featurePicking) {
      // delete featureIds from data to have instance picking instead of feature picking
      delete tile.content.featureIds;
    }
    if (showDebugTextureRef.current) {
      await selectDebugTextureForTile(tile, uvDebugTextureRef.current);
    } else {
      selectOriginalTextureForTile(tile);
    }
    if (onTileLoad) {
      onTileLoad(tile);
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

  const doRenderLayers = () => {
    return renderLayers({
      layers3d,
      useDracoGeometry,
      useCompressedTextures,
      showTerrain,
      loadNumber,
      colorsByAttribute,
      pickable,
      autoHighlight,
      wireframe,
      tileColorMode,
      showMinimap,
      viewState,
      boundingVolume,
      boundingVolumeType,
      normalsTrianglesPercentage,
      normalsLength,
      createIndependentMinimapViewport,
      boundingVolumeColorMode,
      loadedTilesets,
      onClick,
      onTilesetLoadHandler,
      onTileLoadHandler,
      onTileUnload,
      onTraversalComplete,
      onTerrainTileLoad,
      filtersByAttribute,
      selectedTile,
      coloredTilesMap,
      selectedTilesetBasePath,
      selectedIndex,
      normalsDebugData,
    });
  };

  return (
    <DeckGL
      id={id}
      layers={doRenderLayers()}
      viewState={viewState}
      views={getViews()}
      layerFilter={layerFilterCreator(showMinimap)}
      onViewStateChange={onViewStateChangeHandler}
      controller={
        disableController
          ? false
          : {
              type: MapController,
              maxPitch: 60,
              inertia: true,
              scrollZoom: { speed: 0.01, smooth: true },
              touchRotate: true,
              dragMode,
            }
      }
      glOptions={{
        preserveDrawingBuffer: true,
      }}
      onWebGLInitialized={onWebGLInitialized}
      onAfterRender={onAfterRender}
      onInteractionStateChange={onInteractionStateChange}
      getTooltip={getTooltip}
      onClick={onClick}
    >
      {({ viewport }) => {
        currentViewport = viewport;
      }}
      {!showTerrain && (
        <MaplibreMap mapStyle={mapStyle} terrain={undefined}></MaplibreMap>
      )}
      {mapStyle && (
        <View id="minimap">
          <MaplibreMap mapStyle={CONTRAST_MAP_STYLES[mapStyle]}></MaplibreMap>
        </View>
      )}
      {showTerrain && (
        <WrapperAttributionContainer>
          <AttributionContainer>
            <div>
              &copy;
              <a href="http://www.openstreetmap.org/copyright/" target="_blank" rel="noreferrer">
                OpenStreetMap
              </a>{" "}
              contributors
            </div>
          </AttributionContainer>
        </WrapperAttributionContainer>
      )}
    </DeckGL>
  );
};
