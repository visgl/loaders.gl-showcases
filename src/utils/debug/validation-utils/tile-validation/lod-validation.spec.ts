import { checkLOD } from "./lod-validation";

jest.mock('../../../../constants/map-styles', () => ({
  LOD_WARNING_TYPE: 'LOD_WARNING_TYPE',
  PARENT_LOD_WARNING_TYPE: 'PARENT_LOD_WARNING_TYPE'
}));

describe('Check LOD', () => {
  test("Should return empty warnings if not LOD issues", () => {
    const tile = {
      lodMetricValue: 100,
      boundingVolume: {
        radius: 10
      },
      parent: {
        id: 'parent Id',
        boundingVolume: {
          radius: 100
        },
        children: [
          { lodMetricValue: 50, boundingVolume: { radius: 5 } }
        ],
        lodMetricValue: 10
      }
    };
    const tileWarnings = [];
    checkLOD(tile, tileWarnings);
    expect(tileWarnings).toStrictEqual([]);
  });

  test("Should return warnings with LOD/Radius ratio > mean child LOD/Radius ratio", () => {
    const tile = {
      lodMetricValue: 100,
      boundingVolume: {
        radius: 10
      },
      parent: {
        id: 'parent Id',
        boundingVolume: {
          radius: 1
        },
        children: [
          { lodMetricValue: 50, boundingVolume: { radius: 5 } }
        ],
        lodMetricValue: 1000
      }
    };
    const tileWarnings = [];
    checkLOD(tile, tileWarnings);
    expect(tileWarnings).toStrictEqual([
      {
        tileId: "parent Id",
        title: "Tile (parent Id) LOD/Radius ratio \"1000\" > mean child LOD/Radius ratio \"10\"",
        type: "PARENT_LOD_WARNING_TYPE",
      }
    ]);
  });

  test("Should return only LOD/Radius ratio has large deviation from mean LOD/Radius ratio of neighbors warning", () => {
    const tile = {
      id: 'tile id',
      lodMetricValue: 10000,
      boundingVolume: {
        radius: 1
      },
      parent: {
        id: 'parent Id',
        boundingVolume: {
          radius: 1
        },
        children: [
          { lodMetricValue: 50, boundingVolume: { radius: 5 } }
        ],
        lodMetricValue: 1000
      }
    };
    const tileWarnings = [{
      tileId: 'parent Id',
      type: 'PARENT_LOD_WARNING_TYPE'
    }];
    checkLOD(tile, tileWarnings);
    expect(tileWarnings).toStrictEqual([
      {
        tileId: 'parent Id',
        type: 'PARENT_LOD_WARNING_TYPE'
      },
      {
        tileId: "parent Id",
        title: "Tile (tile id) LOD/Radius ratio \"10000\" has large deviation from mean LOD/Radius ratio of neighbors \"10\"",
        type: "LOD_WARNING_TYPE"
      }
    ]);
  });

  test("Should return all possible warnings", () => {
    const tile = {
      id: 'tile id',
      lodMetricValue: 10000,
      boundingVolume: {
        radius: 1
      },
      parent: {
        id: 'parent Id',
        boundingVolume: {
          radius: 1
        },
        children: [
          { lodMetricValue: 50, boundingVolume: { radius: 5 } }
        ],
        lodMetricValue: 1000
      }
    };
    const tileWarnings = [];
    checkLOD(tile, tileWarnings);
    expect(tileWarnings).toStrictEqual([
      {
        tileId: "parent Id",
        title: "Tile (parent Id) LOD/Radius ratio \"1000\" > mean child LOD/Radius ratio \"10\"",
        type: "PARENT_LOD_WARNING_TYPE"
      },
      {
        tileId: "parent Id",
        title: "Tile (tile id) LOD/Radius ratio \"10000\" has large deviation from mean LOD/Radius ratio of neighbors \"10\"",
        type: "LOD_WARNING_TYPE"
      }
    ]);
  });
});
