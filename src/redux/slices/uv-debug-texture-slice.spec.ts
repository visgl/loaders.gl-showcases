import { load } from "@loaders.gl/core";
import { setupStore } from "../store";
import {
  fetchUVDebugTexture,
  selectUVDebugTexture,
  initTextures,
} from "./uv-debug-texture-slice";

jest.mock("@loaders.gl/core");

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
    expect(selectUVDebugTexture("uv1")(state)).toEqual(null);

    await store.dispatch(initTextures());
    await store.dispatch(fetchUVDebugTexture("uv1"));

    expect(load).toHaveBeenCalledTimes(1);

    const newState = store.getState();
    expect(selectUVDebugTexture("uv1")(newState)).toEqual(imageStubObject);
  });
});
