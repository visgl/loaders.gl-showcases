import type { Tile3D } from "@loaders.gl/tiles";
import type { MeshAttribute } from '@loaders.gl/schema';
import type { GeometryVSTextureMetrics } from './types';
import { Vector3 } from "@math.gl/core";

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
 * Calculate triangle vertices of tile
 * @param {object} attribute
 * @param offset
 */
const getTriangleVertices = (attribute: MeshAttribute, offset: number): Vector3[] => {
  const geometryVertices: Vector3[] = [];
  for (let i = 0; i < 3; i++) {
    // @ts-expect-error - This expression is not constructable. Type 'Function' has no construct signatures.
    const typedArray = new attribute.value.constructor(3);
    const subarray = attribute.value.subarray(
      (offset + i) * attribute.size,
      (offset + i) * attribute.size + attribute.size
    );
    typedArray.set(subarray);

    geometryVertices.push(new Vector3(typedArray));
  }
  return geometryVertices;
};

/**
 * Calculates triangles area based on vertices
 * @param vertices
 */
const getTriangleArea = (vertices: Vector3[]): number => {
  const edge1 = new Vector3(
    vertices[0].x,
    vertices[0].y,
    vertices[0].z
  ).subtract(vertices[1]);
  const edge2 = new Vector3(
    vertices[1].x,
    vertices[1].y,
    vertices[1].z
  ).subtract(vertices[2]);
  const angle = edge1.angle(edge2);
  const area = 0.5 * edge1.magnitude() * edge2.magnitude() * Math.sin(angle);

  return area;
};

/**
 * Calculate texture size of tile
 * @param {object} tile
 */
const getTextureSize = (tile: Tile3D): number => {
  if (!tile.content) {
    return 0;
  }
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
