import { useDeckGl } from "./use-deckgl-hook";

jest.mock("./use-deckgl-hook", () => {
  return {
    useDeckGl: jest.fn().mockImplementation(() => null),
  };
});

describe("DeckGl Hook", () => {
  it("Should be able to call DeckGl hook", async () => {
    expect(useDeckGl(null, null, null, null, null)).toBeCalled;
  });
});
