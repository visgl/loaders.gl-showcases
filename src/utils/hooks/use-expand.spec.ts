import { useExpand } from "./use-expand";
import { ExpandState } from "../../types";
import { renderHook } from "@testing-library/react-hooks";

describe("Use expand", () => {
  it("Should change state", () => {
    const expandHook = renderHook(() => useExpand(ExpandState.expanded));
    const [expandState, expand] = expandHook.result.current;
    expect(expandState).toEqual(ExpandState.expanded);

    expand();

    const [expandState2] = expandHook.result.current;
    expect(expandState2).toEqual(ExpandState.collapsed);
  });
});
