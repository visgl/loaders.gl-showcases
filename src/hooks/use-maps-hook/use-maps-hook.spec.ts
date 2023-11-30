import { UseMapsWrapper } from "../use-maps-hook/use-maps-hook";
import { useArcgis } from "../../hooks/use-arcgis-hook/use-arcgis-hook";
import { ArcgisWrapper } from "../../components/arcgis-wrapper/arcgis-wrapper";
import { DeckGlWrapper } from "../../components/deck-gl-wrapper/deck-gl-wrapper";

jest.mock("../use-maps-hook/use-maps-hook", () => {
  return {
    UseMapsWrapper: jest.fn().mockImplementation(() => null),
  };
});
jest.mock("../../components/arcgis-wrapper/arcgis-wrapper", () => {
  return {
    ArcgisWrapper: jest.fn().mockImplementation(() => null),
  };
});
jest.mock("../../hooks/use-arcgis-hook/use-arcgis-hook", () => {
  return {
    useArcgis: jest.fn().mockImplementation(() => null),
  };
});
jest.mock("../../components/deck-gl-wrapper/deck-gl-wrapper", () => {
  return {
    DeckGlWrapper: jest.fn().mockImplementation(() => null),
  };
});

describe("Maps Hook", () => {
  it("ArcgisWrapper should be able to call UseMapsWrapper", async () => {
    ArcgisWrapper({});
    expect(UseMapsWrapper).toBeCalled;
  });
  it("ArcgisWrapper should be able to call useArcgis", async () => {
    ArcgisWrapper({});
    expect(useArcgis).toBeCalled;
  });
  it("DeckGL wrapper should be able to call UseMapsWrapper", async () => {
    DeckGlWrapper({});
    expect(UseMapsWrapper({})).toBeCalled;
  });
  it("UseMapsWrapper should be able to return result", async () => {
    const result = UseMapsWrapper({});
    expect(result).toEqual(null);
  });
});
