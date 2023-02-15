import { TilesetType } from "../types";

export const parseTilesetFromUrl = () => {
  const parsedUrl = new URL(window.location.href);
  return parsedUrl.searchParams.get("tileset") || "";
};

export const parseTilesetUrlParams = (url, options) => {
  if (!url) {
    return { ...options, tilesetUrl: '', token: '', metadataUrl: '' }
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
