import { ComparisonSideMode, TilesetType } from "../../types";
import reducer, {
  getFlattenedSublayers,
  selectLayers,
  selectLeftLayers,
  selectLeftSublayers,
  selectRightLayers,
  selectRightSublayers,
  selectSublayers,
  setFlattenedSublayers,
  updateLayerVisibility,
} from "./flattened-sublayers-slice";
import { flattenedSublayersState } from "./flattened-sublayers-slice";
import { load } from "@loaders.gl/core";
import { setupStore } from "../store";
import {
  bslNoSublayersTestTileset,
  bslTestTileset,
  expectedBSLLayers,
  expectedBSLSubLayers,
  expectedOverviewLayers,
  expectedOverviewSubLayers,
  wslExpectedLayers,
  wslTestTileset,
} from "./test-data/fluttened-sublayers-slice-test-data";

jest.mock("@loaders.gl/core");
jest.mock("@loaders.gl/i3s", () => {
  return jest.fn().mockImplementation(() => {
    return null;
  });
});

const previousState: flattenedSublayersState = {
  single: {
    layers: [
      {
        id: 1,
        name: "LightingFixtures",
        layerType: "3DObject",
        url: "https://testurl1",
        visibility: true,
        type: TilesetType.I3S,
      },
    ],
    layerCounter: 1,
    sublayers: [],
  },
  left: {
    layers: [
      {
        id: 2,
        name: "LightingFixtures",
        layerType: "3DObject",
        url: "https://testurl2",
        visibility: true,
        type: TilesetType.I3S,
      },
    ],
    layerCounter: 1,
    sublayers: [],
  },
  right: {
    layers: [
      {
        id: 3,
        name: "LightingFixtures",
        layerType: "3DObject",
        url: "https://testurl3",
        visibility: true,
        type: TilesetType.I3S,
      },
    ],
    layerCounter: 1,
    sublayers: [],
  },
};

describe("slice: flattened-sublayers", () => {
  it("Reducer should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual({
      single: { layers: [], layerCounter: 0, sublayers: [] },
      left: { layers: [], layerCounter: 0, sublayers: [] },
      right: { layers: [], layerCounter: 0, sublayers: [] },
    });
  });

  it("Reducer setFlattenedSublayers should handle re-setting layers", () => {
    expect(
      reducer(
        previousState,
        setFlattenedSublayers({
          layers: [],
        })
      )
    ).toEqual({
      single: { layers: [], layerCounter: 2, sublayers: [] },
      left: previousState.left,
      right: previousState.right,
    });

    expect(
      reducer(
        previousState,
        setFlattenedSublayers({
          layers: [],
          side: ComparisonSideMode.left,
        })
      )
    ).toEqual({
      single: previousState.single,
      left: { layers: [], layerCounter: 2, sublayers: [] },
      right: previousState.right,
    });

    expect(
      reducer(
        previousState,
        setFlattenedSublayers({
          layers: [],
          side: ComparisonSideMode.right,
        })
      )
    ).toEqual({
      single: previousState.single,
      left: previousState.left,
      right: { layers: [], layerCounter: 2, sublayers: [] },
    });
  });

  it("Reducer updateLayerVisibility should handle incorrect index layer", () => {
    const index = -1;
    expect(
      reducer(
        previousState,
        updateLayerVisibility({
          index: index,
          visibility: false,
        })
      )
    ).toEqual(previousState);
  });

  it("Reducer updateLayerVisibility should handle changing visibility layers", () => {
    const index = 0;
    expect(
      reducer(
        previousState,
        updateLayerVisibility({
          index: index,
          visibility: false,
        })
      )
    ).toEqual({
      single: {
        layers: [{ ...previousState.single.layers[index], visibility: false }],
        layerCounter: 1,
        sublayers: [],
      },
      left: previousState.left,
      right: previousState.right,
    });

    expect(
      reducer(
        previousState,
        updateLayerVisibility({
          index: index,
          visibility: false,
          side: ComparisonSideMode.left,
        })
      )
    ).toEqual({
      single: previousState.single,
      left: {
        layers: [{ ...previousState.left.layers[index], visibility: false }],
        layerCounter: 1,
        sublayers: [],
      },
      right: previousState.right,
    });

    expect(
      reducer(
        previousState,
        updateLayerVisibility({
          index: index,
          visibility: false,
          side: ComparisonSideMode.right,
        })
      )
    ).toEqual({
      single: previousState.single,
      left: previousState.left,
      right: {
        layers: [{ ...previousState.right.layers[index], visibility: false }],
        layerCounter: 1,
        sublayers: [],
      },
    });
  });

  it("getFlattenedSublayers should call mocked layers loading and put layers into the slice state", async () => {
    (load as unknown as jest.Mock<any>).mockRejectedValue("Error");

    const store = setupStore();
    const state = store.getState();
    expect(selectLayers(state)).toEqual([]);
    expect(selectLeftLayers(state)).toEqual([]);
    expect(selectRightLayers(state)).toEqual([]);

    const tilesetsData = [
      {
        hasChildren: false,
        id: "test_id_single",
        type: TilesetType.I3S,
        url: "https://testurl",
      },
    ];

    await store.dispatch(
      getFlattenedSublayers({ tilesetsData, buildingExplorerOpened: false })
    );
    const newSingleState = store.getState();
    expect(selectLayers(newSingleState)).toEqual([
      {
        id: "test_id_single",
        type: TilesetType.I3S,
        visibility: true,
        url: "https://testurl",
      },
    ]);
    expect(selectSublayers(newSingleState)).toEqual([]);
    expect(newSingleState.flattenedSublayers.single.layerCounter).toEqual(1);

    tilesetsData[0]["id"] = "test_id_left";
    await store.dispatch(
      getFlattenedSublayers({
        tilesetsData,
        buildingExplorerOpened: false,
        side: ComparisonSideMode.left,
      })
    );

    const newLeftState = store.getState();
    expect(selectLeftLayers(newLeftState)).toEqual([
      {
        id: "test_id_left",
        type: TilesetType.I3S,
        visibility: true,
        url: "https://testurl",
      },
    ]);
    expect(selectLeftSublayers(newLeftState)).toEqual([]);
    expect(newLeftState.flattenedSublayers.left.layerCounter).toEqual(1);

    tilesetsData[0]["id"] = "test_id_right";
    await store.dispatch(
      getFlattenedSublayers({
        tilesetsData,
        buildingExplorerOpened: false,
        side: ComparisonSideMode.right,
      })
    );

    const newRightState = store.getState();
    expect(selectRightLayers(newRightState)).toEqual([
      {
        id: "test_id_right",
        type: TilesetType.I3S,
        visibility: true,
        url: "https://testurl",
      },
    ]);
    expect(selectRightSublayers(newRightState)).toEqual([]);
    expect(newRightState.flattenedSublayers.right.layerCounter).toEqual(1);
  });

  it("getFlattenedSublayers should call mocked layers loading for BSL dataset and put overview layers and sublayers into the slice state", async () => {
    (load as unknown as jest.Mock<any>).mockReturnValue(
      Promise.resolve(bslTestTileset)
    );

    const store = setupStore();
    const state = store.getState();
    expect(selectLayers(state)).toEqual([]);

    const tilesetsData = [
      {
        hasChildren: false,
        id: "testBSL_id",
        type: TilesetType.I3S,
        url: "https://testurl",
      },
    ];

    await store.dispatch(
      getFlattenedSublayers({ tilesetsData, buildingExplorerOpened: false })
    );

    const newSingleState = store.getState();
    expect(selectLayers(newSingleState)).toEqual(expectedOverviewLayers);
    expect(selectSublayers(newSingleState)).toEqual(expectedOverviewSubLayers);
    expect(newSingleState.flattenedSublayers.single.layerCounter).toEqual(1);
  });

  it("getFlattenedSublayers should call mocked layers loading and put BSL layers and sublayers into the slice state", async () => {
    (load as unknown as jest.Mock<any>).mockReturnValue(
      Promise.resolve(bslTestTileset)
    );

    const store = setupStore();
    const state = store.getState();
    expect(selectLayers(state)).toEqual([]);

    const tilesetsData = [
      {
        hasChildren: false,
        id: "testBSL_id",
        type: TilesetType.I3S,
        url: "https://testurl",
      },
    ];

    await store.dispatch(
      getFlattenedSublayers({ tilesetsData, buildingExplorerOpened: true })
    );

    const newSingleState = store.getState();
    expect(selectLayers(newSingleState)).toEqual(expectedBSLLayers);
    expect(selectSublayers(newSingleState)).toEqual(expectedBSLSubLayers);
    expect(newSingleState.flattenedSublayers.single.layerCounter).toEqual(1);
  });

  it("getFlattenedSublayers should call mocked layers loading and handle case if there are no sublayers in the header", async () => {
    (load as unknown as jest.Mock<any>).mockReturnValue(
      Promise.resolve(bslNoSublayersTestTileset)
    );

    const store = setupStore();
    const state = store.getState();
    expect(selectLayers(state)).toEqual([]);

    const tilesetsData = [
      {
        hasChildren: false,
        id: "testBSL_id",
        type: TilesetType.I3S,
        url: "https://testurl",
      },
    ];

    await store.dispatch(
      getFlattenedSublayers({ tilesetsData, buildingExplorerOpened: true })
    );

    const newSingleState = store.getState();
    expect(selectSublayers(newSingleState)).toEqual([]);
    expect(newSingleState.flattenedSublayers.single.layerCounter).toEqual(1);
  });

  it("getFlattenedSublayers should call mocked layers loading and put Web Scene Layers into the slice state", async () => {
    (load as unknown as jest.Mock<any>)
      .mockReturnValueOnce("First")
      .mockRejectedValueOnce("Second")
      .mockRejectedValueOnce("Third");

    const store = setupStore();
    const state = store.getState();
    expect(selectLayers(state)).toEqual([]);

    const tilesetsData = wslTestTileset;

    await store.dispatch(
      getFlattenedSublayers({ tilesetsData, buildingExplorerOpened: false })
    );

    const newSingleState = store.getState();
    expect(selectLayers(newSingleState)).toEqual(wslExpectedLayers);
    expect(selectSublayers(newSingleState)).toEqual([]);
    expect(newSingleState.flattenedSublayers.single.layerCounter).toEqual(1);
  });
});
