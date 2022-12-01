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
export const flattenLayerIds = (layers: LayerExample[], flattenedLayersIds: string[] = []): string[] => {
 for (const layer of layers) {
   if (layer?.layers?.length) {
     flattenLayerIds(layer.layers, flattenedLayersIds);
   }

   flattenedLayersIds.push(layer.id);
 }

 return flattenedLayersIds;
}
