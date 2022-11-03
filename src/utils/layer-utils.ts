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