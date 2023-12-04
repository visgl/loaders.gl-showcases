import { layerFilterCreator } from "./layers-filter";

describe("Layer filter", () => {
  it("Should not show frustum and scatterplon on main map", () => {
    let layer = { id: "frustum", props: {} };
    let viewport = { id: "main" };
    let layerFilter = layerFilterCreator(true);
    expect(layerFilter({ layer, viewport })).toBe(false);
    layer = { id: "main-on-minimap", props: {} };
    viewport = { id: "main" };
    layerFilter = layerFilterCreator(false);
    expect(layerFilter({ layer, viewport })).toBe(false);
  });

  it("Should not show bounding volumes on minimap", () => {
    const layer = { id: "obb-debug-0", props: {} };
    const viewport = { id: "minimap" };
    const layerFilter = layerFilterCreator(true);
    expect(layerFilter({ layer, viewport })).toBe(false);
  });

  it("Should not show tile if there is no viewport in viewportIds", () => {
    const layer = { id: "layer-id", props: { viewportIds: ["main"] } };
    const viewport = { id: "minimap" };
    const layerFilter = layerFilterCreator(true);
    expect(layerFilter({ layer, viewport })).toBe(false);
  });

  it("Should not show normals on minimap", () => {
    const layer = { id: "normals-debug", props: {} };
    const viewport = { id: "minimap" };
    const layerFilter = layerFilterCreator(true);
    expect(layerFilter({ layer, viewport })).toBe(false);
  });

  it("Should not show terrain on minimap", () => {
    const layer = { id: "terrain-0", props: {} };
    const viewport = { id: "minimap" };
    const layerFilter = layerFilterCreator(true);
    expect(layerFilter({ layer, viewport })).toBe(false);
  });

  it("Should show a tile on a viewport", () => {
    const layer = { id: "layer-id", props: { viewportIds: ["main"] } };
    const viewport = { id: "main" };
    const layerFilter = layerFilterCreator(true);
    expect(layerFilter({ layer, viewport })).toBe(true);
  });
});
