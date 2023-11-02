import { DragMode } from "../../types";
import { setupStore } from "../store";
import reducer, {
  DragModeState,
  selectDragMode,
  setDragMode,
} from "./drag-mode-slice";
jest.mock("@loaders.gl/i3s", () => ({
  load: jest.fn(),
}));
describe("slice: drag-mode", () => {
  it("Reducer should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual({
      value: DragMode.pan,
    });
  });

  it("Reducer setDragMode should handle setting dragMode", () => {
    const previousState: DragModeState = { value: DragMode.pan };

    expect(reducer(previousState, setDragMode(DragMode.rotate))).toEqual({
      value: DragMode.rotate,
    });
  });

  it("Selector should return the initial state", () => {
    const store = setupStore();
    const state = store.getState();
    expect(selectDragMode(state)).toEqual(DragMode.pan);
  });

  it("Selector should return the updated value", () => {
    const store = setupStore();

    store.dispatch(setDragMode(DragMode.rotate));

    const state = store.getState();
    expect(selectDragMode(state)).toEqual(DragMode.rotate);
  });
});
