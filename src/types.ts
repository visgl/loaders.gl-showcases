import { BuildingSceneSublayer, StatsInfo } from "@loaders.gl/i3s/dist/types";
import type { OrientedBoundingBox, BoundingSphere } from "@math.gl/culling";
import { DefaultTheme } from "styled-components";
import { Vector3, Matrix4 } from "@math.gl/core";
import { ViewState } from "@deck.gl/core";
import { Stats } from "@probe.gl/stats";

export enum Theme {
  Dark,
  Light,
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
  none,
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

export type TileWarning = {
  type: string;
  title: string;
  tileId?: string;
};

export type TileValidationData = {
  positions: Float32Array;
  boundingType: string;
  boundingVolume: OrientedBoundingBox | BoundingSphere;
};

export type ObbData = {
  center: number[];
  halfSize: number[];
  quaternion: number[];
};

export type GeometryVSTextureMetrics = {
  triangles: number;
  geometryNullTriangleCount: number;
  geometrySmallTriangleCount: number;
  texCoordNullTriangleCount: number;
  texCoordSmallTriangleCount: number;
  minGeometryArea: number;
  minTexCoordArea: number;
  pixelArea: number;
};

export type LayoutProperties = {
  desktop: string | number;
  tablet: string | number;
  mobile: string | number;
};

export type AppThemes = {
  [Theme.Dark]: DefaultTheme;
  [Theme.Light]: DefaultTheme;
};

/** I3S Layer, I3S WebScene or 3DTiles Tileset */
export type LayerExample = {
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
};

export type LayerViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
};

export interface Sublayer extends BuildingSceneSublayer {
  expanded: boolean;
  childNodesCount: number;
  sublayers: Sublayer[];
}

export type BaseMap = {
  id: string;
  name: string;
  mapUrl: string;
  token?: string;
  custom?: boolean;
};

export type NormalsDebugData = {
  src: {
    normals: Uint32Array;
    positions: Uint32Array;
  };
  length: number;
  modelMatrix: Matrix4;
  cartographicModelMatrix: Matrix4;
  cartographicOrigin: Vector3;
};

export type ViewStateSet = {
  main?: ViewState;
  minimap?: ViewState;
};

export type HelpShortcutItem = {
  id: string;
  icon: JSX.Element | null;
  title: string;
  text: string;
  video: string;
};

export type HelpShortcutsData = {
  [HelpPanelSelectedTab.Mouse]: HelpShortcutItem[];
  [HelpPanelSelectedTab.Trackpad]: HelpShortcutItem[];
  [HelpPanelSelectedTab.Touch]: HelpShortcutItem[];
};

export type ContentFormats = {
  draco: boolean;
  meshopt: boolean;
  dds: boolean;
  ktx2: boolean;
};

export type StatsMap = {
  url: string;
  tilesetStats: Stats;
  memoryStats: Stats | null;
  contentFormats: ContentFormats;
  isCompressedGeometry: boolean;
  isCompressedTextures: boolean;
};

export type FeatureAttributes = {
  [key: string]: string;
};

export type StatisticsMap = {
  [key: string]: StatsInfo;
};

export type COLOR = [number, number, number, number];

export type ColorsByAttribute = {
  attributeName: string;
  minValue: number;
  maxValue: number;
  minColor: COLOR;
  maxColor: COLOR;
};

export type LoadOptions = {
  i3s: {
    coordinateSystem: number;
    useDracoGeometry: boolean;
    useCompressedTextures: boolean;
    token?: string;
    colorsByAttribute?: ColorsByAttribute | null;
  };
};

export type Bookmark = {
  id: string;
  imageUrl: string;
  viewState: ViewStateSet;
  layersLeftSide: LayerExample[];
  activeLayersIdsLeftSide: string[];
  layersRightSide: LayerExample[];
  activeLayersIdsRightSide: string[];
};

export enum SelectionState {
  selected,
  unselected,
  indeterminate,
}

type Dataset = StatsMap & {
  ellapsedTime: number;
};

export type StatsData = {
  viewState: ViewStateSet;
  datasets: Dataset[];
};

export type LayoutProps = {
  layout: string;
};

export type BuildingSceneSublayerExtended = BuildingSceneSublayer & {
  token?: string;
  type?: TilesetType;
};
