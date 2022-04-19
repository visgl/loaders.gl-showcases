import { parseTileset, parseTilesetUrlParams } from "./url-utils";

const mockResponse = jest.fn();
Object.defineProperty(window, "location", {
  value: {
    hash: {
      endsWith: mockResponse,
      includes: mockResponse,
    },
    assign: mockResponse,
    href: "https://test.com?tileset=https://tileset-url.com",
  },
  writable: true,
});

describe('Url Utils - parseTilesetUrlFromUrl', () => {
  test("Should parse tileset url", () => {
    const result = parseTileset();
    expect(result).toStrictEqual("https://tileset-url.com");
  });
});

describe('Url Utils - parseTilesetUrlParams', () => {
  test("Should parse tileset params", () => {
    const url = 'https://tileset-url.com/layers/0';
    const options = null
    const result = parseTilesetUrlParams(url, options);
    expect(result).toStrictEqual({
      metadataUrl: "https://tileset-url.com",
      tilesetUrl: "https://tileset-url.com/layers/0",
      token: null
    });
  });

  test("Should parse tileset params with token in options", () => {
    const url = 'https://tileset-url.com/layers/0';
    const options = {
      token: 'test_token'
    }
    const result = parseTilesetUrlParams(url, options);
    expect(result).toStrictEqual({
      metadataUrl: "https://tileset-url.com",
      tilesetUrl: "https://tileset-url.com/layers/0",
      token: 'test_token'
    });
  });

  test("Should parse tileset params with token in options and search", () => {
    const url = 'https://tileset-url.com/layers/0?token=test_token';
    const options = {}
    const result = parseTilesetUrlParams(url, options);
    expect(result).toStrictEqual({
      metadataUrl: "https://tileset-url.com?token=test_token",
      tilesetUrl: "https://tileset-url.com/layers/0?token=test_token",
      token: 'test_token'
    });
  });

  test("Should replace tileset url with layers/0", () => {
    const url = 'https://tileset-url.com';
    const options = null;
    const result = parseTilesetUrlParams(url, options);
    expect(result).toStrictEqual({
      metadataUrl: "https://tileset-url.com",
      tilesetUrl: "https://tileset-url.com/layers/0",
      token: null
    });
  });
});
