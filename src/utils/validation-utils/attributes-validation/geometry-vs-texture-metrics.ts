import type { Tile3D } from "@loaders.gl/tiles";
import type { GeometryVSTextureMetrics } from '../../types';

import { getTriangleVertices, getTriangleArea } from "./triangles-calculation";

/**
 * Generates geometry vs texture metrics
 * @param tile
 */
export const getGeometryVsTextureMetrics = (tile: Tile3D): GeometryVSTextureMetrics | null => {
  if (!(tile && tile.content && tile.content.attributes)) {
    return null;
  }
  const attributes = tile.content.attributes;
  const { positions, texCoords } = attributes;
  if (!(positions && texCoords)) {
    return null;
  }

  const textureSize = getTextureSize(tile);
  if (!textureSize) {
    return null;
  }
  const pixelArea = 1 / textureSize;
  let minGeometryArea = Number.MAX_VALUE;
  let minTexCoordArea = Number.MAX_VALUE;
  let geometryNullTriangleCount = 0;
  let texCoordNullTriangleCount = 0;
  let geometrySmallTriangleCount = 0;
  let texCoordSmallTriangleCount = 0;
  const vertexCount = positions.value.length / positions.size;
  for (let i = 0; i < vertexCount; i += 3) {
    const geometryVertices = getTriangleVertices(positions, i);
    const texCoordVertices = getTriangleVertices(texCoords, i);
    const geometryArea = getTriangleArea(geometryVertices);
    const texCoordArea = getTriangleArea(texCoordVertices);

    if (geometryArea === 0) {
      geometryNullTriangleCount++;
    } else {
      minGeometryArea = Math.min(minGeometryArea, geometryArea);
    }
    if (texCoordArea === 0) {
      texCoordNullTriangleCount++;
    } else {
      minTexCoordArea = Math.min(minTexCoordArea, texCoordArea);
    }
    if (geometryArea < 0.001) {
      geometrySmallTriangleCount++;
    }
    if (texCoordArea < pixelArea) {
      texCoordSmallTriangleCount++;
    }
  }
  return {
    triangles: vertexCount / 3,
    geometryNullTriangleCount,
    geometrySmallTriangleCount,
    texCoordNullTriangleCount,
    texCoordSmallTriangleCount,
    minGeometryArea,
    minTexCoordArea,
    pixelArea,
  };
};

/**
 * Calculate texture size of tile
 * @param {object} tile
 */
const getTextureSize = (tile: Tile3D): number => {
  const texture =
    (tile.content.material &&
      tile.content.material.pbrMetallicRoughness &&
      tile.content.material.pbrMetallicRoughness.baseColorTexture &&
      tile.content.material.pbrMetallicRoughness.baseColorTexture.texture.source
        .image) ||
    tile.content.texture ||
    null;

  if (!texture) {
    return 0;
  }
  return texture.height * texture.width;
};
