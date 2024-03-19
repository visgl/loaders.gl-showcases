import type { BuildingSceneSublayer, StatsInfo } from "@loaders.gl/i3s/src/types";
import type { OrientedBoundingBox, BoundingSphere } from "@math.gl/culling";
import type { DefaultTheme } from "styled-components";
import type { Vector3, Matrix4 } from "@math.gl/core";
import type { ViewState } from "@deck.gl/core";
import type { Stats } from "@probe.gl/stats";

export enum Theme {
  Dark,
  Light,
}

export enum SliderType {
  Floors,
  Phase,
  Bookmarks,
}

export enum Layout {
  Desktop = "desktop",
  Tablet = "tablet",
  Mobile = "mobile",
}

export enum CompareButtonMode {
  Start = "Start comparing",
  Comparing = "Stop comparing",
}

export enum ComparisonMode {
  acrossLayers,
  withinLayer,
}

export enum ListItemType {
  Radio,
  Checkbox,
}

export enum ActiveButton {
  options,
  settings,
  memory,
  bookmarks,
  debug,
  validator,
  none,
}

export enum BoundingVolumeType {
  mbs = "MBS",
  obb = "OBB",
}

export enum ActionButtonVariant {
  primary,
  secondary,
  cancel,
}

export enum ExpandState {
  expanded = "expanded",
  collapsed = "collapsed",
}

export enum CollapseDirection {
  top,
  bottom,
  left,
  right,
}

export enum DragMode {
  pan = "pan",
  rotate = "rotate",
}

export enum HelpPanelSelectedTab {
  Touch = "Touch",
  Trackpad = "Trackpad",
  Mouse = "Mouse",
}

export enum ComparisonSideMode {
  left = "left",
  right = "right",
}

export enum ArrowDirection {
  left = "left",
  right = "right",
}

export enum TilesetType {
  I3S = "I3S",
  Tiles3D = "3DTiles",
  CesiumIon = "CesiumIon",
}

export enum ButtonSize {
  Small,
  Big,
}

export enum ValidatedDataType {
  Warning = "warning",
  Ok = "ok",
}

export interface ValidatedTile {
  key: string;
  title: string;
}

export interface TileWarning {
  type: string;
  title: string;
  tileId?: string;
}

export interface TileValidationData {
  positions: Float32Array;
  boundingType: string;
  boundingVolume: OrientedBoundingBox | BoundingSphere;
}

export interface ObbData {
  center: number[];
  halfSize: number[];
  quaternion: number[];
}

export interface GeometryVSTextureMetrics {
  triangles: number;
  geometryNullTriangleCount: number;
  geometrySmallTriangleCount: number;
  texCoordNullTriangleCount: number;
  texCoordSmallTriangleCount: number;
  minGeometryArea: number;
  minTexCoordArea: number;
  pixelArea: number;
}

export interface LayoutProperties {
  desktop: string | number;
  tablet: string | number;
  mobile: string | number;
}

export interface AppThemes {
  [Theme.Dark]: DefaultTheme;
  [Theme.Light]: DefaultTheme;
}

/** I3S Layer, I3S WebScene or 3DTiles Tileset */
export interface LayerExample {
  /** Layer's unique id */
  id: string;
  /** Layer's human readable name */
  name: string;
  /** Layer's URL */
  url: string;
  /** Layers's authorization token */
  token?: string;
  /** Is layer custom (added by user during application usage)
   * true - layer has been added by user with "Insert layer" or "Insert scene"
   * false - layer is part of preset examples (`src/constants/i3s-examples.ts`)
   */
  custom?: boolean;
  /** Child layers. Used for webscene dataset */
  layers?: LayerExample[];
  /** Initial viewState of the layer */
  viewState?: LayerViewState;
  /** Type of the tileset (I3S/3DTiles) */
  type?: TilesetType;
  /** Information about where layer was taken from */
  mapInfo?: string;
}

export interface LayerViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

export interface Sublayer extends BuildingSceneSublayer {
  expanded: boolean;
  childNodesCount: number;
  sublayers: Sublayer[];
}

export enum BaseMapGroup {
  Maplibre = "Maplibre",
  ArcGIS = "ArcGIS",
  Terrain = "Terrain",
}

export interface BaseMap {
  id: string;
  name: string;
  mapUrl: string;
  token?: string;
  custom?: boolean;
  group: BaseMapGroup;
  icon?: string;
};

export interface PositionsData {
  src: {
    positions: Float32Array;
    normals: Float32Array;
  };
}

export interface NormalsDebugData extends PositionsData {
  length: number;
  modelMatrix: Matrix4;
  cartographicModelMatrix: Matrix4;
  cartographicOrigin: Vector3;
}

export interface ViewStateSet {
  main?: ViewState;
  minimap?: ViewState;
}

export interface HelpShortcutItem {
  id: string;
  icon: JSX.Element | null;
  title: string;
  text: string;
  video: string;
}

export interface HelpShortcutsData {
  [HelpPanelSelectedTab.Mouse]: HelpShortcutItem[];
  [HelpPanelSelectedTab.Trackpad]: HelpShortcutItem[];
  [HelpPanelSelectedTab.Touch]: HelpShortcutItem[];
}

export interface ContentFormats {
  draco: boolean;
  meshopt: boolean;
  dds: boolean;
  ktx2: boolean;
}

export interface StatsMap {
  url: string;
  tilesetStats: Stats;
  memoryStats: Stats | null;
  contentFormats: ContentFormats;
  isCompressedGeometry: boolean;
  isCompressedTextures: boolean;
}

export type FeatureAttributes = Record<string, string>;

export type StatisticsMap = Record<string, StatsInfo>;

export type COLOR = [number, number, number, number];

export interface ColorsByAttribute {
  attributeName: string;
  minValue: number;
  maxValue: number;
  minColor: COLOR;
  maxColor: COLOR;
  mode: string;
}

export interface FiltersByAttribute {
  attributeName: string;
  value: number;
}

export interface LoadOptions {
  i3s: {
    coordinateSystem: number;
    useDracoGeometry: boolean;
    useCompressedTextures: boolean;
    token?: string;
    colorsByAttribute?: ColorsByAttribute | null;
  };
}

export interface Bookmark {
  id: string;
  pageId: PageId;
  imageUrl: string;
  viewState: ViewStateSet;
  debugOptions?: DebugOptions;
  layersLeftSide: LayerExample[];
  activeLayersIdsLeftSide: string[];
  layersRightSide: LayerExample[];
  activeLayersIdsRightSide: string[];
}

export enum PageId {
  viewer = "Viewer",
  debug = "Debug",
  comparison = "Comparison",
}

export enum SelectionState {
  selected,
  unselected,
  indeterminate,
}

type Dataset = StatsMap & {
  elapsedTime: number;
};

export interface StatsData {
  viewState: ViewStateSet;
  datasets: Dataset[];
}

export interface LayoutProps {
  $layout?: string;
}

export type BuildingSceneSublayerExtended = BuildingSceneSublayer & {
  token?: string;
  type?: TilesetType;
};

export enum TileColoredBy {
  original = "Original",
  random = "Random by tile",
  depth = "By depth",
  custom = "User selected",
}

export enum BoundingVolumeColoredBy {
  original = "Original",
  tile = "By tile",
}

export interface DebugOptions {
  minimap: boolean;
  minimapViewport: boolean;
  boundingVolume: boolean;
  tileColorMode: TileColoredBy;
  boundingVolumeColorMode: BoundingVolumeColoredBy;
  boundingVolumeType: BoundingVolumeType;
  pickable: boolean;
  loadTiles: boolean;
  showUVDebugTexture: boolean;
  wireframe: boolean;
}

export interface TileInfo {
  title: string;
  value: any;
}

export interface MinimapPosition {
  x: string;
  y: string;
}

export interface TileSelectedColor {
  r: number;
  g: number;
  b: number;
}

export interface TilesetMetadata {
  id: string;
  url: string;
  token?: string;
  hasChildren: boolean;
  type?: TilesetType;
}

export interface IArcGisContent {
  id: string;
  url: string;
  name: string;
  title: string;
  token?: string;
  created: number;
  createdFormatted: string;
}

export type ArcGisContentColumnName = keyof IArcGisContent;

export enum FetchingStatus {
  pending = "pending",
  ready = "ready",
}

export enum IconListSetName {
  uvDebugTexture = "uvDebugTexture",
  baseMap = "baseMap",
}

export interface IIconItem {
  /** Unique id of the item */
  id: string;
  /** Icon image that can be a URL or a blob converted to a object URL */
  icon: string;
  /** Name of a group like "Maplibre", "ArcGIS".
   * The icon-list-panel can use it to group icon items into separate panels
   */
  group?: string;
  /** Name (title) of the icon */
  name?: string;
  /** Predefined or custom (loaded by a user) icon. */
  custom?: boolean;
  /** Additional data linked with the icon like a texture, basemap */
  extData?: Record<string, string | number | ArrayBuffer>;
}

export enum FileType {
  binary = "binary",
  text = "text",
}

export interface FileUploaded {
  fileContent: string | ArrayBuffer;
  info: Record<string, unknown>;
}
