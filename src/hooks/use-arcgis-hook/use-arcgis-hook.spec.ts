import { renderHook } from "@testing-library/react-hooks";
import { loadArcGISModules } from "@deck.gl/arcgis";
import { useArcgis } from "./use-arcgis-hook";

jest.mock("@deck.gl/arcgis", () => {
  return {
    loadArcGISModules: jest.fn().mockReturnValue(Promise.resolve({})),
  };
});

describe("ArcGis Hook", () => {
  it("Should be able to call ArcGis hook", async () => {
    const hook = renderHook(() =>
      useArcgis(
        { current: null },
        { main: { longitude: 1, latitude: 2, pitch: 3, bearing: 4, zoom: 5 } },
        null
      )
    );
    const renderer = hook.result.current;
    expect(renderer).toBeNull();
    expect(loadArcGISModules).not.toHaveBeenCalled();
  });
});
