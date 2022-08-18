export class LoadManager extends EventTarget {
  private leftResolved = true;
  private rightResolved = true;

  constructor() {
    super();
  }

  startLoading() {
    this.leftResolved = false;
    this.rightResolved = false;
  }

  resolveLeftSide() {
    this.leftResolved = true;
    return this.isLoaded();
  }

  resolveRightSide() {
    this.rightResolved = true;
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
