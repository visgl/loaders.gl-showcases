import { load } from "@loaders.gl/core";
import { setupStore } from "../store";
import {
  getAttributeStatsInfo,
  selectStatisitcsMap,
} from "./attribute-stats-map-slice";
import { StatsInfo } from "@loaders.gl/i3s";

jest.mock("@loaders.gl/core");

describe("slice: attribute-stats-map", () => {
  it("Selector should return the initial state", () => {
    const store = setupStore();
    const state = store.getState();
    expect(selectStatisitcsMap(state)).toEqual({});
  });

  it("Should handle `getAttributeStatsInfo.rejected` action", async () => {
    (load as unknown as jest.Mock<any>).mockRejectedValue("Error");

    const store = setupStore();
    const state = store.getState();
    expect(selectStatisitcsMap(state)).toEqual({});

    await store.dispatch(getAttributeStatsInfo("testUrl"));
    const newState = store.getState();
    expect(selectStatisitcsMap(newState)["testUrl"]).toEqual(null);
  });

  it("Should handle `getAttributeStatsInfo.fulfilled` action for non-empty stats", async () => {
    (load as unknown as jest.Mock<any>).mockReturnValue(
      Promise.resolve({ stats })
    );

    const store = setupStore();
    const state = store.getState();
    expect(selectStatisitcsMap(state)).toEqual({});

    await store.dispatch(getAttributeStatsInfo("testUrl"));
    const newState = store.getState();
    expect(selectStatisitcsMap(newState)["testUrl"]).toEqual(stats);
  });

  it("Should handle `getAttributeStatsInfo.fulfilled` action for empty stats", async () => {
    (load as unknown as jest.Mock<any>).mockReturnValue(Promise.resolve({}));

    const store = setupStore();
    const state = store.getState();
    expect(selectStatisitcsMap(state)).toEqual({});

    await store.dispatch(getAttributeStatsInfo("testUrl"));
    const newState = store.getState();
    expect(selectStatisitcsMap(newState)["testUrl"]).toEqual(null);
  });
});

const stats: StatsInfo = {
  avg: 27.159085097827166,
  max: 1408.377901,
  min: 0,
  stddev: 20.134263122323357,
  sum: 29395364.164782256,
  variance: 405.3885514789503,
};
