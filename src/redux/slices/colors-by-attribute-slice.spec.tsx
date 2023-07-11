import { setupStore } from "../store";
import reducer, {
  ColorsByAttributeState,
  selectColorsByAttribute,
  setColorsByAttrubute,
} from "./colors-by-attribute-slice";

it("Reducer should return the initial state", () => {
  expect(reducer(undefined, { type: undefined })).toEqual({ value: null });
});

it("Reducer setColorsByAttrubute should handle setting colors by attribute", () => {
  const previousState: ColorsByAttributeState = { value: null };

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
    value: {
      attributeName: "HEIGHTROOF",
      minValue: 0,
      maxValue: 100,
      minColor: [146, 146, 252, 255],
      maxColor: [44, 44, 175, 255],
      mode: "replace",
    },
  });
});

it("Selector should return the initial state", () => {
  const store = setupStore();
  const state = store.getState();
  expect(selectColorsByAttribute(state)).toEqual(null);
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
});
