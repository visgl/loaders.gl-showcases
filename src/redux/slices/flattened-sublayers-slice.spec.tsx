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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

jest.mock("@loaders.gl/core");

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
      token: undefined,
      type: TilesetType.I3S,
      url: "https://testurl",
    },
  ];

  store.dispatch(
    getFlattenedSublayers({ tilesetsData, buildingExplorerOpened: false })
  );
  await sleep(100);
  const newSingleState = store.getState();
  expect(selectLayers(newSingleState)).toEqual([
    {
      id: "test_id_single",
      type: TilesetType.I3S,
      token: undefined,
      visibility: true,
      url: "https://testurl",
    },
  ]);
  expect(selectSublayers(newSingleState)).toEqual([]);
  expect(newSingleState.flattenedSublayers.single.layerCounter).toEqual(1);

  tilesetsData[0]["id"] = "test_id_left";
  store.dispatch(
    getFlattenedSublayers({
      tilesetsData,
      buildingExplorerOpened: false,
      side: ComparisonSideMode.left,
    })
  );
  await sleep(100);
  const newLeftState = store.getState();
  expect(selectLeftLayers(newLeftState)).toEqual([
    {
      id: "test_id_left",
      type: TilesetType.I3S,
      token: undefined,
      visibility: true,
      url: "https://testurl",
    },
  ]);
  expect(selectLeftSublayers(newLeftState)).toEqual([]);
  expect(newLeftState.flattenedSublayers.left.layerCounter).toEqual(1);

  tilesetsData[0]["id"] = "test_id_right";
  store.dispatch(
    getFlattenedSublayers({
      tilesetsData,
      buildingExplorerOpened: false,
      side: ComparisonSideMode.right,
    })
  );
  await sleep(100);
  const newRightState = store.getState();
  expect(selectRightLayers(newRightState)).toEqual([
    {
      id: "test_id_right",
      token: undefined,
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
      token: undefined,
      type: TilesetType.I3S,
      url: "https://testurl",
    },
  ];

  store.dispatch(
    getFlattenedSublayers({ tilesetsData, buildingExplorerOpened: false })
  );
  await sleep(100);
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
      token: undefined,
      type: TilesetType.I3S,
      url: "https://testurl",
    },
  ];

  store.dispatch(
    getFlattenedSublayers({ tilesetsData, buildingExplorerOpened: true })
  );
  await sleep(100);
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
      token: undefined,
      type: TilesetType.I3S,
      url: "https://testurl",
    },
  ];

  store.dispatch(
    getFlattenedSublayers({ tilesetsData, buildingExplorerOpened: true })
  );
  await sleep(100);
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

  store.dispatch(
    getFlattenedSublayers({ tilesetsData, buildingExplorerOpened: false })
  );
  await sleep(100);
  const newSingleState = store.getState();
  expect(selectLayers(newSingleState)).toEqual(wslExpectedLayers);
  expect(selectSublayers(newSingleState)).toEqual([]);
  expect(newSingleState.flattenedSublayers.single.layerCounter).toEqual(1);
});

const bslTestTileset = {
  header: {
    id: 0,
    name: "NCL-AR-Building-RVT15",
    layerType: "Building",
    alias: "NCL-AR-Building-RVT15",
    spatialReference: {
      wkid: 4326,
      latestWkid: 4326,
      vcsWkid: 105790,
      latestVcsWkid: 3855,
    },
    fullExtent: {
      xmin: 172.63669613327883,
      ymin: -43.530260167108686,
      xmax: 172.63790902170498,
      ymax: -43.52988438496109,
      spatialReference: {
        wkid: 4326,
        latestWkid: 4326,
        vcsWkid: 105790,
        latestVcsWkid: 3855,
      },
      zmin: 2.3328642270168736,
      zmax: 35.37648257620536,
    },
    version: "1.6",
    sublayers: [
      {
        id: 200,
        layerType: "group",
        name: "Full Model",
        alias: "Full Model",
        modelName: "FullModel",
        visibility: false,
        sublayers: [
          {
            id: 210,
            layerType: "group",
            name: "Electrical",
            alias: "Electrical",
            modelName: "Electrical",
            visibility: false,
            sublayers: [
              {
                id: 23,
                layerType: "3DObject",
                name: "LightingFixtures",
                alias: "LightingFixtures",
                modelName: "LightingFixtures",
                discipline: "Electrical",
                visibility: true,
              },
              {
                id: 22,
                layerType: "3DObject",
                name: "ElectricalFixtures",
                alias: "ElectricalFixtures",
                modelName: "ElectricalFixtures",
                discipline: "Electrical",
                visibility: true,
              },
            ],
          },
          {
            id: 220,
            layerType: "group",
            name: "Structural",
            alias: "Structural",
            modelName: "Structural",
            visibility: false,
            sublayers: [
              {
                id: 21,
                layerType: "3DObject",
                name: "StructuralFraming",
                alias: "StructuralFraming",
                modelName: "StructuralFraming",
                discipline: "Structural",
                visibility: true,
              },
            ],
          },
          {
            id: 230,
            layerType: "group",
            name: "Architectural",
            alias: "Architectural",
            modelName: "Architectural",
            visibility: false,
            sublayers: [
              {
                id: 20,
                layerType: "3DObject",
                name: "Windows",
                alias: "Windows",
                modelName: "Windows",
                discipline: "Architectural",
                visibility: true,
              },
              {
                id: 19,
                layerType: "3DObject",
                name: "Walls",
                alias: "Walls",
                modelName: "Walls",
                discipline: "Architectural",
                visibility: true,
              },
              {
                id: 18,
                layerType: "3DObject",
                name: "StairsRailing",
                alias: "StairsRailing",
                modelName: "StairsRailing",
                discipline: "Architectural",
                visibility: true,
              },
              {
                id: 17,
                layerType: "3DObject",
                name: "Stairs",
                alias: "Stairs",
                modelName: "Stairs",
                discipline: "Architectural",
                visibility: true,
              },
              {
                id: 16,
                layerType: "3DObject",
                name: "SpecialtyEquipment",
                alias: "SpecialtyEquipment",
                modelName: "SpecialtyEquipment",
                discipline: "Architectural",
                visibility: true,
              },
              {
                id: 15,
                layerType: "3DObject",
                name: "Site",
                alias: "Site",
                modelName: "Site",
                discipline: "Architectural",
                visibility: false,
              },
              {
                id: 14,
                layerType: "3DObject",
                name: "Roofs",
                alias: "Roofs",
                modelName: "Roofs",
                discipline: "Architectural",
                visibility: true,
              },
              {
                id: 13,
                layerType: "3DObject",
                name: "PlumbingFixtures",
                alias: "PlumbingFixtures",
                modelName: "PlumbingFixtures",
                discipline: "Architectural",
                visibility: false,
              },
              {
                id: 12,
                layerType: "3DObject",
                name: "Parking",
                alias: "Parking",
                modelName: "Parking",
                discipline: "Architectural",
                visibility: true,
              },
              {
                id: 11,
                layerType: "Point",
                name: "LocationPoints",
                alias: "LocationPoints",
                modelName: "LocationPoints",
                discipline: "Architectural",
                visibility: false,
              },
              {
                id: 10,
                layerType: "3DObject",
                name: "GenericModel",
                alias: "GenericModel",
                modelName: "GenericModel",
                discipline: "Architectural",
                visibility: true,
              },
              {
                id: 9,
                layerType: "3DObject",
                name: "FurnitureSystems",
                alias: "FurnitureSystems",
                modelName: "FurnitureSystems",
                discipline: "Architectural",
                visibility: true,
              },
              {
                id: 8,
                layerType: "3DObject",
                name: "Furniture",
                alias: "Furniture",
                modelName: "Furniture",
                discipline: "Architectural",
                visibility: true,
              },
              {
                id: 7,
                layerType: "3DObject",
                name: "Floors",
                alias: "Floors",
                modelName: "Floors",
                discipline: "Architectural",
                visibility: true,
              },
              {
                id: 6,
                layerType: "3DObject",
                name: "Entourage",
                alias: "Entourage",
                modelName: "Entourage",
                discipline: "Architectural",
                visibility: false,
              },
              {
                id: 5,
                layerType: "3DObject",
                name: "Doors",
                alias: "Doors",
                modelName: "Doors",
                discipline: "Architectural",
                visibility: true,
              },
              {
                id: 4,
                layerType: "3DObject",
                name: "CurtainWallPanels",
                alias: "CurtainWallPanels",
                modelName: "CurtainWallPanels",
                discipline: "Architectural",
                visibility: true,
              },
              {
                id: 3,
                layerType: "3DObject",
                name: "CurtainWallMullions",
                alias: "CurtainWallMullions",
                modelName: "CurtainWallMullions",
                discipline: "Architectural",
                visibility: true,
              },
              {
                id: 2,
                layerType: "3DObject",
                name: "Ceilings",
                alias: "Ceilings",
                modelName: "Ceilings",
                discipline: "Architectural",
                visibility: true,
              },
              {
                id: 1,
                layerType: "3DObject",
                name: "Casework",
                alias: "Casework",
                modelName: "Casework",
                discipline: "Architectural",
                visibility: true,
              },
            ],
          },
        ],
      },
      {
        id: 0,
        layerType: "3DObject",
        name: "Overview",
        alias: "Overview",
        modelName: "Overview",
        visibility: true,
      },
    ],
    statisticsHRef: "./statistics/summary",
  },
  sublayers: [
    {
      url: "https://testurl/23",
      id: 23,
      layerType: "3DObject",
      visibility: true,
      name: "LightingFixtures",
      alias: "LightingFixtures",
      modelName: "LightingFixtures",
      discipline: "Electrical",
    },
    {
      url: "https://testurl/22",
      id: 22,
      layerType: "3DObject",
      visibility: true,
      name: "ElectricalFixtures",
      alias: "ElectricalFixtures",
      modelName: "ElectricalFixtures",
      discipline: "Electrical",
    },
    {
      url: "https://testurl/21",
      id: 21,
      layerType: "3DObject",
      visibility: true,
      name: "StructuralFraming",
      alias: "StructuralFraming",
      modelName: "StructuralFraming",
      discipline: "Structural",
    },
    {
      url: "https://testurl/20",
      id: 20,
      layerType: "3DObject",
      visibility: true,
      name: "Windows",
      alias: "Windows",
      modelName: "Windows",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/19",
      id: 19,
      layerType: "3DObject",
      visibility: true,
      name: "Walls",
      alias: "Walls",
      modelName: "Walls",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/18",
      id: 18,
      layerType: "3DObject",
      visibility: true,
      name: "StairsRailing",
      alias: "StairsRailing",
      modelName: "StairsRailing",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/17",
      id: 17,
      layerType: "3DObject",
      visibility: true,
      name: "Stairs",
      alias: "Stairs",
      modelName: "Stairs",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/16",
      id: 16,
      layerType: "3DObject",
      visibility: true,
      name: "SpecialtyEquipment",
      alias: "SpecialtyEquipment",
      modelName: "SpecialtyEquipment",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/15",
      id: 15,
      layerType: "3DObject",
      visibility: false,
      name: "Site",
      alias: "Site",
      modelName: "Site",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/14",
      id: 14,
      layerType: "3DObject",
      visibility: true,
      name: "Roofs",
      alias: "Roofs",
      modelName: "Roofs",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/13",
      id: 13,
      layerType: "3DObject",
      visibility: false,
      name: "PlumbingFixtures",
      alias: "PlumbingFixtures",
      modelName: "PlumbingFixtures",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/12",
      id: 12,
      layerType: "3DObject",
      visibility: true,
      name: "Parking",
      alias: "Parking",
      modelName: "Parking",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/10",
      id: 10,
      layerType: "3DObject",
      visibility: true,
      name: "GenericModel",
      alias: "GenericModel",
      modelName: "GenericModel",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/9",
      id: 9,
      layerType: "3DObject",
      visibility: true,
      name: "FurnitureSystems",
      alias: "FurnitureSystems",
      modelName: "FurnitureSystems",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/8",
      id: 8,
      layerType: "3DObject",
      visibility: true,
      name: "Furniture",
      alias: "Furniture",
      modelName: "Furniture",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/7",
      id: 7,
      layerType: "3DObject",
      visibility: true,
      name: "Floors",
      alias: "Floors",
      modelName: "Floors",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/6",
      id: 6,
      layerType: "3DObject",
      visibility: false,
      name: "Entourage",
      alias: "Entourage",
      modelName: "Entourage",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/5",
      id: 5,
      layerType: "3DObject",
      visibility: true,
      name: "Doors",
      alias: "Doors",
      modelName: "Doors",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/4",
      id: 4,
      layerType: "3DObject",
      visibility: true,
      name: "CurtainWallPanels",
      alias: "CurtainWallPanels",
      modelName: "CurtainWallPanels",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/3",
      id: 3,
      layerType: "3DObject",
      visibility: true,
      name: "CurtainWallMullions",
      alias: "CurtainWallMullions",
      modelName: "CurtainWallMullions",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/2",
      id: 2,
      layerType: "3DObject",
      visibility: true,
      name: "Ceilings",
      alias: "Ceilings",
      modelName: "Ceilings",
      discipline: "Architectural",
    },
    {
      url: "https://testurl/1",
      id: 1,
      layerType: "3DObject",
      visibility: true,
      name: "Casework",
      alias: "Casework",
      modelName: "Casework",
      discipline: "Architectural",
    },
    {
      url: "https://testurl",
      id: 0,
      layerType: "3DObject",
      visibility: true,
      name: "Overview",
      alias: "Overview",
      modelName: "Overview",
    },
  ],
};

const bslNoSublayersTestTileset = {
  header: {
    id: 0,
    name: "NCL-AR-Building-RVT15",
    layerType: "Building",
    alias: "NCL-AR-Building-RVT15",
    spatialReference: {
      wkid: 4326,
      latestWkid: 4326,
      vcsWkid: 105790,
      latestVcsWkid: 3855,
    },
    fullExtent: {
      xmin: 172.63669613327883,
      ymin: -43.530260167108686,
      xmax: 172.63790902170498,
      ymax: -43.52988438496109,
      spatialReference: {
        wkid: 4326,
        latestWkid: 4326,
        vcsWkid: 105790,
        latestVcsWkid: 3855,
      },
      zmin: 2.3328642270168736,
      zmax: 35.37648257620536,
    },
    version: "1.6",
    sublayers: [
      {
        id: 200,
        layerType: "group",
        name: "Full Model",
        alias: "Full Model",
        modelName: "FullModel",
        visibility: false,
        sublayers: [],
      },
      {
        id: 0,
        layerType: "3DObject",
        name: "Overview",
        alias: "Overview",
        modelName: "Overview",
        visibility: true,
      },
    ],
    statisticsHRef: "./statistics/summary",
  },
  sublayers: [
    {
      url: "https://testurl",
      id: 0,
      layerType: "3DObject",
      visibility: true,
      name: "Overview",
      alias: "Overview",
      modelName: "Overview",
    },
  ],
};

const expectedOverviewLayers = [
  {
    url: "https://testurl",
    id: 0,
    layerType: "3DObject",
    visibility: true,
    name: "Overview",
    alias: "Overview",
    modelName: "Overview",
  },
];

const expectedOverviewSubLayers = [
  {
    id: 210,
    layerType: "group",
    name: "Electrical",
    alias: "Electrical",
    modelName: "Electrical",
    visibility: false,
    sublayers: [
      {
        id: 23,
        layerType: "3DObject",
        name: "LightingFixtures",
        alias: "LightingFixtures",
        modelName: "LightingFixtures",
        discipline: "Electrical",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 22,
        layerType: "3DObject",
        name: "ElectricalFixtures",
        alias: "ElectricalFixtures",
        modelName: "ElectricalFixtures",
        discipline: "Electrical",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
    ],
    expanded: false,
    childNodesCount: 2,
  },
  {
    id: 220,
    layerType: "group",
    name: "Structural",
    alias: "Structural",
    modelName: "Structural",
    visibility: false,
    sublayers: [
      {
        id: 21,
        layerType: "3DObject",
        name: "StructuralFraming",
        alias: "StructuralFraming",
        modelName: "StructuralFraming",
        discipline: "Structural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
    ],
    expanded: false,
    childNodesCount: 1,
  },
  {
    id: 230,
    layerType: "group",
    name: "Architectural",
    alias: "Architectural",
    modelName: "Architectural",
    visibility: false,
    sublayers: [
      {
        id: 20,
        layerType: "3DObject",
        name: "Windows",
        alias: "Windows",
        modelName: "Windows",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 19,
        layerType: "3DObject",
        name: "Walls",
        alias: "Walls",
        modelName: "Walls",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 18,
        layerType: "3DObject",
        name: "StairsRailing",
        alias: "StairsRailing",
        modelName: "StairsRailing",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 17,
        layerType: "3DObject",
        name: "Stairs",
        alias: "Stairs",
        modelName: "Stairs",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 16,
        layerType: "3DObject",
        name: "SpecialtyEquipment",
        alias: "SpecialtyEquipment",
        modelName: "SpecialtyEquipment",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 15,
        layerType: "3DObject",
        name: "Site",
        alias: "Site",
        modelName: "Site",
        discipline: "Architectural",
        visibility: false,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 14,
        layerType: "3DObject",
        name: "Roofs",
        alias: "Roofs",
        modelName: "Roofs",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 13,
        layerType: "3DObject",
        name: "PlumbingFixtures",
        alias: "PlumbingFixtures",
        modelName: "PlumbingFixtures",
        discipline: "Architectural",
        visibility: false,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 12,
        layerType: "3DObject",
        name: "Parking",
        alias: "Parking",
        modelName: "Parking",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 11,
        layerType: "Point",
        name: "LocationPoints",
        alias: "LocationPoints",
        modelName: "LocationPoints",
        discipline: "Architectural",
        visibility: false,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 10,
        layerType: "3DObject",
        name: "GenericModel",
        alias: "GenericModel",
        modelName: "GenericModel",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 9,
        layerType: "3DObject",
        name: "FurnitureSystems",
        alias: "FurnitureSystems",
        modelName: "FurnitureSystems",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 8,
        layerType: "3DObject",
        name: "Furniture",
        alias: "Furniture",
        modelName: "Furniture",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 7,
        layerType: "3DObject",
        name: "Floors",
        alias: "Floors",
        modelName: "Floors",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 6,
        layerType: "3DObject",
        name: "Entourage",
        alias: "Entourage",
        modelName: "Entourage",
        discipline: "Architectural",
        visibility: false,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 5,
        layerType: "3DObject",
        name: "Doors",
        alias: "Doors",
        modelName: "Doors",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 4,
        layerType: "3DObject",
        name: "CurtainWallPanels",
        alias: "CurtainWallPanels",
        modelName: "CurtainWallPanels",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 3,
        layerType: "3DObject",
        name: "CurtainWallMullions",
        alias: "CurtainWallMullions",
        modelName: "CurtainWallMullions",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 2,
        layerType: "3DObject",
        name: "Ceilings",
        alias: "Ceilings",
        modelName: "Ceilings",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 1,
        layerType: "3DObject",
        name: "Casework",
        alias: "Casework",
        modelName: "Casework",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
    ],
    expanded: false,
    childNodesCount: 20,
  },
];

const expectedBSLLayers = [
  {
    url: "https://testurl/23",
    id: 23,
    layerType: "3DObject",
    visibility: true,
    name: "LightingFixtures",
    alias: "LightingFixtures",
    modelName: "LightingFixtures",
    discipline: "Electrical",
    type: "I3S",
  },
  {
    url: "https://testurl/22",
    id: 22,
    layerType: "3DObject",
    visibility: true,
    name: "ElectricalFixtures",
    alias: "ElectricalFixtures",
    modelName: "ElectricalFixtures",
    discipline: "Electrical",
    type: "I3S",
  },
  {
    url: "https://testurl/21",
    id: 21,
    layerType: "3DObject",
    visibility: true,
    name: "StructuralFraming",
    alias: "StructuralFraming",
    modelName: "StructuralFraming",
    discipline: "Structural",
    type: "I3S",
  },
  {
    url: "https://testurl/20",
    id: 20,
    layerType: "3DObject",
    visibility: true,
    name: "Windows",
    alias: "Windows",
    modelName: "Windows",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/19",
    id: 19,
    layerType: "3DObject",
    visibility: true,
    name: "Walls",
    alias: "Walls",
    modelName: "Walls",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/18",
    id: 18,
    layerType: "3DObject",
    visibility: true,
    name: "StairsRailing",
    alias: "StairsRailing",
    modelName: "StairsRailing",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/17",
    id: 17,
    layerType: "3DObject",
    visibility: true,
    name: "Stairs",
    alias: "Stairs",
    modelName: "Stairs",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/16",
    id: 16,
    layerType: "3DObject",
    visibility: true,
    name: "SpecialtyEquipment",
    alias: "SpecialtyEquipment",
    modelName: "SpecialtyEquipment",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/15",
    id: 15,
    layerType: "3DObject",
    visibility: false,
    name: "Site",
    alias: "Site",
    modelName: "Site",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/14",
    id: 14,
    layerType: "3DObject",
    visibility: true,
    name: "Roofs",
    alias: "Roofs",
    modelName: "Roofs",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/13",
    id: 13,
    layerType: "3DObject",
    visibility: false,
    name: "PlumbingFixtures",
    alias: "PlumbingFixtures",
    modelName: "PlumbingFixtures",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/12",
    id: 12,
    layerType: "3DObject",
    visibility: true,
    name: "Parking",
    alias: "Parking",
    modelName: "Parking",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/10",
    id: 10,
    layerType: "3DObject",
    visibility: true,
    name: "GenericModel",
    alias: "GenericModel",
    modelName: "GenericModel",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/9",
    id: 9,
    layerType: "3DObject",
    visibility: true,
    name: "FurnitureSystems",
    alias: "FurnitureSystems",
    modelName: "FurnitureSystems",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/8",
    id: 8,
    layerType: "3DObject",
    visibility: true,
    name: "Furniture",
    alias: "Furniture",
    modelName: "Furniture",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/7",
    id: 7,
    layerType: "3DObject",
    visibility: true,
    name: "Floors",
    alias: "Floors",
    modelName: "Floors",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/6",
    id: 6,
    layerType: "3DObject",
    visibility: false,
    name: "Entourage",
    alias: "Entourage",
    modelName: "Entourage",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/5",
    id: 5,
    layerType: "3DObject",
    visibility: true,
    name: "Doors",
    alias: "Doors",
    modelName: "Doors",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/4",
    id: 4,
    layerType: "3DObject",
    visibility: true,
    name: "CurtainWallPanels",
    alias: "CurtainWallPanels",
    modelName: "CurtainWallPanels",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/3",
    id: 3,
    layerType: "3DObject",
    visibility: true,
    name: "CurtainWallMullions",
    alias: "CurtainWallMullions",
    modelName: "CurtainWallMullions",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/2",
    id: 2,
    layerType: "3DObject",
    visibility: true,
    name: "Ceilings",
    alias: "Ceilings",
    modelName: "Ceilings",
    discipline: "Architectural",
    type: "I3S",
  },
  {
    url: "https://testurl/1",
    id: 1,
    layerType: "3DObject",
    visibility: true,
    name: "Casework",
    alias: "Casework",
    modelName: "Casework",
    discipline: "Architectural",
    type: "I3S",
  },
];

const expectedBSLSubLayers = [
  {
    id: 210,
    layerType: "group",
    name: "Electrical",
    alias: "Electrical",
    modelName: "Electrical",
    visibility: false,
    sublayers: [
      {
        id: 23,
        layerType: "3DObject",
        name: "LightingFixtures",
        alias: "LightingFixtures",
        modelName: "LightingFixtures",
        discipline: "Electrical",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 22,
        layerType: "3DObject",
        name: "ElectricalFixtures",
        alias: "ElectricalFixtures",
        modelName: "ElectricalFixtures",
        discipline: "Electrical",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
    ],
    expanded: false,
    childNodesCount: 2,
  },
  {
    id: 220,
    layerType: "group",
    name: "Structural",
    alias: "Structural",
    modelName: "Structural",
    visibility: false,
    sublayers: [
      {
        id: 21,
        layerType: "3DObject",
        name: "StructuralFraming",
        alias: "StructuralFraming",
        modelName: "StructuralFraming",
        discipline: "Structural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
    ],
    expanded: false,
    childNodesCount: 1,
  },
  {
    id: 230,
    layerType: "group",
    name: "Architectural",
    alias: "Architectural",
    modelName: "Architectural",
    visibility: false,
    sublayers: [
      {
        id: 20,
        layerType: "3DObject",
        name: "Windows",
        alias: "Windows",
        modelName: "Windows",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 19,
        layerType: "3DObject",
        name: "Walls",
        alias: "Walls",
        modelName: "Walls",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 18,
        layerType: "3DObject",
        name: "StairsRailing",
        alias: "StairsRailing",
        modelName: "StairsRailing",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 17,
        layerType: "3DObject",
        name: "Stairs",
        alias: "Stairs",
        modelName: "Stairs",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 16,
        layerType: "3DObject",
        name: "SpecialtyEquipment",
        alias: "SpecialtyEquipment",
        modelName: "SpecialtyEquipment",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 15,
        layerType: "3DObject",
        name: "Site",
        alias: "Site",
        modelName: "Site",
        discipline: "Architectural",
        visibility: false,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 14,
        layerType: "3DObject",
        name: "Roofs",
        alias: "Roofs",
        modelName: "Roofs",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 13,
        layerType: "3DObject",
        name: "PlumbingFixtures",
        alias: "PlumbingFixtures",
        modelName: "PlumbingFixtures",
        discipline: "Architectural",
        visibility: false,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 12,
        layerType: "3DObject",
        name: "Parking",
        alias: "Parking",
        modelName: "Parking",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 11,
        layerType: "Point",
        name: "LocationPoints",
        alias: "LocationPoints",
        modelName: "LocationPoints",
        discipline: "Architectural",
        visibility: false,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 10,
        layerType: "3DObject",
        name: "GenericModel",
        alias: "GenericModel",
        modelName: "GenericModel",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 9,
        layerType: "3DObject",
        name: "FurnitureSystems",
        alias: "FurnitureSystems",
        modelName: "FurnitureSystems",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 8,
        layerType: "3DObject",
        name: "Furniture",
        alias: "Furniture",
        modelName: "Furniture",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 7,
        layerType: "3DObject",
        name: "Floors",
        alias: "Floors",
        modelName: "Floors",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 6,
        layerType: "3DObject",
        name: "Entourage",
        alias: "Entourage",
        modelName: "Entourage",
        discipline: "Architectural",
        visibility: false,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 5,
        layerType: "3DObject",
        name: "Doors",
        alias: "Doors",
        modelName: "Doors",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 4,
        layerType: "3DObject",
        name: "CurtainWallPanels",
        alias: "CurtainWallPanels",
        modelName: "CurtainWallPanels",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 3,
        layerType: "3DObject",
        name: "CurtainWallMullions",
        alias: "CurtainWallMullions",
        modelName: "CurtainWallMullions",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 2,
        layerType: "3DObject",
        name: "Ceilings",
        alias: "Ceilings",
        modelName: "Ceilings",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
      {
        id: 1,
        layerType: "3DObject",
        name: "Casework",
        alias: "Casework",
        modelName: "Casework",
        discipline: "Architectural",
        visibility: true,
        expanded: false,
        childNodesCount: 0,
      },
    ],
    expanded: false,
    childNodesCount: 20,
  },
];

const wslTestTileset = [
  {
    id: "15f2fe08c8d-layer-0",
    url: "https://testurl",
    hasChildren: false,
    type: TilesetType.I3S,
    token: undefined,
  },
  {
    id: "14e909fb03f-layer-48",
    url: "",
    token: "",
    hasChildren: true,
    type: TilesetType.I3S,
  },
  {
    id: "15a14243388-layer-1",
    url: "https://testurl",
    hasChildren: false,
    type: TilesetType.I3S,
    token: undefined,
  },
  {
    id: "15a14241ac8-layer-0",
    url: "https://testurl",
    hasChildren: false,
    type: TilesetType.I3S,
    token: undefined,
  },
];

const wslExpectedLayers = [
  {
    id: "15f2fe08c8d-layer-0",
    url: "https://testurl",
    visibility: true,
    type: "I3S",
  },
  {
    id: "15a14243388-layer-1",
    url: "https://testurl",
    visibility: true,
    type: "I3S",
  },
  {
    id: "15a14241ac8-layer-0",
    url: "https://testurl",
    visibility: true,
    type: "I3S",
  },
];
