import { TerrainLayer, Tile3DLayer } from "@deck.gl/geo-layers";
import type {
  BoundingVolumeColoredBy,
  BoundingVolumeType,
  ColorsByAttribute,
  FiltersByAttribute,
  LoadOptions,
  NormalsDebugData,
  PositionsData,
  TileColoredBy,
  ViewStateSet,
} from "../../types";
import { TilesetType } from "../../types";
import { CesiumIonLoader, Tiles3DLoader } from "@loaders.gl/3d-tiles";
import {
  COORDINATE_SYSTEM,
  type Position,
  WebMercatorViewport,
} from "@deck.gl/core/typed";
import { DataDrivenTile3DLayer } from "@deck.gl-community/layers/src/data-driven-tile-3d-layer/data-driven-tile-3d-layer";
import { colorizeTile } from "../colorize-tile";
import { filterTile } from "../../utils/tiles-filtering/filter-tile";
import type { Tile3D, Tileset3D } from "@loaders.gl/tiles";
import ColorMap from "../debug/colors-map";
import { getFrustumBounds } from "../debug/frustum-utils";
import {
  getNormalSourcePosition,
  getNormalTargetPosition,
} from "../debug/normals-utils";
import { buildMinimapData } from "../debug/build-minimap-data";
import { ScatterplotLayer, LineLayer } from "@deck.gl/layers/typed";
import { I3SLoader } from "@loaders.gl/i3s";
import { BoundingVolumeLayer } from "../../layers/bounding-volume-layer/bounding-volume-layer";

// https://github.com/tilezen/joerd/blob/master/docs/use-service.md#additional-amazon-s3-endpoints
const MAPZEN_TERRAIN_IMAGES =
  "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png";
const TERRAIN_TEXTURE = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const MAPZEN_ELEVATION_DECODE_PARAMETERS = {
  rScaler: 256,
  gScaler: 1,
  bScaler: 1 / 256,
  offset: -32768,
};
const TERRAIN_LAYER_MAX_ZOOM = 15;

const render3DTilesLayer = (
  layer: {
    id?: number | undefined;
    url?: string | undefined;
    token?: string | null | undefined;
    type: TilesetType;
  },
  loadNumber: number,
  onTilesetLoadHandler,
  onTileLoadHandler,
  onTileUnload,
  onTraversalComplete
) => {
  const loadOptions =
    layer.type === TilesetType.CesiumIon
      ? { "cesium-ion": { accessToken: layer.token } }
      : {};
  const loader =
    layer.type === TilesetType.CesiumIon ? CesiumIonLoader : Tiles3DLoader;
  return new Tile3DLayer({
    id: `tile-layer-${layer.id}--${loadNumber}`,
    data: layer.url,
    loader,
    loadOptions,
    onTilesetLoad: onTilesetLoadHandler,
    onTileLoad: onTileLoadHandler,
    onTileUnload,
    onTraversalComplete,
  });
};

const colorMap = new ColorMap();
const getMeshColor = (
  tile,
  tileColorMode: TileColoredBy,
  selectedTile?: Tile3D | null,
  coloredTilesMap?: Record<string, string>
) => {
  const result = colorMap.getTileColor(tile, {
    coloredBy: tileColorMode,
    selectedTileId: selectedTile?.id,
    coloredTilesMap,
  });

  return result;
};

const renderI3SLayer = (
  layer: {
    id?: number | undefined;
    url?: string | undefined;
    fetch?: ((input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>);
    token?: string | null | undefined;
    type: TilesetType;
  },
  useDracoGeometry: boolean,
  useCompressedTextures: boolean,
  loadNumber: number,
  colorsByAttribute: ColorsByAttribute | null,
  pickable: boolean,
  autoHighlight: boolean,
  wireframe: boolean,
  tileColorMode: TileColoredBy,
  onClick,
  onTilesetLoadHandler,
  onTileLoadHandler,
  onTileUnload,
  onTraversalComplete,
  filtersByAttribute?: FiltersByAttribute | null,
  selectedTile?: Tile3D | null,
  coloredTilesMap?: Record<string, string>,
  selectedTilesetBasePath?: string | null,
  selectedIndex?: number
) => {
  const loadOptions: LoadOptions = {
    i3s: {
      coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
      useDracoGeometry,
      useCompressedTextures,
    },
    fetch: layer.fetch,
    worker: layer.fetch?false:true
  };
  let url = layer.url;
  if (layer.token && url && typeof url === "string") {
    loadOptions.i3s.token = layer.token;
    const urlObject = new URL(url);
    urlObject.searchParams.append("token", layer.token);
    url = urlObject.href;
  }
  return new DataDrivenTile3DLayer({
    id: `tile-layer-${layer.id}-draco-${useDracoGeometry}-compressed-textures-${useCompressedTextures}--${loadNumber}`,
    data: url,
    loader: I3SLoader,
    colorsByAttribute,
    customizeColors: colorizeTile,
    filtersByAttribute,
    filterTile,
    onClick,
    onTilesetLoad: onTilesetLoadHandler,
    onTileLoad: onTileLoadHandler,
    onTileUnload,
    onTraversalComplete,
    loadOptions,
    pickable,
    autoHighlight,
    _subLayerProps: {
      mesh: {
        wireframe,
      },
    },
    _getMeshColor: (tile) =>
      getMeshColor(tile, tileColorMode, selectedTile, coloredTilesMap),
    highlightedObjectIndex: autoHighlight
      ? undefined
      : layer.url === selectedTilesetBasePath
        ? selectedIndex
        : -1,
    fetch: layer.fetch,
  });
};

export const renderFrustum = (
  showMinimap: boolean,
  viewState: ViewStateSet
) => {
  if (!showMinimap) {
    return false;
  }
  const viewport = new WebMercatorViewport(viewState.main);
  const frustumBounds = getFrustumBounds(viewport);
  return new LineLayer({
    id: "frustum",
    data: frustumBounds,
    getSourcePosition: (d) => d.source,
    getTargetPosition: (d) => d.target,
    getColor: (d) => d.color,
    getWidth: 2,
  });
};

const getAllTilesFromTilesets = (tilesets) => {
  const allTiles = tilesets.map((tileset) => tileset.tiles);
  return allTiles.flat();
};

const DEFAULT_BG_OPACITY = 100;
const getBoundingVolumeColor = (
  tile,
  boundingVolumeColorMode: BoundingVolumeColoredBy
) => {
  const color = colorMap.getBoundingVolumeColor(tile, {
    coloredBy: boundingVolumeColorMode,
  });

  return [...color, DEFAULT_BG_OPACITY];
};

export const renderBoundingVolumeLayer = (
  boundingVolume: boolean,
  boundingVolumeType: BoundingVolumeType,
  boundingVolumeColorMode: BoundingVolumeColoredBy,
  loadedTilesets?: Tileset3D[]
) => {
  if (!boundingVolume) {
    return null;
  }
  const tiles = getAllTilesFromTilesets(loadedTilesets);
  // @ts-expect-error - Expected 0 arguments, but got 1.
  return new BoundingVolumeLayer({
    id: "bounding-volume-layer",
    visible: boundingVolume,
    tiles,
    getBoundingVolumeColor: (tile) =>
      getBoundingVolumeColor(tile, boundingVolumeColorMode),
    boundingVolumeType,
  });
};

const NORMALS_COLOR: Position = [255, 0, 0];
export const renderNormals = (
  normalsTrianglesPercentage: number,
  normalsLength: number,
  normalsDebugData?: NormalsDebugData | null
) => {
  if (!normalsDebugData) {
    return;
  }
  return new LineLayer({
    id: "normals-debug",
    data: normalsDebugData,
    getSourcePosition: (_, { index, data }) =>
      getNormalSourcePosition(
        index,
        data as unknown as PositionsData,
        normalsTrianglesPercentage
      ),
    getTargetPosition: (_, { index, data }) =>
      getNormalTargetPosition(
        index,
        data as unknown as PositionsData,
        normalsTrianglesPercentage,
        normalsLength
      ),
    getColor: () => NORMALS_COLOR,
    modelMatrix: normalsDebugData?.cartographicModelMatrix,
    coordinateOrigin: normalsDebugData.cartographicOrigin
      ? [
          normalsDebugData.cartographicOrigin.x,
          normalsDebugData.cartographicOrigin.y,
          normalsDebugData.cartographicOrigin.z,
        ]
      : undefined,
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    getWidth: 1,
  });
};

export const renderMainOnMinimap = (
  createIndependentMinimapViewport: boolean,
  loadedTilesets: Tileset3D[]
) => {
  if (!createIndependentMinimapViewport) {
    return null;
  }
  let data = [];

  if (loadedTilesets.length) {
    const tiles = getAllTilesFromTilesets(loadedTilesets);
    data = buildMinimapData(tiles);
  }

  return new ScatterplotLayer({
    id: "main-on-minimap",
    data,
    pickable: false,
    opacity: 0.8,
    stroked: true,
    filled: true,
    radiusScale: 1,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    getPosition: (d) => d.coordinates,
    getRadius: (d) => d.radius,
    getFillColor: () => [255, 140, 0, 100],
    getLineColor: () => [0, 0, 0, 120],
  });
};

export const renderLayers = (params: {
  layers3d: Array<{
    id?: number;
    url?: string;
    fetch?: ((input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>);
    token?: string | null;
    type: TilesetType;
  }>;
  useDracoGeometry: boolean;
  useCompressedTextures: boolean;
  showTerrain: boolean;
  loadNumber: number;
  colorsByAttribute: ColorsByAttribute | null;
  pickable: boolean;
  autoHighlight: boolean;
  wireframe: boolean;
  tileColorMode: TileColoredBy;
  showMinimap: boolean;
  viewState: ViewStateSet;
  boundingVolume: boolean;
  boundingVolumeType: BoundingVolumeType;
  normalsTrianglesPercentage: number;
  normalsLength: number;
  createIndependentMinimapViewport: boolean;
  boundingVolumeColorMode: BoundingVolumeColoredBy;
  loadedTilesets: Tileset3D[];
  onClick;
  onTilesetLoadHandler;
  onTileLoadHandler;
  onTileUnload;
  onTraversalComplete;
  onTerrainTileLoad: (tile) => void;
  filtersByAttribute?: FiltersByAttribute | null;
  selectedTile?: Tile3D | null;
  coloredTilesMap?: Record<string, string>;
  selectedTilesetBasePath?: string | null;
  selectedIndex?: number;
  normalsDebugData?: NormalsDebugData | null;
}) => {
  const {
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
    loadedTilesets,
    boundingVolumeColorMode,
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
  } = params;
  const tile3dLayers = layers3d.map((layer) => {
    switch (layer.type) {
      case TilesetType.CesiumIon:
      case TilesetType.Tiles3D:
        return render3DTilesLayer(
          layer,
          loadNumber,
          onTilesetLoadHandler,
          onTileLoadHandler,
          onTileUnload,
          onTraversalComplete
        );
      case TilesetType.I3S:
      default:
        return renderI3SLayer(
          layer,
          useDracoGeometry,
          useCompressedTextures,
          loadNumber,
          colorsByAttribute,
          pickable,
          autoHighlight,
          wireframe,
          tileColorMode,
          onClick,
          onTilesetLoadHandler,
          onTileLoadHandler,
          onTileUnload,
          onTraversalComplete,
          filtersByAttribute,
          selectedTile,
          coloredTilesMap,
          selectedTilesetBasePath,
          selectedIndex
        );
    }
  });

  if (showTerrain) {
    const terrainLayer = new TerrainLayer({
      id: "terrain",
      maxZoom: TERRAIN_LAYER_MAX_ZOOM,
      elevationDecoder: MAPZEN_ELEVATION_DECODE_PARAMETERS,
      elevationData: MAPZEN_TERRAIN_IMAGES,
      texture: TERRAIN_TEXTURE,
      onTileLoad: (tile) => {
        onTerrainTileLoad(tile);
      },
      color: [255, 255, 255],
    });
    tile3dLayers.push(terrainLayer);
  }

  return [
    ...tile3dLayers,
    renderFrustum(showMinimap, viewState),
    renderBoundingVolumeLayer(
      boundingVolume,
      boundingVolumeType,
      boundingVolumeColorMode,
      loadedTilesets
    ),
    renderNormals(normalsTrianglesPercentage, normalsLength, normalsDebugData),
    renderMainOnMinimap(createIndependentMinimapViewport, loadedTilesets),
  ];
};
