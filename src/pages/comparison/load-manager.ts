export class LoadManager extends EventTarget {
  private leftResolved = true;
  private rightResolved = true;
  private interval;
  public haveBeenCompared = false;
  public loadingTime = 0;

  constructor() {
    super();
  }

  startLoading() {
    this.getTime();
    this.leftResolved = false;
    this.rightResolved = false;
    this.haveBeenCompared = true;
  }

  resolveLeftSide() {
    this.leftResolved = true;
    return this.isLoaded();
  }

  resolveRightSide() {
    this.rightResolved = true;
    return this.isLoaded();
  }

  stoptTimer() {
    clearInterval(this.interval);
  }

  private getTime() {
    const startTime = Date.now();
    this.interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      this.loadingTime = elapsedTime;
    }, 100);
  }

  private isLoaded() {
    const result = this.leftResolved && this.rightResolved;
    if (result) {
      this.dispatchEvent(new Event("loaded"));
    }
    return result;
  }
}
