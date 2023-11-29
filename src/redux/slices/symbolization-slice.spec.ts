import { ComparisonSideMode } from "../../types";
import { setupStore } from "../store";
import reducer, {
  SymbolizationState,
  selectColorsByAttribute,
  selectFiltersByAttribute,
  setColorsByAttrubute,
  setFiltersByAttrubute,
} from "./symbolization-slice";

describe("slice: symbolization", () => {
  it("Reducer should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual({
      colorsByAttribute: null,
      filtersByAttribute: {
        single: null,
        left: null,
        right: null,
      },
    });
  });

  it("Reducers should handle setting symbolization", () => {
    const previousState: SymbolizationState = {
      colorsByAttribute: null,
      filtersByAttribute: {
        single: null,
        left: null,
        right: null,
      },
    };

    expect(
      reducer(
        previousState,
        setColorsByAttrubute({
          attributeName: "HEIGHTROOF",
          minValue: 0,
          maxValue: 100,
          minColor: [146, 146, 252, 255],
          maxColor: [44, 44, 175, 255],
          mode: "replace",
        })
      )
    ).toEqual({
      colorsByAttribute: {
        attributeName: "HEIGHTROOF",
        minValue: 0,
        maxValue: 100,
        minColor: [146, 146, 252, 255],
        maxColor: [44, 44, 175, 255],
        mode: "replace",
      },
      filtersByAttribute: {
        single: null,
        left: null,
        right: null,
      },
    });

    const previousState2: SymbolizationState = {
      colorsByAttribute: {
        attributeName: "HEIGHTROOF",
        minValue: 0,
        maxValue: 100,
        minColor: [146, 146, 252, 255],
        maxColor: [44, 44, 175, 255],
        mode: "replace",
      },
      filtersByAttribute: {
        single: null,
        left: null,
        right: null,
      },
    };
    expect(
      reducer(
        previousState2,
        setFiltersByAttrubute({
          filter: { attributeName: "BldgLevel", value: 5 },
        })
      )
    ).toEqual({
      colorsByAttribute: {
        attributeName: "HEIGHTROOF",
        minValue: 0,
        maxValue: 100,
        minColor: [146, 146, 252, 255],
        maxColor: [44, 44, 175, 255],
        mode: "replace",
      },
      filtersByAttribute: {
        single: { attributeName: "BldgLevel", value: 5 },
        left: null,
        right: null,
      },
    });

    expect(
      reducer(
        previousState2,
        setFiltersByAttrubute({
          filter: { attributeName: "BldgLevel", value: 6 },
          side: ComparisonSideMode.left,
        })
      )
    ).toEqual({
      colorsByAttribute: {
        attributeName: "HEIGHTROOF",
        minValue: 0,
        maxValue: 100,
        minColor: [146, 146, 252, 255],
        maxColor: [44, 44, 175, 255],
        mode: "replace",
      },
      filtersByAttribute: {
        single: null,
        left: { attributeName: "BldgLevel", value: 6 },
        right: null,
      },
    });

    expect(
      reducer(
        previousState2,
        setFiltersByAttrubute({
          filter: { attributeName: "BldgLevel", value: 7 },
          side: ComparisonSideMode.right,
        })
      )
    ).toEqual({
      colorsByAttribute: {
        attributeName: "HEIGHTROOF",
        minValue: 0,
        maxValue: 100,
        minColor: [146, 146, 252, 255],
        maxColor: [44, 44, 175, 255],
        mode: "replace",
      },
      filtersByAttribute: {
        single: null,
        left: null,
        right: { attributeName: "BldgLevel", value: 7 },
      },
    });
  });

  it("Selector should return the initial state", () => {
    const store = setupStore();
    const state = store.getState();
    expect(selectColorsByAttribute(state)).toEqual(null);
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
      setColorsByAttrubute({
        attributeName: "HEIGHTROOF",
        minValue: 0,
        maxValue: 100,
        minColor: [146, 146, 252, 255],
        maxColor: [44, 44, 175, 255],
        mode: "replace",
      })
    );

    const state = store.getState();
    expect(selectColorsByAttribute(state)).toEqual({
      attributeName: "HEIGHTROOF",
      minValue: 0,
      maxValue: 100,
      minColor: [146, 146, 252, 255],
      maxColor: [44, 44, 175, 255],
      mode: "replace",
    });

    store.dispatch(
      setFiltersByAttrubute({
        filter: { attributeName: "testAttr", value: 3 },
      })
    );
    const state2 = store.getState();
    expect(selectFiltersByAttribute(state2)).toEqual({
      attributeName: "testAttr",
      value: 3,
    });

    store.dispatch(
      setFiltersByAttrubute({
        filter: { attributeName: "testAttr2", value: 5 },
        side: ComparisonSideMode.left,
      })
    );
    const state3 = store.getState();
    expect(selectFiltersByAttribute(state3, ComparisonSideMode.left)).toEqual({
      attributeName: "testAttr2",
      value: 5,
    });

    store.dispatch(
      setFiltersByAttrubute({
        filter: { attributeName: "testAttr3", value: 7 },
        side: ComparisonSideMode.right,
      })
    );
    const state4 = store.getState();
    expect(selectFiltersByAttribute(state4, ComparisonSideMode.right)).toEqual({
      attributeName: "testAttr3",
      value: 7,
    });
  });
});
