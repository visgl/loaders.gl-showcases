import {
  selectDebugTextureForTileset,
  selectOriginalTextureForTileset,
  selectDebugTextureForTile,
  selectOriginalTextureForTile,
} from "./texture-selector-utils";
import type { Tile3D, Tileset3D } from "@loaders.gl/tiles";

const mockDrawImage = jest.fn();

Object.defineProperty(window, "createImageBitmap", {
  writable: true,
  value: jest.fn().mockImplementation(() => ({})),
});

Object.defineProperty(window, "ImageBitmap", {
  writable: true,
  value: jest.fn().mockImplementation((name, width, height) => ({
    name,
    width,
    height,
  })),
});

class MyImageBitmap extends ImageBitmap {
  name: string;
  width: number;
  height: number;
  constructor(name: string, width: number, height: number) {
    super();
    this.name = name;
    this.width = width;
    this.height = height;
  }
}

const contentTexture: ImageBitmap = new MyImageBitmap("c", 0, 0);
const uvDebugTexture: ImageBitmap = new MyImageBitmap("uv", 0, 0);

describe("Crop texture", () => {
  beforeAll(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      drawImage: mockDrawImage,
    });
  });

  test("Should crop texture", async () => {
    const contentTexture: ImageBitmap = new MyImageBitmap("c", 1, 1);
    const uvDebugTexture: ImageBitmap = new MyImageBitmap("uv", 2, 2);

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
                  image: contentTexture,
                },
              },
            },
          },
          texture: uvDebugTexture,
        },
      },
    };
    await selectDebugTextureForTile(tile as unknown as Tile3D, uvDebugTexture);
    expect(mockDrawImage).toBeCalledTimes(1);
  });
});

describe("Texture Selector Utils - selectDebugTextureForTileset", () => {
  test("Should return undefined if no uvDebugTexture", async () => {
    const tileset: Tileset3D = {} as unknown as Tileset3D;
    const uvDebugTexture = null;
    await selectDebugTextureForTileset(tileset, uvDebugTexture);
    expect(tileset).toEqual({});
  });

  test("Should return undefined if no uvDebugTexture", async () => {
    const tileset = { tiles: [{ userData: {} }] };
    await selectDebugTextureForTileset(
      tileset as unknown as Tileset3D,
      uvDebugTexture
    );
    expect(tileset).toEqual({ tiles: [{ userData: {} }] });
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
    await selectDebugTextureForTile(tile as unknown as Tile3D, uvDebugTexture);
    expect(tile).toEqual({ userData: {} });
  });

  test("Should return undefined if originalTexture exists", async () => {
    const tile = { userData: { originalTexture: "Test texture" } };
    await selectDebugTextureForTile(tile as unknown as Tile3D, uvDebugTexture);
    expect(tile).toEqual({
      userData: {
        originalTexture: "Test texture",
      },
    });
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
    await selectDebugTextureForTile(tile as unknown as Tile3D, uvDebugTexture);
    expect(tile).toEqual({
      content: {
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: null,
          },
        },
      },
      userData: {},
    });
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
                  image: contentTexture,
                },
              },
            },
          },
          texture: uvDebugTexture,
        },
      },
    };
    await selectDebugTextureForTile(tile as unknown as Tile3D, uvDebugTexture);
    expect(tile.userData.originalTexture).toStrictEqual(contentTexture);
    expect(
      tile.content.material.pbrMetallicRoughness.baseColorTexture.texture.source
        .image
    ).toStrictEqual(uvDebugTexture);
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
                    image: contentTexture,
                  },
                },
              },
            },
            texture: uvDebugTexture,
          },
        },
      },
      content: {
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: {
              texture: {
                source: {
                  image: contentTexture,
                },
              },
            },
          },
          texture: uvDebugTexture,
        },
      },
    };
    await selectDebugTextureForTile(tile as unknown as Tile3D, uvDebugTexture);
    expect(
      tile.userData.originalTexture.material.pbrMetallicRoughness
        .baseColorTexture.texture.source.image
    ).toStrictEqual(contentTexture);
    expect(
      tile.content.material.pbrMetallicRoughness.baseColorTexture.texture.source
        .image
    ).toStrictEqual(uvDebugTexture);
  });

  test("Should add original texture to userData and apply debug texture if no material", async () => {
    const tile = {
      userData: {
        originalTexture: null,
      },
      content: {
        material: null,
        texture: contentTexture,
      },
    };
    await selectDebugTextureForTile(tile as unknown as Tile3D, uvDebugTexture);
    expect(tile.userData.originalTexture).toStrictEqual(contentTexture);
    expect(tile.content.texture).toStrictEqual(uvDebugTexture);
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
    selectOriginalTextureForTile(tile as unknown as Tile3D);
    expect(tile).toEqual({
      content: {
        material: null,
        texture: "Test texture",
      },
      userData: {
        originalTexture: null,
      },
    });
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
    selectOriginalTextureForTile(tile as unknown as Tile3D);
    expect(tile).toEqual({
      content: {
        material: {
          pbrMetallicRoughness: {
            baseColorTexture: null,
          },
          texture: "Content material texture",
        },
        texture: "Test texture",
      },
      userData: {
        originalTexture: "Original Texture",
      },
    });
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
    selectOriginalTextureForTile(tile as unknown as Tile3D);
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
    selectOriginalTextureForTile(tile as unknown as Tile3D);
    expect(tile.content.texture).toStrictEqual("Original Texture");
    expect(tile.userData.originalTexture).toBeUndefined();
  });
});
