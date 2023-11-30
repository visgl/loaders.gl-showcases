import { TerrainLayer, Tile3DLayer } from "@deck.gl/geo-layers";
import {
  BoundingVolumeColoredBy,
  BoundingVolumeType,
  ColorsByAttribute,
  FiltersByAttribute,
  LoadOptions,
  NormalsDebugData,
  TileColoredBy,
  TilesetType,
  ViewStateSet,
} from "../../types";
import { CesiumIonLoader, Tiles3DLoader } from "@loaders.gl/3d-tiles";
import { COORDINATE_SYSTEM, WebMercatorViewport } from "@deck.gl/core/typed";
import { BoundingVolumeLayer, CustomTile3DLayer } from "../../layers";
import { colorizeTile } from "../colorize-tile";
import { filterTile } from "../../utils/tiles-filtering/filter-tile";
import { Tile3D, Tileset3D } from "@loaders.gl/tiles";
import ColorMap from "../debug/colors-map";
import { getFrustumBounds } from "../debug/frustum-utils";
import { LineLayer } from "@deck.gl/layers";
import {
  getNormalSourcePosition,
  getNormalTargetPosition,
} from "../debug/normals-utils";
import { buildMinimapData } from "../debug/build-minimap-data";
import { ScatterplotLayer } from "@deck.gl/layers/typed";
import { I3SLoader } from "@loaders.gl/i3s";

// https://github.com/tilezen/joerd/blob/master/docs/use-service.md#additional-amazon-s3-endpoints
const MAPZEN_TERRAIN_IMAGES = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`;
const ARCGIS_STREET_MAP_SURFACE_IMAGES =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
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
  coloredTilesMap?: { [key: string]: string }
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
  onTilesetLoadHandler,
  onTileLoadHandler,
  onTileUnload,
  onTraversalComplete,
  filtersByAttribute?: FiltersByAttribute | null,
  selectedTile?: Tile3D | null,
  coloredTilesMap?: { [key: string]: string },
  selectedTilesetBasePath?: string | null,
  selectedIndex?: number
) => {
  const loadOptions: LoadOptions = {
    i3s: {
      coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
      useDracoGeometry,
      useCompressedTextures,
    },
  };
  let url = layer.url;
  if (layer.token && url) {
    loadOptions.i3s.token = layer.token;
    const urlObject = new URL(url);
    urlObject.searchParams.append("token", layer.token);
    url = urlObject.href;
  }
  return new CustomTile3DLayer({
    id: `tile-layer-${layer.id}-draco-${useDracoGeometry}-compressed-textures-${useCompressedTextures}--${loadNumber}` as string,
    data: url,
    // @ts-expect-error loader
    loader: I3SLoader,
    colorsByAttribute,
    customizeColors: colorizeTile,
    filtersByAttribute,
    filterTile,
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
  });
};

export const getViewState = (
  showMinimap: boolean,
  viewState: ViewStateSet,
  parentViewState?: ViewStateSet
) => parentViewState || (showMinimap && viewState) || { main: viewState.main };

const renderFrustum = (
  showMinimap: boolean,
  viewState: ViewStateSet,
  parentViewState?: ViewStateSet
) => {
  if (!showMinimap) {
    return false;
  }
  const viewport = new WebMercatorViewport(
    getViewState(showMinimap, viewState, parentViewState).main
  );
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

const renderBoundingVolumeLayer = (
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

const NORMALS_COLOR = [255, 0, 0];
const renderNormals = (
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
      getNormalSourcePosition(index, data, normalsTrianglesPercentage),
    getTargetPosition: (_, { index, data }) =>
      getNormalTargetPosition(
        index,
        data,
        normalsTrianglesPercentage,
        normalsLength
      ),
    getColor: () => NORMALS_COLOR,
    modelMatrix: normalsDebugData?.cartographicModelMatrix,
    coordinateOrigin: normalsDebugData?.cartographicOrigin,
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    getWidth: 1,
  });
};

const renderMainOnMinimap = (
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
  layers3d: {
    id?: number;
    url?: string;
    token?: string | null;
    type: TilesetType;
  }[];
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
  loadedTilesets: Tileset3D[];
  boundingVolumeColorMode: BoundingVolumeColoredBy;
  onTilesetLoadHandler;
  onTileLoadHandler;
  onTileUnload;
  onTraversalComplete;
  onTerrainTileLoad: (tile) => void;
  filtersByAttribute?: FiltersByAttribute | null;
  selectedTile?: Tile3D | null;
  coloredTilesMap?: { [key: string]: string };
  selectedTilesetBasePath?: string | null;
  selectedIndex?: number;
  parentViewState?: ViewStateSet;
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
    parentViewState,
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
      texture: ARCGIS_STREET_MAP_SURFACE_IMAGES,
      onTileLoad: (tile) => onTerrainTileLoad(tile),
      color: [255, 255, 255],
    });
    tile3dLayers.push(terrainLayer);
  }

  return [
    ...tile3dLayers,
    renderFrustum(showMinimap, viewState, parentViewState),
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
