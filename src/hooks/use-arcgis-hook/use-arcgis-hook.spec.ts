import { useArcgis } from "./use-arcgis-hook";

jest.mock("./use-arcgis-hook", () => {
  return {
    useArcgis: jest.fn().mockImplementation(() => null),
  };
});

describe("ArcGis Hook", () => {
  it("Should be able to call ArcGis hook", async () => {
    expect(useArcgis({ current: null }, null, null)).toBeCalled;
  });
});
