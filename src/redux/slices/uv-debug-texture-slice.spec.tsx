import { load } from "@loaders.gl/core";
import { setupStore } from "../store";
import {
  fetchUVDebugTexture,
  selectUVDebugTexture,
} from "./uv-debug-texture-slice";
import { ImageLoader } from "@loaders.gl/images";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

jest.mock("@loaders.gl/core");

const imageStubObject = { width: 1024, height: 1024, data: new ArrayBuffer(0) };

(load as unknown as jest.Mock<any>).mockReturnValue(
  Promise.resolve(imageStubObject)
);

it("Selector should return the initial state", () => {
  const store = setupStore();
  const state = store.getState();
  expect(selectUVDebugTexture(state)).toEqual(null);
});

it("fetchUVDebugTexture should call loading mocked texture and put it into the slice state", async () => {
  const store = setupStore();
  const state = store.getState();
  expect(selectUVDebugTexture(state)).toEqual(null);

  store.dispatch(fetchUVDebugTexture());
  expect(load).toHaveBeenCalledWith(
    "https://raw.githubusercontent.com/visgl/deck.gl-data/master/images/uv-debug-texture.jpg",
    ImageLoader
  );
  await sleep(100);
  const newState = store.getState();
  expect(selectUVDebugTexture(newState)).toEqual(imageStubObject);
});
