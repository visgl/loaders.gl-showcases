import { StatsMap } from "../types";

export class ComparisonLoadManager extends EventTarget {
  private leftResolved = true;
  private rightResolved = true;
  private _leftStats: StatsMap | null = null;
  private _rightStats: StatsMap | null = null;
  private startTime = 0;
  public leftLoadingTime = 0;
  public rightLoadingTime = 0;

  constructor() {
    super();
  }

  get leftStats(): StatsMap | null {
    return this._leftStats;
  }

  get rightStats(): StatsMap | null {
    return this._rightStats;
  }

  startLoading() {
    this.startTime = Date.now();
    this.leftResolved = false;
    this.rightResolved = false;
    this.leftLoadingTime = 0;
    this.rightLoadingTime = 0;
  }

  resolveLeftSide(stats: StatsMap) {
    this.leftResolved = true;
    this.leftLoadingTime = Date.now() - this.startTime;
    this._leftStats = stats;
    return this.isLoaded();
  }

  resolveRightSide(stats: StatsMap) {
    this.rightResolved = true;
    this.rightLoadingTime = Date.now() - this.startTime;
    this._rightStats = stats;
    return this.isLoaded();
  }

  private isLoaded() {
    const result = this.leftResolved && this.rightResolved;
    if (result) {
      this.dispatchEvent(new Event("loaded"));
    }
    return result;
  }
}
