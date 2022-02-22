export const parseTilesetUrlFromUrl = (): string | null => {
  const params = getParamsAfterHash(window.location.href);
  return params["url"];
};

const getParamsAfterHash = (url: string): { [key: string]: string } => {
  const afterHashPart = url.split("#")[1];

  if (!afterHashPart) {
    return {};
  }

  const paramsPart = url.split("?")[1];

  if (!paramsPart) {
    return {};
  }

  return paramsPart.split("&").reduce((result, param) => {
    const [paramKey, value] = param.split("=");
    result[paramKey] = value;

    return result;
  }, {});
};

export const parseTilesetUrlParams = (url, options) => {
  const parsedUrl = new URL(url);
  let token = options && options.token;
  const tilesetUrl = prepareTilesetUrl(parsedUrl);
  const index = tilesetUrl.lastIndexOf("/layers/0");
  let metadataUrl = tilesetUrl.substring(0, index);

  if (parsedUrl.search) {
    token = parsedUrl.searchParams.get("token");
    metadataUrl = `${metadataUrl}${parsedUrl.search}`;
  }

  return { ...options, tilesetUrl, token, metadataUrl };
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
