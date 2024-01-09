import { TilesetType } from "../types";
import {
  getTilesetType,
  parseTilesetFromUrl,
  parseTilesetUrlParams,
  urlParamsToViewState,
  viewStateToUrlParams,
  convertUrlToRestFormat,
} from "./url-utils";

const mockResponse = jest.fn();

describe("Url Utils - parseTilesetUrlFromUrl", () => {
  test("Should parse tileset url", () => {
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
    const result = parseTilesetFromUrl();
    expect(result).toStrictEqual("https://tileset-url.com");
  });

  test("Should parse url without tileset", () => {
    Object.defineProperty(window, "location", {
      value: {
        hash: {
          endsWith: mockResponse,
          includes: mockResponse,
        },
        assign: mockResponse,
        href: "https://test.com",
      },
      writable: true,
    });
    const result = parseTilesetFromUrl();
    expect(result).toBe("");
  });
});

describe("Url Utils - parseTilesetUrlParams", () => {
  test("Should parse tileset params", () => {
    const url = "https://tileset-url.com/layers/0";
    const options = null;
    const result = parseTilesetUrlParams(url, options);
    expect(result).toStrictEqual({
      metadataUrl: "https://tileset-url.com",
      tilesetUrl: "https://tileset-url.com/layers/0",
      token: null,
    });
  });

  test("Should parse tileset params with token in options", () => {
    const url = "https://tileset-url.com/layers/0";
    const options = {
      token: "test_token",
    };
    const result = parseTilesetUrlParams(url, options);
    expect(result).toStrictEqual({
      metadataUrl: "https://tileset-url.com",
      tilesetUrl: "https://tileset-url.com/layers/0",
      token: "test_token",
    });
  });

  test("Should parse tileset params with token in options and search", () => {
    const url = "https://tileset-url.com/layers/0?token=test_token";
    const options = {};
    const result = parseTilesetUrlParams(url, options);
    expect(result).toStrictEqual({
      metadataUrl: "https://tileset-url.com?token=test_token",
      tilesetUrl: "https://tileset-url.com/layers/0?token=test_token",
      token: "test_token",
    });
  });

  test("Should replace tileset url with layers/0", () => {
    const url = "https://tileset-url.com";
    const options = null;
    const result = parseTilesetUrlParams(url, options);
    expect(result).toStrictEqual({
      metadataUrl: "https://tileset-url.com",
      tilesetUrl: "https://tileset-url.com/layers/0",
      token: null,
    });
  });

  test("Should parse with type 'I3S'", () => {
    const url = "https://tileset-url.com/layers/0";
    const options = { type: TilesetType.I3S };
    const result = parseTilesetUrlParams(url, options);
    expect(result).toEqual({
      metadataUrl: "https://tileset-url.com",
      tilesetUrl: "https://tileset-url.com/layers/0",
      type: TilesetType.I3S,
    });
  });

  test("Should parse with type 'CesiumIon'", () => {
    const url = "https://tileset-url.com/tileset.json";
    const options = { type: TilesetType.CesiumIon };
    const result = parseTilesetUrlParams(url, options);
    expect(result).toEqual({
      metadataUrl: "",
      tilesetUrl: "https://tileset-url.com/tileset.json",
      type: TilesetType.CesiumIon,
    });
  });
});

describe("Url Utils - getTilesetType", () => {
  test("Should get tileset type by url", () => {
    const result = getTilesetType(
      "https://assets.ion.cesium.com/1234556/tileset.json"
    );
    expect(result).toEqual(TilesetType.CesiumIon);
  });

  test("Should return 3DTiles type", () => {
    const result = getTilesetType("https://path.to.the/web/site/data.json");
    expect(result).toEqual(TilesetType.Tiles3D);
  });

  test("Should return I3S type", () => {
    const result = getTilesetType(
      "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0"
    );
    expect(result).toEqual(TilesetType.I3S);

    const resultEmptyUrl = getTilesetType();
    expect(resultEmptyUrl).toEqual(TilesetType.I3S);
  });
});

describe("Url Utils - viewStateToUrlParams", () => {
  test("Should generate updated url search params", () => {
    Object.defineProperty(window, "location", {
      value: {
        search: "tileset=test-tileset-name&token=test-token",
      },
      writable: true,
    });
    const viewState = {
      main: { zoom: 1, longitude: 2, latitude: 3, bearing: 4, pitch: 5 },
    };
    const result = viewStateToUrlParams(viewState);
    expect(result).toEqual({
      ...viewState.main,
      tileset: "test-tileset-name",
      token: "test-token",
    });
  });
});

describe("Url Utils - urlParamsToViewState", () => {
  test("Should generate updated url search params", () => {
    Object.defineProperty(window, "location", {
      value: {
        search:
          "tileset=test-tileset-name&zoom=6&longitude=7&latitude=8&bearing=9&pitch=10",
      },
      writable: true,
    });
    const viewState = {
      main: { zoom: 1, longitude: 2, latitude: 3, bearing: 4, pitch: 5 },
    };
    const result = urlParamsToViewState(viewState);
    expect(result).toEqual({
      zoom: 6,
      longitude: 7,
      latitude: 8,
      bearing: 9,
      pitch: 10,
    });
  });
});

describe("Url Utils - convertUrlToRestFormat", () => {
  test("Should convert to the format required", () => {
    const urlExpected = "https://www.arcgis.com/sharing/rest/content/items/ae34b234d390148/data";

    const urlItem = "https://some.maps.arcgis.com/home/item.html?id=ae34b234d390148";
    const urlViewer = "https://some.maps.arcgis.com/home/webscene/viewer.html?webscene=ae34b234d390148";
    expect(convertUrlToRestFormat(urlItem)).toEqual(urlExpected);
    expect(convertUrlToRestFormat(urlViewer)).toEqual(urlExpected);

    expect(convertUrlToRestFormat(urlExpected)).toEqual(urlExpected);
  });
});
