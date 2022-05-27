import type { OrientedBoundingBox, BoundingSphere } from "@math.gl/culling";
import { Theme } from "./enums";

export type TileWarning = {
  type: string;
  title: string;
  tileId?: string;
};

export type TileValidationData = {
  positions: Float32Array,
  boundingType: string,
  boundingVolume: OrientedBoundingBox | BoundingSphere
};

export type ObbData = {
  center: number[],
  halfSize: number[]
  quaternion: number[]
};

export type GeometryVSTextureMetrics = {
  triangles: number;
  geometryNullTriangleCount: number,
  geometrySmallTriangleCount: number,
  texCoordNullTriangleCount: number,
  texCoordSmallTriangleCount: number,
  minGeometryArea: number,
  minTexCoordArea: number,
  pixelArea: number,
};

export type LayoutProperties = {
  default: string | number;
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
