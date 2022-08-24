export class ComparisonLoadManager extends EventTarget {
  private leftResolved = true;
  private rightResolved = true;
  private startTime = 0;
  public leftLoadingTime = 0;
  public rightLoadingTime = 0;

  constructor() {
    super();
  }

  startLoading() {
    this.startTime = Date.now();
    this.leftResolved = false;
    this.rightResolved = false;
    this.leftLoadingTime = 0;
    this.rightLoadingTime = 0;
  }

  resolveLeftSide() {
    this.leftResolved = true;
    this.leftLoadingTime = Date.now() - this.startTime;
    return this.isLoaded();
  }

  resolveRightSide() {
    this.rightResolved = true;
    this.rightLoadingTime = Date.now() - this.startTime;
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
