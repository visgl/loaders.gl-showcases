import { fetchFile } from "@loaders.gl/core";
import { ComparisonSideMode } from "../../types";
import { setupStore } from "../store";
import reducer, {
  BSLStatisitcsSummaryState,
  clearBSLStatisitcsSummary,
  getBSLStatisticsSummary,
  selectFieldValues,
} from "./bsl-statistics-summary-slice";

jest.mock("@loaders.gl/core");

const mockData = {
  statisticsHRef: "testHref",
  summary: [{ fieldName: "BldgLevel", mostFrequentValues: [0, 10, 20] }],
};
(fetchFile as unknown as jest.Mock<any>).mockReturnValue(
  new Promise((resolve) => {
    resolve({ text: async () => JSON.stringify(mockData) });
  })
);

describe("slice: bsl-statistics-summary", () => {
  it("Reducer should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual({
      single: { fields: {} },
      left: { fields: {} },
      right: { fields: {} },
    });
  });

  it("getBSLStatisticsSummary should put statistics to the state", async () => {
    const store = setupStore();
    await store.dispatch(
      getBSLStatisticsSummary({ statSummaryUrl: "testUrl" })
    );
    const state = store.getState();
    expect(state.bslStatisitcsSummary).toEqual({
      single: {
        fields: { BldgLevel: { mostFrequentValues: [0, 10, 20] } },
      },
      left: { fields: {} },
      right: { fields: {} },
    });

    await store.dispatch(
      getBSLStatisticsSummary({
        statSummaryUrl: "testUrl",
        side: ComparisonSideMode.left,
      })
    );
    const state2 = store.getState();
    expect(state2.bslStatisitcsSummary).toEqual({
      single: {
        fields: { BldgLevel: { mostFrequentValues: [0, 10, 20] } },
      },
      left: {
        fields: { BldgLevel: { mostFrequentValues: [0, 10, 20] } },
      },
      right: { fields: {} },
    });

    await store.dispatch(
      getBSLStatisticsSummary({
        statSummaryUrl: "testUrl",
        side: ComparisonSideMode.right,
      })
    );
    const state3 = store.getState();
    expect(state3.bslStatisitcsSummary).toEqual({
      single: {
        fields: { BldgLevel: { mostFrequentValues: [0, 10, 20] } },
      },
      left: {
        fields: { BldgLevel: { mostFrequentValues: [0, 10, 20] } },
      },
      right: {
        fields: { BldgLevel: { mostFrequentValues: [0, 10, 20] } },
      },
    });
  });

  it("Reducer clearBSLStatisitcsSummary should clear state", () => {
    const previousState: BSLStatisitcsSummaryState = {
      single: {
        fields: { Attr1: { mostFrequentValues: [1, 2, 3] } },
      },
      left: {
        fields: { Attr2: { mostFrequentValues: [4, 5, 6] } },
      },
      right: {
        fields: { Attr3: { mostFrequentValues: [7, 8, 9] } },
      },
    };

    expect(reducer(previousState, clearBSLStatisitcsSummary())).toEqual({
      single: { fields: {} },
      left: { fields: {} },
      right: { fields: {} },
    });
  });

  it("Selector should return the initial values", () => {
    const store = setupStore();
    const state = store.getState();
    expect(selectFieldValues(state, "testField")).toEqual(undefined);
    expect(
      selectFieldValues(state, "testField", ComparisonSideMode.left)
    ).toEqual(undefined);
    expect(
      selectFieldValues(state, "testField", ComparisonSideMode.right)
    ).toEqual(undefined);
  });

  it("Selector should return the updated value", async () => {
    const store = setupStore();
    await store.dispatch(
      getBSLStatisticsSummary({ statSummaryUrl: "testUrl" })
    );
    const state = store.getState();
    expect(selectFieldValues(state, "BldgLevel")).toEqual({
      mostFrequentValues: [0, 10, 20],
    });
    store.dispatch(clearBSLStatisitcsSummary());

    await store.dispatch(
      getBSLStatisticsSummary({
        statSummaryUrl: "testUrl",
        side: ComparisonSideMode.left,
      })
    );
    const state2 = store.getState();
    expect(
      selectFieldValues(state2, "BldgLevel", ComparisonSideMode.left)
    ).toEqual({
      mostFrequentValues: [0, 10, 20],
    });
    store.dispatch(clearBSLStatisitcsSummary());

    await store.dispatch(
      getBSLStatisticsSummary({
        statSummaryUrl: "testUrl",
        side: ComparisonSideMode.right,
      })
    );
    const state3 = store.getState();
    expect(
      selectFieldValues(state3, "BldgLevel", ComparisonSideMode.right)
    ).toEqual({
      mostFrequentValues: [0, 10, 20],
    });
  });

  it("getBSLStatisticsSummary should clear state if fetching statistics is rejected", async () => {
    (fetchFile as unknown as jest.Mock<any>)
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolve({ text: async () => JSON.stringify(mockData) });
        })
      )
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolve({ text: async () => JSON.stringify(mockData) });
        })
      )
      .mockRejectedValueOnce(new Error("Error getting statistics"));

    const store = setupStore();
    await store.dispatch(
      getBSLStatisticsSummary({ statSummaryUrl: "testUrl" })
    );
    const state = store.getState();
    expect(selectFieldValues(state, "BldgLevel")).toEqual({
      mostFrequentValues: [0, 10, 20],
    });

    await store.dispatch(
      getBSLStatisticsSummary({ statSummaryUrl: "rejectedTestUrl" })
    );
    const state2 = store.getState();
    expect(selectFieldValues(state2, "BldgLevel")).toEqual(undefined);
  });

  it("getBSLStatisticsSummary should clear state if there is no statistics data", async () => {
    const mockDataNoStats = {};
    (fetchFile as unknown as jest.Mock<any>)
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolve({ text: async () => JSON.stringify(mockData) });
        })
      )
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolve({ text: async () => JSON.stringify(mockData) });
        })
      )
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolve({ text: async () => JSON.stringify(mockDataNoStats) });
        })
      );

    const store = setupStore();
    await store.dispatch(
      getBSLStatisticsSummary({ statSummaryUrl: "testUrl" })
    );
    const state = store.getState();
    expect(selectFieldValues(state, "BldgLevel")).toEqual({
      mostFrequentValues: [0, 10, 20],
    });

    await store.dispatch(
      getBSLStatisticsSummary({ statSummaryUrl: "testUrl" })
    );
    const state2 = store.getState();
    expect(state2.bslStatisitcsSummary.single).toEqual({ fields: {} });
  });
});
