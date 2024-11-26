import { useArcgis } from "../../hooks/use-arcgis-hook/use-arcgis-hook";
import { type Tile3D, type Tileset3D } from "@loaders.gl/tiles";
import { type SceneLayer3D } from "@loaders.gl/i3s";
import {
  FlyToInterpolator,
  type PickingInfo,
  type WebMercatorViewport,
} from "@deck.gl/core";
import { useRef } from "react";
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
import styled from "styled-components";
import { renderLayers } from "../../utils/deckgl/render-layers";
import { layerFilterCreator } from "../../utils/deckgl/layers-filter";
import { setViewState } from "../../redux/slices/view-state-slice";
import { useDeckGl } from "../../hooks/use-deckgl-hook/use-deckgl-hook";

export const StyledMapContainer = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

const TRANSITION_DURAITON = 4000;

interface ArcGisMapProps {
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

export const ArcgisWrapper = ({
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
  onClick,
  onTilesetLoad,
  onTileLoad,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTileUnload = () => {},
  onTraversalComplete = (selectedTiles) => selectedTiles,
}: ArcGisMapProps) => {
  const {
    showMinimap,
    loadTiles,
    createIndependentMinimapViewport,
    tileColorMode,
    boundingVolumeColorMode,
    wireframe,
    showTerrain,
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
  const currentViewport: WebMercatorViewport = null;

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

    tileset.setProps({
      // todo: viewportTraversersMap,
      loadTiles,
    });
    onTilesetLoad(tileset);
  };

  const onTileLoadHandler = (tile) => {
    if (!featurePicking) {
      // delete featureIds from data to have instance picking instead of feature picking
      delete tile.content.featureIds;
    }
    if (showDebugTextureRef.current) {
      void selectDebugTextureForTile(tile, uvDebugTextureRef.current);
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
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useArcgis(mapContainer, viewState, onViewStateChangeHandler);
  if (map) {
    const layers = doRenderLayers();
    // @ts-expect-error @deck.gl/arcgis has no types
    map.deck.set({ layers });
    // @ts-expect-error @deck.gl/arcgis has no types
    map.deck.layerFilter = layerFilterCreator(showMinimap);
  }
  return <StyledMapContainer ref={mapContainer} />;
};
export default ArcgisWrapper;
