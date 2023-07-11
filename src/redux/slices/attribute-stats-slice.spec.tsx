import { load } from "@loaders.gl/core";
import { setupStore } from "../store";
import {
  getAttributeStatsInfo,
  selectStatisitcsMap,
} from "./attribute-stats-slice";
import { StatsInfo } from "@loaders.gl/i3s";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

jest.mock("@loaders.gl/core");

it("Selector should return the initial state", () => {
  const store = setupStore();
  const state = store.getState();
  expect(selectStatisitcsMap(state)).toEqual({});
});

it("getAttributeStatsInfo should call mocked loading not available stats info and put it into the slice state with null", async () => {
  (load as unknown as jest.Mock<any>).mockRejectedValue("Error");

  const store = setupStore();
  const state = store.getState();
  expect(selectStatisitcsMap(state)).toEqual({});

  store.dispatch(getAttributeStatsInfo("testUrl"));
  await sleep(100);
  const newState = store.getState();
  expect(selectStatisitcsMap(newState)["testUrl"]).toEqual(null);
});

it("getAttributeStatsInfo should call mocked loading stats info and put it into the slice state", async () => {
  (load as unknown as jest.Mock<any>).mockReturnValue(
    Promise.resolve({ stats })
  );

  const store = setupStore();
  const state = store.getState();
  expect(selectStatisitcsMap(state)).toEqual({});

  store.dispatch(getAttributeStatsInfo("testUrl"));
  await sleep(100);
  const newState = store.getState();
  expect(selectStatisitcsMap(newState)["testUrl"]).toEqual(stats);
});

it("getAttributeStatsInfo should call mocked loading for empty stats info and put it into the slice state with null", async () => {
  (load as unknown as jest.Mock<any>).mockReturnValue(Promise.resolve({}));

  const store = setupStore();
  const state = store.getState();
  expect(selectStatisitcsMap(state)).toEqual({});

  store.dispatch(getAttributeStatsInfo("testUrl"));
  await sleep(100);
  const newState = store.getState();
  expect(selectStatisitcsMap(newState)["testUrl"]).toEqual(null);
});

const stats: StatsInfo = {
  avg: 27.159085097827166,
  max: 1408.377901,
  min: 0,
  stddev: 20.134263122323357,
  sum: 29395364.164782256,
  variance: 405.3885514789503,
};
