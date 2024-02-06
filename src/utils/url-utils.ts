import { TilesetType, ViewStateSet } from "../types";

export const parseTilesetFromUrl = () => {
  const parsedUrl = new URL(window.location.href);
  return parsedUrl.searchParams.get("tileset") || "";
};

export const parseTilesetUrlParams = (url, options) => {
  if (!url) {
    return { ...options, tilesetUrl: "", token: "", metadataUrl: "" };
  }

  const parsedUrl = new URL(url);
  let token = options && options.token;
  const tilesetUrl =
    !options?.type || options.type === TilesetType.I3S
      ? prepareTilesetUrl(parsedUrl)
      : url;
  const index = tilesetUrl.lastIndexOf("/layers/0");
  let metadataUrl = tilesetUrl.substring(0, index);

  if (parsedUrl.search) {
    token = parsedUrl.searchParams.get("token");
    metadataUrl = `${metadataUrl}${parsedUrl.search}`;
  }

  return { ...options, tilesetUrl, token, metadataUrl };
};

const CESIUM_URL_PREFIX = "https://assets.ion.cesium.com";
/**
 * Deduce tileset type (I3S/3DTiles/Cesium) from the url
 * @param url tileset url
 * @returns type of the tileset
 */
export const getTilesetType = (url = ""): TilesetType => {
  if (url.includes(CESIUM_URL_PREFIX)) {
    return TilesetType.CesiumIon;
  } else if (url.substring(url.length - 5) === ".json") {
    return TilesetType.Tiles3D;
  } else {
    return TilesetType.I3S;
  }
};

const prepareTilesetUrl = (parsedUrl) => {
  // Try to find particular layer in url.
  const layer = parsedUrl.pathname.match(/layers\/\d/);

  if (layer) {
    // Replace useless last "/" character if it presents.
    return parsedUrl.href.replace(/\/+$/, "");
  }
  // Add '/' to url if needed + layers/0 if not exists in url.
  const replacedPathName = parsedUrl.pathname
    .replace(/\/?$/, "/")
    .concat("layers/0");
  return `${parsedUrl.origin}${replacedPathName}${parsedUrl.search}`;
};

/**
 * Generate updated url search params according to the viewState
 * @param viewState view state
 * @returns updated url search params object
 */
export const viewStateToUrlParams = (viewState: ViewStateSet) => {
  const search = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );
  const { longitude, latitude, pitch, bearing, zoom } = viewState.main;
  return {
    ...search,
    longitude,
    latitude,
    pitch,
    bearing,
    zoom,
  };
};

/**
 * Parse view state params from the url search params
 * @param viewState view state
 * @returns viewState params available in the url search params
 */
export const urlParamsToViewState = (viewState: ViewStateSet) => {
  const search = new URLSearchParams(window.location.search);
  const urlViewStateParams = {};
  for (const viewStateParam of search) {
    if (
      Object.keys(viewState.main).includes(viewStateParam[0]) &&
      !isNaN(parseFloat(viewStateParam[1]))
    ) {
      urlViewStateParams[viewStateParam[0]] = parseFloat(viewStateParam[1]);
    }
  }
  return urlViewStateParams;
};

/**
 * Converts the link of a webscene that can be copied from ArcGIS
 * to the format required by i3s-explorer to insert a webscene.
 * @param url - Url copied from ArcGIS.
 * @returns Url converted.
 */
export const convertUrlToRestFormat = (url: string): string => {
  let urlRest = "https://www.arcgis.com/sharing/rest/content/items/";
  const urlObject = new URL(url);

  let param: string | null = null;
  for (const paramName of ["id", "webscene"]) {
    param = urlObject.searchParams.get(paramName);
    if (param) {
      break;
    }
  }
  if (param) {
    urlRest += param + "/data";
  } else {
    // The url cannot be converted. Use it "as is".
    return url;
  }
  return urlRest;
};
