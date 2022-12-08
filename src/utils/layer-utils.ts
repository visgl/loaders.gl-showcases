import { LayerExample } from "../types";

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
