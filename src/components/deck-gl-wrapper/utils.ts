import type { AttributeStorageInfo } from "@loaders.gl/i3s";
import type { Tile3D } from "@loaders.gl/tiles";

import { load } from "@loaders.gl/core";
import { I3SAttributeLoader } from "@loaders.gl/i3s";

export type COLOR = [number, number, number, number];
export type ColorsByAttribute = {
  /** Feature attribute name */
  attributeName: string;
  /** Minimum attribute value */
  minValue: number;
  /** Maximum attribute value */
  maxValue: number;
  /** Minimum color. 3DObject will be colorized with gradient from `minColor to `maxColor` */
  minColor: COLOR;
  /** Maximum color. 3DObject will be colorized with gradient from `minColor to `maxColor` */
  maxColor: COLOR;
  /** Colorization mode. `replace` - replace vertex colors with a new colors, `multiply` - multiply vertex colors with new colors */
  mode: "multiply" | "replace";
};
export type ColorsByAttributeResult = {
  tile: Tile3D;
  colors?: Array<any>;
  colorsByAttribute?: ColorsByAttribute;
};

/**
 * Modify vertex colors array to visualize 3D objects in a attribute driven way
 * @param tile - tile to be colorized
 * @param colorsByAttribute - custom colors patameters
 * @param options - loader options
 * @returns original tile, new colors array and custom colors parameters
 */
// eslint-disable-next-line max-statements
export async function customizeColors(
  tile: Tile3D,
  colorsByAttribute: ColorsByAttribute,
  options
): Promise<ColorsByAttributeResult> {
  if (!colorsByAttribute) {
    return { tile };
  }

  const colors = {
    ...tile.content.attributes.colors,
    value: tile.content.attributes.colors.value.slice(),
  };

  const colorizeAttributeField = tile.tileset.tileset.fields.find(
    ({ name }) => name === colorsByAttribute?.attributeName
  );
  if (
    !colorizeAttributeField ||
    ![
      "esriFieldTypeDouble",
      "esriFieldTypeInteger",
      "esriFieldTypeSmallInteger",
    ].includes(colorizeAttributeField.type)
  ) {
    return { tile };
  }

  const colorizeAttributeData = await loadFeatureAttributeData(
    colorizeAttributeField.name,
    tile.header.attributeUrls,
    tile.tileset.tileset.attributeStorageInfo,
    options
  );
  if (!colorizeAttributeData) {
    return { tile };
  }

  const objectIdField = tile.tileset.tileset.fields.find(
    ({ type }) => type === "esriFieldTypeOID"
  );
  if (!objectIdField) {
    return { tile };
  }

  const objectIdAttributeData = await loadFeatureAttributeData(
    objectIdField.name,
    tile.header.attributeUrls,
    tile.tileset.tileset.attributeStorageInfo,
    options
  );
  if (!objectIdAttributeData) {
    return { tile };
  }

  const attributeValuesMap: { [key: number]: COLOR } = {};
  // @ts-expect-error obj is possible null
  for (let i = 0; i < objectIdAttributeData[objectIdField.name].length; i++) {
    // @ts-expect-error obj is possible null
    attributeValuesMap[objectIdAttributeData[objectIdField.name][i]] =
      calculateColorForAttribute(
        // @ts-expect-error obj is possible null
        colorizeAttributeData[colorizeAttributeField.name][i] as number,
        colorsByAttribute
      );
  }

  for (let i = 0; i < tile.content.featureIds.length; i++) {
    const color = attributeValuesMap[tile.content.featureIds[i]];
    if (!color) {
      continue; // eslint-disable-line no-continue
    }

    if (colorsByAttribute.mode === "multiply") {
      // multiplying original mesh and calculated for attribute rgba colors in range 0-255
      color.forEach((colorItem, index) => {
        colors.value[i * 4 + index] =
          (colors.value[i * 4 + index] * colorItem) / 255;
      });
    } else {
      colors.value.set(color, i * 4);
    }
  }

  return { tile, colors, colorsByAttribute };
}

/**
 * Calculate rgba color from the attribute value
 * @param attributeValue - value of the attribute
 * @param colorsByAttribute - custom color parameters
 * @returns - color array for a specific attribute value
 */
function calculateColorForAttribute(
  attributeValue: number,
  colorsByAttribute: ColorsByAttribute
): COLOR {
  if (!colorsByAttribute) {
    return [255, 255, 255, 255];
  }
  const { minValue, maxValue, minColor, maxColor } = colorsByAttribute;
  const rate = (attributeValue - minValue) / (maxValue - minValue);
  const color: COLOR = [255, 255, 255, 255];
  for (let i = 0; i < minColor.length; i++) {
    color[i] = Math.round((maxColor[i] - minColor[i]) * rate + minColor[i]);
  }
  return color;
}

/**
 * Load feature attribute data from the ArcGIS rest service
 * @param attributeName - attribute name
 * @param attributeUrls - attribute urls for loading
 * @param attributesStorageInfo - array of attributeStorageInfo objects
 * @param options - loader options
 * @returns - Array-like list of the attribute values
 */
async function loadFeatureAttributeData(
  attributeName: string,
  attributeUrls: string[],
  attributesStorageInfo: AttributeStorageInfo[],
  options
): Promise<{
  [key: string]: string[] | Uint32Array | Uint16Array | Float64Array | null;
} | null> {
  const attributeIndex = attributesStorageInfo.findIndex(
    ({ name }) => attributeName === name
  );
  if (attributeIndex === -1) {
    return null;
  }
  const objectIdAttributeUrl = getUrlWithToken(
    attributeUrls[attributeIndex],
    options?.i3s?.token
  );
  const attributeType = getAttributeValueType(
    attributesStorageInfo[attributeIndex]
  );
  const objectIdAttributeData = await load(
    objectIdAttributeUrl,
    I3SAttributeLoader,
    {
      attributeName,
      attributeType,
    }
  );

  return objectIdAttributeData;
}

/**
 * Generates url with token if it is exists.
 * @param url
 * @param token
 * @returns
 */
export function getUrlWithToken(
  url: string,
  token: string | null = null
): string {
  return token ? `${url}?token=${token}` : url;
}

function getAttributeValueType(attribute: AttributeStorageInfo) {
  if ("objectIds" in attribute) {
    return "Oid32";
  } else if ("attributeValues" in attribute) {
    return attribute.attributeValues.valueType;
  }
  return "";
}
