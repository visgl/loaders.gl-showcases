import { fetchFile } from "@loaders.gl/core";
import { FetchingStatus, TilesetType } from "../../types";
import { setupStore } from "../store";
import reducer, {
  getLayerNameInfo,
  selectLayerNames,
} from "./layer-names-slice";

jest.mock("@loaders.gl/core");

describe("slice: layer-names", () => {
  it("Reducer should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual({
      map: {},
    });
  });

  it("getLayerNameInfo should put layer name and status to the state", async () => {
    (fetchFile as unknown as jest.Mock<any>).mockReturnValue(
      new Promise((resolve) => {
        resolve({
          text: async () =>
            JSON.stringify({
              name: "testName",
            }),
        });
      })
    );
    const store = setupStore();
    await store.dispatch(
      getLayerNameInfo({
        layerUrl: "https://testUrl",
        token: "testToken",
        type: TilesetType.I3S,
      })
    );
    const state = store.getState();
    expect(state.layerNames).toEqual({
      map: {
        "https://testUrl": {
          name: "testName",
          status: FetchingStatus.ready,
        },
      },
    });
    //test selector
    expect(selectLayerNames(state)).toEqual({
      "https://testUrl": {
        name: "testName",
        status: FetchingStatus.ready,
      },
    });
  });

  it("getLayerNameInfo should put layer empty name and status to the state for no name", async () => {
    (fetchFile as unknown as jest.Mock<any>).mockReturnValue(
      new Promise((resolve) => {
        resolve({
          text: async () =>
            JSON.stringify({
              noname: "No Name in the layer",
            }),
        });
      })
    );
    const store = setupStore();
    await store.dispatch(
      getLayerNameInfo({
        layerUrl: "https://testUrl",
        token: "testToken",
        type: TilesetType.I3S,
      })
    );
    const state = store.getState();
    expect(state.layerNames).toEqual({
      map: {
        "https://testUrl": {
          name: "",
          status: FetchingStatus.ready,
        },
      },
    });
  });

  it("getLayerNameInfo should put layer empty name and status ready in case of rejected fetching", async () => {
    (fetchFile as unknown as jest.Mock<any>).mockRejectedValue("Error");
    const store = setupStore();
    await store.dispatch(
      getLayerNameInfo({
        layerUrl: "https://testUrl",
        token: "testToken",
        type: TilesetType.I3S,
      })
    );
    const state = store.getState();
    expect(state.layerNames).toEqual({
      map: {
        "https://testUrl": {
          name: "",
          status: FetchingStatus.ready,
        },
      },
    });
  });
});
