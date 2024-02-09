import {
  selectDebugTextureForTileset,
  selectOriginalTextureForTileset,
  selectDebugTextureForTile,
  selectOriginalTextureForTile,
} from "./texture-selector-utils";

describe("Texture Selector Utils - selectDebugTextureForTileset", () => {
  test("Should return undefined if no uvDebugTexture", async () => {
    const tileset = {};
    const uvDebugTexture = null;
    const result = await selectDebugTextureForTileset(tileset, uvDebugTexture);
    expect(result).toBeUndefined();
  });

  test("Should return undefined if no uvDebugTexture", async () => {
    const tileset = { tiles: [{ userData: {} }] };
    const uvDebugTexture = "Test texture";
    await selectDebugTextureForTileset(tileset, uvDebugTexture);
  });
});

describe("Texture Selector Utils - selectOriginalTextureForTileset", () => {
  test("Should be able to call function", () => {
    selectOriginalTextureForTileset();
  });
});

describe("Texture Selector Utils - selectDebugTextureForTile", () => {
  test("Should return undefined if no uvDebugTexture", async () => {
    const tile = { userData: {} };
    const uvDebugTexture = null;
    const result = await selectDebugTextureForTile(tile, uvDebugTexture);
    expect(result).toBeUndefined();
  });

  test("Should return undefined if originalTexture exists", async () => {
    const tile = { userData: { originalTexture: "Test texture" } };
    const uvDebugTexture = "Test texture";
    const result = await selectDebugTextureForTile(tile, uvDebugTexture);
    expect(result).toBeUndefined();
  });

  test("Should return undefined if material exists but baseColorTexture is not", async () => {
    const tile = {
      userData: {},
      content: {
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: null,
          },
        },
      },
    };
    const uvDebugTexture = "Test texture";
    const result = await selectDebugTextureForTile(tile, uvDebugTexture);
    expect(result).toBeUndefined();
  });

  test("Should add original texture to userData and apply debug texture", async () => {
    const tile = {
      userData: {
        originalTexture: null,
      },
      content: {
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: {
              texture: {
                source: {
                  image: "Testing Image",
                },
              },
            },
          },
          texture: "Test texture",
        },
      },
    };
    const uvDebugTexture = "Test texture";
    await selectDebugTextureForTile(tile, uvDebugTexture);
    expect(tile.userData.originalTexture).toStrictEqual("Testing Image");
    expect(
      tile.content.material.pbrMetallicRoughness.baseColorTexture.texture.source
        .image
    ).toStrictEqual("Test texture");
  });

  test("Should skip adding original texture to userData if already exist and apply debug texture", async () => {
    const tile = {
      userData: {
        originalTexture: {
          material: {
            pbrMetallicRoughness: {
              baseColorTexture: {
                texture: {
                  source: {
                    image: "Testing Image",
                  },
                },
              },
            },
            texture: "Test texture",
          },
        },
      },
      content: {
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: {
              texture: {
                source: {
                  image: "Testing Image",
                },
              },
            },
          },
          texture: "Test texture",
        },
      },
    };
    const uvDebugTexture = "Test texture";
    await selectDebugTextureForTile(tile, uvDebugTexture);
    expect(
      tile.userData.originalTexture.material.pbrMetallicRoughness
        .baseColorTexture.texture.source.image
    ).toStrictEqual("Testing Image");
    expect(
      tile.content.material.pbrMetallicRoughness.baseColorTexture.texture.source
        .image
    ).toStrictEqual("Test texture");
  });

  test("Should add original texture to userData and apply debug texture if no material", async () => {
    const tile = {
      userData: {
        originalTexture: null,
      },
      content: {
        material: null,
        texture: "Test texture",
      },
    };
    const uvDebugTexture = "uvDebugTexture";
    await selectDebugTextureForTile(tile, uvDebugTexture);
    expect(tile.userData.originalTexture).toStrictEqual("Test texture");
    expect(tile.content.texture).toStrictEqual("uvDebugTexture");
  });
});

describe("Texture Selector Utils - selectOriginalTextureForTile", () => {
  test("Should return undefined if no original texture", () => {
    const tile = {
      userData: {
        originalTexture: null,
      },
      content: {
        material: null,
        texture: "Test texture",
      },
    };
    const result = selectOriginalTextureForTile(tile);
    expect(result).toBeUndefined();
  });

  test("Should return undefined if tile has material but it doesn't have baseColorTexture", () => {
    const tile = {
      userData: {
        originalTexture: "Original Texture",
      },
      content: {
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: null,
          },
          texture: "Content material texture",
        },
        texture: "Test texture",
      },
    };
    const result = selectOriginalTextureForTile(tile);
    expect(result).toBeUndefined();
  });

  test("Should add original texture to baseColorTexture and replace content material with material object", () => {
    const tile = {
      userData: {
        originalTexture: "Original Texture",
      },
      content: {
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: {
              texture: {
                source: {
                  image: "Testing Image",
                },
              },
            },
          },
          texture: null,
        },
      },
    };
    selectOriginalTextureForTile(tile);
    expect(
      tile.content.material.pbrMetallicRoughness.baseColorTexture.texture.source
        .image
    ).toStrictEqual("Original Texture");
    expect(tile.userData.originalTexture).toBeUndefined();
  });

  test("Should add original texture to baseColorTexture and replace content material with material object", () => {
    const tile = {
      userData: {
        originalTexture: "Original Texture",
      },
      content: {
        material: null,
        texture: "Test texture",
      },
    };
    selectOriginalTextureForTile(tile);
    expect(tile.content.texture).toStrictEqual("Original Texture");
    expect(tile.userData.originalTexture).toBeUndefined();
  });
});
