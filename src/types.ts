import { BuildingSceneSublayer } from "@loaders.gl/i3s/dist/types";
import type { OrientedBoundingBox, BoundingSphere } from "@math.gl/culling";
import { DefaultTheme } from "styled-components";
import { Vector3, Matrix4 } from "@math.gl/core";

export enum Theme {
  Dark,
  Light,
}

export enum Layout {
  Desktop = "desktop",
  Tablet = "tablet",
  Mobile = "mobile",
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

export enum MapControlMode {
  pan,
  rotate,
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

export type LayerExample = {
  id: string;
  name: string;
  url: string;
  token?: string;
  custom?: boolean;
};

export type Sublayer = BuildingSceneSublayer & {
  expanded: boolean;
  childNodesCount: number;
  sublayers: Sublayer[];
};
export type BaseMap = {
  id: string;
  name: string;
  mapUrl: string | null;
  iconUrl: string;
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
