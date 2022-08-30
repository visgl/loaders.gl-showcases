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
    comparisonLoadManager.startLoading();
    expect(comparisonLoadManager.leftLoadingTime).toBe(0);
    expect(comparisonLoadManager.rightLoadingTime).toBe(0);
  });

  //   it("Should resolve left side", () => {
  //     const newStats = {
  //       tilesetStats: new Stats({ id: "Tileset" }),
  //       memoryStats: new Stats({ id: "Memory" }),
  //     };
  //     comparisonLoadManager.resolveLeftSide(newStats);
  //     expect(comparisonLoadManager.leftResolved).toBe(true);
  //   });

  //   it("Should resolve right side", () => {
  //     const newStats = {
  //       tilesetStats: new Stats({ id: "Tileset" }),
  //       memoryStats: new Stats({ id: "Memory" }),
  //     };
  //     comparisonLoadManager.resolveRightSide(newStats);
  //     expect(comparisonLoadManager.rightResolved).toBe(true);
  //   });

  //   it("Should perform dispach event", () => {
  //     comparisonLoadManager.leftResolved = true;
  //     comparisonLoadManager.rightResolved = true;
  //     const result =
  //       comparisonLoadManager.leftResolved && comparisonLoadManager.rightResolved;
  //     comparisonLoadManager.isLoaded();
  //     expect(result).toBe(true);
  //   });

  //   it("Should not perform dispach event", () => {
  //     comparisonLoadManager.leftResolved = false;
  //     comparisonLoadManager.rightResolved = true;
  //     const result =
  //       comparisonLoadManager.leftResolved && comparisonLoadManager.rightResolved;
  //     comparisonLoadManager.isLoaded();
  //     expect(result).toBe(false);
  //   });
});
