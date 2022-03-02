import { getShortTileDebugInfo, getTileDebugInfo, validateTile, isTileGeometryInsideBoundingVolume } from './tile-debug';
import { isAllVerticesInsideBoundingVolume } from "./bounding-volume-vertices";
import { getTileDataForValidation } from "./validation-utils/tile-validation/tile-validation-data";

jest.mock('./validation-utils/tile-validation/bounding-volume-validation', () => ({
  checkBoundingVolumes: jest.fn().mockImplementation((_, tileWarnings) => tileWarnings.push('checkBoundingVolumes warning')),
}));

jest.mock('./validation-utils/tile-validation/lod-validation', () => ({
  checkLOD: jest.fn().mockImplementation((_, tileWarnings) => tileWarnings.push('checkLOD warning')),
}));

jest.mock('./bounding-volume-vertices', () => ({
  isAllVerticesInsideBoundingVolume: jest.fn().mockImplementation(() => true)
}));

jest.mock('./bounding-volume', () => ({
  getBoundingType: jest.fn()
    .mockImplementationOnce(() => 'Oriented Bounding Box')
    .mockImplementationOnce(() => 'Minimum Bounding Sphere'),
  createBoundingVolumeFromTile: jest.fn().mockImplementation(() => 'Bounding Volume is created')
}));

jest.mock('./validation-utils/tile-validation/tile-validation-data', () => ({
  getTileDataForValidation: jest.fn().mockImplementation(() => ({
    positions: new Float32Array([1, 2, 3]),
    boundingVolume: 'Bounding Volume'
  }))
}));

describe("Tile Debug - getShortTileDebugInfo", () => {
  test("Should return short tile debug info", () => {

    const expectedResult = {
      'Tile Id': 'test',
      Type: 'test type',
      'Children Count': 3,
      'Children Ids': 'child1, child2, child3',
      'Vertex count': 3,
      'Distance to camera': '100.000 m'
    };

    const tileHeader = {
      id: 'test',
      type: 'test type',
      header: {
        children: [
          { id: 'child1' },
          { id: 'child2' },
          { id: 'child3' }
        ]
      },
      content: {
        vertexCount: 3
      },
      _distanceToCamera: 100
    };
    const result = getShortTileDebugInfo(tileHeader);
    expect(result).toStrictEqual(expectedResult);
  });

  test("Should return 'No Data' if some fields are not founded", () => {
    const expectedResult = {
      'Tile Id': 'test',
      Type: 'No Data',
      'Children Count': 'No Data',
      'Children Ids': 'No Data',
      'Vertex count': 'No Data',
      'Distance to camera': 'No Data'
    };

    const tileHeader = {
      id: 'test',
      type: null,
      header: {
        children: []
      },
      content: {
        vertexCount: null
      },
      _distanceToCamera: null
    };
    const result = getShortTileDebugInfo(tileHeader);
    expect(result).toStrictEqual(expectedResult);
  });

});

describe("Tile Debug - getTileDebugInfo", () => {
  test("Should return full tile debug info", () => {

    const expectedResult = {
      "Bounding Type": "Oriented Bounding Box",
      "Children Count": 3,
      "Children Ids": "child1, child2, child3",
      "Distance to camera": "200.000 m",
      "Has Material": true,
      "Has Texture": true,
      "LOD Metric Type": "lodMetricType",
      "LOD Metric Value": "100.000",
      "Refinement Type": "Add",
      "Screen Space Error": "300.000",
      "Tile Id": "test",
      "Type": "test type",
      "Vertex count": 3,
    };

    const tileHeader = {
      id: 'test',
      type: 'test type',
      refine: 1, // Add
      lodMetricType: 'lodMetricType',
      lodMetricValue: 100,
      header: {
        children: [
          { id: 'child1' },
          { id: 'child2' },
          { id: 'child3' }
        ],
        obb: 'obb'
      },
      content: {
        vertexCount: 3,
        texture: 'texture',
        material: 'material'
      },
      _distanceToCamera: 200,
      _screenSpaceError: 300
    };

    const result = getTileDebugInfo(tileHeader);
    expect(result).toStrictEqual(expectedResult);
  });

  test("Should return 'No Data' if some fields are not founded", () => {
    const expectedResult = {
      "Bounding Type": "Minimum Bounding Sphere",
      "Children Count": "No Data",
      "Children Ids": "No Data",
      "Distance to camera": "No Data",
      "Has Material": false,
      "Has Texture": false,
      "LOD Metric Type": "No Data",
      "LOD Metric Value": "No Data",
      "Refinement Type": "No Data",
      "Screen Space Error": "No Data",
      "Tile Id": "test",
      "Type": "test type",
      "Vertex count": "No Data",
    };

    const tileHeader = {
      id: 'test',
      type: 'test type',
      refine: 3, // Not existed
      lodMetricType: null,
      lodMetricValue: null,
      header: {
        children: null,
        obb: null
      },
      content: {
        vertexCount: null,
        texture: null,
        material: null
      },
      _distanceToCamera: null,
      _screenSpaceError: null
    };

    const result = getTileDebugInfo(tileHeader);
    expect(result).toStrictEqual(expectedResult);
  });

});

describe("Tile Debug - validateTile", () => {
  test("Should return empty tile if no tile parent", () => {
    const tile = {
      parent: null,
    };

    const result = validateTile(tile);
    expect(result).toStrictEqual([]);
  });

  test("Should return tile warnings", () => {
    const tile = {
      parent: {}
    };

    const expectedResult = [
      "checkBoundingVolumes warning",
      "checkLOD warning"
    ];

    const result = validateTile(tile);
    expect(result).toStrictEqual(expectedResult);
  });
});

describe("Tile Debug - isTileGeometryInsideBoundingVolume", () => {
  test("Should return true", () => {
    const tile = {
      id: 'test id'
    };
    const result = isTileGeometryInsideBoundingVolume(tile);

    expect(getTileDataForValidation).toHaveBeenCalledWith(tile);
    expect(isAllVerticesInsideBoundingVolume).toHaveBeenCalledWith('Bounding Volume', new Float32Array([1, 2, 3]));
    expect(result).toBeTruthy();
  });

});
