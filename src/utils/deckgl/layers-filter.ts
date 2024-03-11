export const layerFilterCreator = (showMinimap: boolean) => {
  return ({ layer, viewport }) => {
    const { id: viewportId } = viewport;
    const {
      id: layerId,
      props: { viewportIds = null },
    } = layer;
    if (
      viewportId !== "minimap" &&
      (layerId === "frustum" || layerId === "main-on-minimap")
    ) {
      // only display frustum in the minimap
      return false;
    }
    if (
      showMinimap &&
      viewportId === "minimap" &&
      layerId.indexOf("obb-debug-") !== -1
    ) {
      return false;
    }
    if (viewportIds && !viewportIds.includes(viewportId)) {
      return false;
    }
    if (viewportId === "minimap" && layerId === "normals-debug") {
      return false;
    }
    if (viewportId === "minimap" && layerId.indexOf("terrain") !== -1) {
      return false;
    }
    return true;
  };
};
