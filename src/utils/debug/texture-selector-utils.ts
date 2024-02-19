import type { Tile3D, Tileset3D } from "@loaders.gl/tiles";

// TODO Need to separate multiple export functions from file and split logic for better testing

// The tiles list in the tileset mutates continually.
// We need to store tiles when we replace texture
const tiles: Record<string, Tile3D> = {};

/**
 * Replaces original textures in the tileset with uvDebug texture
 * @param tileset Tileset where textures should be replaced
 * @param uvDebugTexture uvDebug texture
 */
export async function selectDebugTextureForTileset(
  tileset: Tileset3D,
  uvDebugTexture: ImageBitmap | null
) {
  if (!uvDebugTexture) {
    return;
  }
  for (const tile of tileset.tiles) {
    await selectDebugTextureForTile(tile as Tile3D, uvDebugTexture);
  }
  for (const tileId in tiles) {
    await selectDebugTextureForTile(tiles[tileId], uvDebugTexture);
  }
}

export function selectOriginalTextureForTileset() {
  for (const tileId in tiles) {
    selectOriginalTextureForTile(tiles[tileId]);
  }
}

/**
 * Crops the texture with the specified width and height
 * @param texture - Texture to crop
 * @param width - width of the cropped texture
 * @param height - height of the cropped texture
 * @returns cropped texture
 */
const cropTexture = async (
  texture: ImageBitmap,
  width: number,
  height: number
) => {
  if (!width || !height) {
    return texture;
  }
  const bitmap = await createImageBitmap(texture);

  const coeffWidth = texture.width / width;
  const coeffHeight = texture.height / height;
  const coeff = coeffWidth < coeffHeight ? coeffWidth : coeffHeight;
  const sw = width * coeff;
  const sh = height * coeff;

  const canvas = document.createElement("canvas");
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }

  ctx.drawImage(bitmap, 0, 0, sw, sh);
  return canvas;
};

/**
 * Replaces original textures in the tile with uvDebug texture
 * @param tile - Tile where textures should be replaced
 * @param uvDebugTexture uvDebug texture
 */
export async function selectDebugTextureForTile(
  tile: Tile3D,
  uvDebugTexture: ImageBitmap | null
) {
  tiles[tile.id] = tile;
  if (!uvDebugTexture) {
    return;
  }
  const { texture, material } = tile.content || {};
  if (material) {
    if (
      !(
        material.pbrMetallicRoughness &&
        material.pbrMetallicRoughness.baseColorTexture
      )
    ) {
      return;
    }
    if (!tile.userData.originalTexture) {
      tile.userData.originalTexture =
        material.pbrMetallicRoughness.baseColorTexture.texture.source.image;
    }
    const width = tile.userData.originalTexture.width;
    const height = tile.userData.originalTexture.height;
    const uvDebugTextureCropped = await cropTexture(
      uvDebugTexture,
      width,
      height
    );
    material.pbrMetallicRoughness.baseColorTexture.texture.source.image =
      uvDebugTextureCropped;
    tile.content.material = { ...tile.content.material };
  } else if (texture) {
    if (!tile.userData.originalTexture) {
      tile.userData.originalTexture = texture;
    }

    const width = texture.width;
    const height = texture.height;
    const uvDebugTextureCropped = await cropTexture(
      uvDebugTexture,
      width,
      height
    );
    tile.content.texture = uvDebugTextureCropped;
  }
}

/**
 * Replaces uvDebug texture in the tile back with original ones
 * @param tile - Tile where textures should be replaced
 */
export function selectOriginalTextureForTile(tile: Tile3D) {
  tiles[tile.id] = tile;
  const {
    content,
    userData: { originalTexture },
  } = tile;
  const { texture, material } = content || {};
  if (!originalTexture) {
    return;
  }
  if (material) {
    if (
      !(
        material.pbrMetallicRoughness &&
        material.pbrMetallicRoughness.baseColorTexture
      )
    ) {
      return;
    }
    material.pbrMetallicRoughness.baseColorTexture.texture.source.image =
      originalTexture;
    tile.content.material = { ...tile.content.material };
  } else if (texture) {
    tile.content.texture = originalTexture;
  }
  delete tile.userData.originalTexture;
}
