import type { OrientedBoundingBox, BoundingSphere } from "@math.gl/culling";

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

export type Layout = {
  isDesktopOrLaptop: boolean,
  isTablet: boolean,
  isMobile: boolean
};

export type LayoutProperties = {
  isDesktopOrLaptop: string | number,
  isTablet: string | number,
  isMobile: string | number,
};
