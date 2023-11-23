import { ComparisonSideMode } from "../../types";
import { setupStore } from "../store";
import reducer, {
  FiltersByAttributeState,
  selectFiltersByAttribute,
  setFiltersByAttrubute,
} from "./filters-by-attribute-slice";

describe("slice: filters-by-attribute", () => {
  it("Reducer should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual({
      single: null,
      left: null,
      right: null,
    });
  });

  it("Reducer setFiltersByAttrubute should handle setting filters by attribute", () => {
    const previousState: FiltersByAttributeState = {
      single: null,
      left: null,
      right: null,
    };

    expect(
      reducer(
        previousState,
        setFiltersByAttrubute({
          filter: { attributeName: "BldgLevel", value: 5 },
        })
      )
    ).toEqual({
      single: { attributeName: "BldgLevel", value: 5 },
      left: null,
      right: null,
    });
    expect(
      reducer(
        previousState,
        setFiltersByAttrubute({
          filter: { attributeName: "BldgLevel", value: 6 },
          side: ComparisonSideMode.left,
        })
      )
    ).toEqual({
      single: null,
      left: { attributeName: "BldgLevel", value: 6 },
      right: null,
    });
    expect(
      reducer(
        previousState,
        setFiltersByAttrubute({
          filter: { attributeName: "BldgLevel", value: 7 },
          side: ComparisonSideMode.right,
        })
      )
    ).toEqual({
      single: null,
      left: null,
      right: { attributeName: "BldgLevel", value: 7 },
    });
  });

  it("Selector should return the initial state", () => {
    const store = setupStore();
    const state = store.getState();
    expect(selectFiltersByAttribute(state)).toEqual(null);
    expect(selectFiltersByAttribute(state, ComparisonSideMode.left)).toEqual(
      null
    );
    expect(selectFiltersByAttribute(state, ComparisonSideMode.right)).toEqual(
      null
    );
  });

  it("Selector should return the updated value", () => {
    const store = setupStore();
    store.dispatch(
      setFiltersByAttrubute({ filter: { attributeName: "testAttr", value: 3 } })
    );
    const state = store.getState();
    expect(selectFiltersByAttribute(state)).toEqual({
      attributeName: "testAttr",
      value: 3,
    });

    store.dispatch(
      setFiltersByAttrubute({
        filter: { attributeName: "testAttr2", value: 5 },
        side: ComparisonSideMode.left,
      })
    );
    const state2 = store.getState();
    expect(selectFiltersByAttribute(state2, ComparisonSideMode.left)).toEqual({
      attributeName: "testAttr2",
      value: 5,
    });

    store.dispatch(
      setFiltersByAttrubute({
        filter: { attributeName: "testAttr3", value: 7 },
        side: ComparisonSideMode.right,
      })
    );
    const state3 = store.getState();
    expect(selectFiltersByAttribute(state3, ComparisonSideMode.right)).toEqual({
      attributeName: "testAttr3",
      value: 7,
    });
  });
});
