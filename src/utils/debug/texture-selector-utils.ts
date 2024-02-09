// TODO Need to separate multiple export functions from file and split logic for better testing

// The tiles list in the tileset mutates continually.
// We need to store tiles when we replace texture
const tiles = {};

export async function selectDebugTextureForTileset(tileset, uvDebugTexture) {
  if (!uvDebugTexture) {
    return;
  }
  for (const tile of tileset.tiles) {
    await selectDebugTextureForTile(tile, uvDebugTexture);
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

const cropTexture = async (texture, width, height) => {
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

export async function selectDebugTextureForTile(tile, uvDebugTexture) {
  tiles[tile.id] = tile;
  if (!uvDebugTexture) {
    return;
  }
  const { texture, material } = tile.content || {};
  if (material) {
    if (
      !(
        material &&
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
    const width =
      material.pbrMetallicRoughness.baseColorTexture.texture.source.image.width;
    const height =
      material.pbrMetallicRoughness.baseColorTexture.texture.source.image
        .height;
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

export function selectOriginalTextureForTile(tile) {
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
        material &&
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
