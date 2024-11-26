import { load } from "@loaders.gl/core";
import { setupStore } from "../store";
import {
  fetchUVDebugTexture,
  selectUVDebugTexture,
} from "./uv-debug-texture-slice";
import { ImageLoader } from "@loaders.gl/images";

jest.mock("@loaders.gl/core");
jest.mock("@loaders.gl/i3s", () => {
  return jest.fn().mockImplementation(() => {
    return null;
  });
});

const imageStubObject = { width: 1024, height: 1024, data: new ArrayBuffer(0) };

(load as unknown as jest.Mock<any>).mockReturnValue(
  Promise.resolve(imageStubObject)
);

describe("slice: uv-debug-texture", () => {
  it("Selector should return the initial state", () => {
    const store = setupStore();
    const state = store.getState();
    expect(selectUVDebugTexture("")(state)).toEqual(null);
  });

  it("fetchUVDebugTexture should call loading mocked texture and put it into the slice state", async () => {
    const store = setupStore();
    const state = store.getState();
    const imageUrl = "https://localhost:3000/images/uvTexture1.png";
    expect(selectUVDebugTexture(imageUrl)(state)).toEqual(null);

    await store.dispatch(fetchUVDebugTexture(imageUrl));

    expect(load).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledWith(imageUrl, ImageLoader);

    const newState = store.getState();
    expect(selectUVDebugTexture(imageUrl)(newState)).toEqual(imageStubObject);
  });
});
