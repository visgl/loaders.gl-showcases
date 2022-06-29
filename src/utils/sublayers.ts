import { Sublayer } from "../types";

/**
 * - deep copy the tree for React
 * - filter "preview" layer
 * - calculate the number of child nodes for each node (just in case)
 * @param {*} sublayers
 * @returns
 */
export function buildSublayersTree(sublayers): Sublayer | null {
  const fullModel = sublayers.find(
    (subtree) => subtree.modelName === "FullModel"
  );
  const result = postprocessNode(fullModel);
  return result;
}

function postprocessNode(sublayer): Sublayer | null {
  const sublayerCopy = { ...sublayer, sublayers: undefined };
  sublayerCopy.expanded = false;
  if (sublayer.sublayers?.length) {
    const { childNodesCount, sublayersCopy } = postrocessSublayers(
      sublayer.sublayers
    );
    sublayerCopy.sublayers = sublayersCopy;
    sublayerCopy.childNodesCount = childNodesCount;
  } else {
    sublayerCopy.childNodesCount = 0;
    if (sublayer.layerType === "group") {
      return null;
    }
  }
  return sublayerCopy;
}

function postrocessSublayers(sublayers): {
  childNodesCount: number;
  sublayersCopy: Sublayer[];
} {
  const sublayersCopy = [];
  let childNodesCount = 0;
  for (const sublayer of sublayers) {
    const sublayerCopy = postprocessNode(sublayer);
    if (!sublayerCopy) {
      continue;
    }
    // @ts-expect-error TODO fix never to any typing issue
    sublayersCopy.push(sublayerCopy);
    childNodesCount += sublayerCopy.childNodesCount + 1;
  }
  return { childNodesCount, sublayersCopy };
}
