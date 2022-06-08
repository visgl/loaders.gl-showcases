import type { OrientedBoundingBox, BoundingSphere } from "@math.gl/culling";
import { WebMercatorViewport } from "react-map-gl";

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
  cancel
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

type AppTheme = {
  name: Theme;
  colors: { [name: string]: string };
};

export type AppThemes = {
  [Theme.Dark]: AppTheme;
  [Theme.Light]: AppTheme;
};

export type LayerExample = {
  id?: string;
  name: string;
  url: string;
  token?: string;
  vieport?: WebMercatorViewport
}
