import { Stats } from "@probe.gl/stats";
import { ComparisonLoadManager } from "./comparison-load-manager";

let comparisonLoadManager: ComparisonLoadManager;

beforeEach(() => {
  comparisonLoadManager = new ComparisonLoadManager();
});

describe("Load manager", () => {
  it("Should create comparison load manager", () => {
    expect(comparisonLoadManager).toBeDefined();
    expect(comparisonLoadManager.leftLoadingTime).toBeDefined();
    expect(comparisonLoadManager.rightLoadingTime).toBeDefined();
  });

  it("Should start loading", () => {
    const newStats = {
      url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
      tilesetStats: new Stats({ id: "Tileset" }),
      memoryStats: new Stats({ id: "Memory" }),
      isCompressedGeometry: true,
      isCompressedTextures: true,
    };

    comparisonLoadManager.startLoading();

    expect(comparisonLoadManager.leftLoadingTime).toBe(0);
    expect(comparisonLoadManager.rightLoadingTime).toBe(0);

    // @ts-expect-error test data doesn't to the expected type
    const resolvedLeft = comparisonLoadManager.resolveLeftSide(newStats);
    // @ts-expect-error test data doesn't to the expected type
    const resolvedRight = comparisonLoadManager.resolveRightSide(newStats);

    expect(resolvedLeft).toBe(false);
    expect(resolvedRight).toBe(true);
  });

  it("Should stop loading", () => {
    const newStats = {
      url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
      tilesetStats: new Stats({ id: "Tileset" }),
      memoryStats: new Stats({ id: "Memory" }),
      isCompressedGeometry: true,
      isCompressedTextures: true,
    };

    comparisonLoadManager.stopLoading();

    // @ts-expect-error test data doesn't to the expected type
    const resolvedLeft = comparisonLoadManager.resolveLeftSide(newStats);
    // @ts-expect-error test data doesn't to the expected type
    const resolvedRight = comparisonLoadManager.resolveRightSide(newStats);

    expect(resolvedLeft).toBe(false);
    expect(resolvedRight).toBe(false);
  });

  it("Should get left stats", () => {
    const newStats = {
      url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
      tilesetStats: new Stats({ id: "Tileset" }),
      memoryStats: new Stats({ id: "Memory" }),
      isCompressedGeometry: true,
      isCompressedTextures: true,
    };

    comparisonLoadManager.startLoading();

    // @ts-expect-error test data doesn't to the expected type
    comparisonLoadManager.resolveLeftSide(newStats);
    expect(comparisonLoadManager.leftStats).toBe(newStats);
  });

  it("Should get right stats", () => {
    const newStats = {
      url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0",
      tilesetStats: new Stats({ id: "Tileset" }),
      memoryStats: new Stats({ id: "Memory" }),
      isCompressedGeometry: true,
      isCompressedTextures: true,
    };

    comparisonLoadManager.startLoading();

    // @ts-expect-error test data doesn't to the expected type
    comparisonLoadManager.resolveRightSide(newStats);
    expect(comparisonLoadManager.rightStats).toBe(newStats);
  });

  it("Should dispatch event", () => {
    const newStats = {
      url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0",
      tilesetStats: new Stats({ id: "Tileset" }),
      memoryStats: new Stats({ id: "Memory" }),
      isCompressedGeometry: true,
      isCompressedTextures: true,
    };
    const dispatchEventSpy = jest.spyOn(comparisonLoadManager, "dispatchEvent");
    const newEvent = new Event("loaded");

    comparisonLoadManager.startLoading();

    // @ts-expect-error test data doesn't to the expected type
    comparisonLoadManager.resolveLeftSide(newStats);
    // @ts-expect-error test data doesn't to the expected type
    comparisonLoadManager.resolveRightSide(newStats);
    expect(dispatchEventSpy).toHaveBeenCalledWith(newEvent);

    expect(dispatchEventSpy.mock.calls[0][0]).toEqual(newEvent);
  });
});
