import { type Tileset3D } from "@loaders.gl/tiles";
import { EXAMPLES, INITIAL_EXAMPLE } from "../constants/i3s-examples";
import { type LayerExample } from "../types";
import { parseTilesetFromUrl } from "./url-utils";

export const handleSelectAllLeafsInGroup = (
  layer: LayerExample,
  leafs: LayerExample[] = []
) => {
  if (layer?.layers?.length) {
    for (const childLayer of layer.layers) {
      leafs = handleSelectAllLeafsInGroup(childLayer, leafs);
    }
  } else {
    leafs.push(layer);
  }

  return leafs;
};

/**
 * Traverses through Layers tree to get all ids.
 * @param layers
 * @param flattenedLayersIds
 */
export const flattenLayerIds = (
  layers: LayerExample[],
  flattenedLayersIds: string[] = []
): string[] => {
  for (const layer of layers) {
    if (layer?.layers?.length) {
      flattenLayerIds(layer.layers, flattenedLayersIds);
    }

    flattenedLayersIds.push(layer.id);
  }

  return flattenedLayersIds;
};

export const initActiveLayer = (): LayerExample => {
  const tilesetParam = parseTilesetFromUrl();

  if (tilesetParam?.startsWith("http")) {
    return {
      id: tilesetParam,
      name: tilesetParam,
      custom: true,
      url: tilesetParam,
    };
  }

  const namedExample = EXAMPLES.find(({ id }) => tilesetParam === id);

  return namedExample ?? INITIAL_EXAMPLE;
};

export const selectNestedLayers = (
  layer: LayerExample,
  activeLayers: LayerExample[],
  rootLayer?: LayerExample
) => {
  const isGroup = !!layer?.layers?.length;
  const isUnitLayer = !rootLayer && !isGroup;
  const isLeaf = rootLayer && !isGroup;
  const isMainGroup = isGroup && !rootLayer;

  let newActiveLayers: LayerExample[] = [];

  switch (true) {
    case isUnitLayer:
      newActiveLayers = [layer];
      break;
    case isGroup:
      newActiveLayers = handleSelectGroupLayer(
        layer,
        activeLayers,
        isMainGroup,
        rootLayer
      );
      break;
    case isLeaf:
      newActiveLayers = handleSelectLeafLayer(layer, activeLayers, rootLayer);
      break;
  }
  return newActiveLayers;
};

export const findExampleAndUpdateWithViewState = (
  tileset: Tileset3D,
  examples: LayerExample[]
): LayerExample[] => {
  // Shallow copy of example objects to prevent mutation of the state object.
  const examplesCopy = [...examples];

  for (const example of examplesCopy) {
    // We can't compare by tileset.url === example.url because BSL and Scene examples url is not loaded as tileset.
    if (tileset.url.includes(typeof example.url === "string" ? example.url : example.url.name) && !example.viewState) {
      const { zoom, cartographicCenter } = tileset;
      const [longitude, latitude] = cartographicCenter ?? [];
      example.viewState = { zoom, latitude, longitude };
      break;
    }

    if (example.layers) {
      example.layers = findExampleAndUpdateWithViewState(
        tileset,
        example.layers
      );
    }
  }

  return examplesCopy;
};

/**
 * Get layer objects from layersTree having those layer ids
 * @param staticLayers - layers tree
 * @param activeIds - layer ids
 * @param activeLayers - accumulator for recursive logic
 * @returns layers array that match given ids
 */
export const getActiveLayersByIds = (
  staticLayers: LayerExample[],
  activeIds: string[] = [],
  activeLayers: LayerExample[] = []
): LayerExample[] => {
  for (const layer of staticLayers) {
    if (activeIds.includes(layer.id)) {
      activeLayers.push(layer);
    }

    if (layer?.layers?.length) {
      getActiveLayersByIds(layer?.layers, activeIds, activeLayers);
    }
  }

  return activeLayers;
};

const handleSelectGroupLayer = (
  layer: LayerExample,
  activeLayers: LayerExample[],
  isMainGroup: boolean,
  rootLayer?: LayerExample
) => {
  const allLeafsInRootLayer = rootLayer
    ? handleSelectAllLeafsInGroup(rootLayer).map((layer) => layer.id)
    : [];

  const activeLayersInRootGroup = activeLayers.filter((activeLayer) =>
    allLeafsInRootLayer.includes(activeLayer.id)
  );

  const leafsInGroupsTree = handleSelectAllLeafsInGroup(layer);
  const selectedChildrenIds = leafsInGroupsTree.map((child) => child.id);
  const isGroupAlreadySelected = activeLayers.some((activeLayer) =>
    selectedChildrenIds.includes(activeLayer.id)
  );

  if (isGroupAlreadySelected && !isMainGroup) {
    const result = activeLayers.filter(
      (activeLayer) => !selectedChildrenIds.includes(activeLayer.id)
    );
    return result;
  }

  if (isMainGroup) {
    return leafsInGroupsTree;
  }

  return [...activeLayersInRootGroup, ...leafsInGroupsTree];
};

const handleSelectLeafLayer = (
  layer: LayerExample,
  activeLayers: LayerExample[],
  rootLayer?: LayerExample
) => {
  const isLayerAlreadySelected = activeLayers.some(
    (activeLayer) => activeLayer.id === layer.id
  );

  if (isLayerAlreadySelected) {
    return activeLayers.filter((activeLayer) => activeLayer.id !== layer.id);
  }

  const activeLayerIdsFromRoot = rootLayer
    ? handleSelectAllLeafsInGroup(rootLayer).map((layer) => layer.id)
    : [];
  const activeLayersInRootGroup = activeLayers.filter((activeLayer) =>
    activeLayerIdsFromRoot.includes(activeLayer.id)
  );

  return [...activeLayersInRootGroup, layer];
};
