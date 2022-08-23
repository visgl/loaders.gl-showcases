import { ComparisonLoadManager } from "./comparison-load-manager";

let comparisonLoadManager;

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
    expect(comparisonLoadManager.leftResolved).toBe(false);
    expect(comparisonLoadManager.rightResolved).toBe(false);
  });

  it("Should resolve left side", () => {
    comparisonLoadManager.resolveLeftSide();
    expect(comparisonLoadManager.leftResolved).toBe(true);
  });

  it("Should resolve right side", () => {
    comparisonLoadManager.resolveRightSide();
    expect(comparisonLoadManager.rightResolved).toBe(true);
  });

  it("Should stop timer left side", () => {
    comparisonLoadManager.stoptTimerLeftSide();
    expect(comparisonLoadManager.leftLoadingTime).toBe(0);
  });

  it("Should stop timer right side", () => {
    comparisonLoadManager.stoptTimerRightSide();
    expect(comparisonLoadManager.leftLoadingTime).toBe(0);
  });

  it("Should perform dispach event", () => {
    comparisonLoadManager.leftResolved = true;
    comparisonLoadManager.rightResolved= true;
    const result = comparisonLoadManager.leftResolved && comparisonLoadManager.rightResolved;
    comparisonLoadManager.isLoaded();
    expect(result).toBe(true);
  });

  it("Should not perform dispach event", () => {
    comparisonLoadManager.leftResolved = false;
    comparisonLoadManager.rightResolved= true;
    const result = comparisonLoadManager.leftResolved && comparisonLoadManager.rightResolved;
    comparisonLoadManager.isLoaded();
    expect(result).toBe(false);
  });
});
