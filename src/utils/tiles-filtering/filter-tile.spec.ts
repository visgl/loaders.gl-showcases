import { load } from "@loaders.gl/core";
import { filterTile } from "./filter-tile";
import { TURANGA_CONTENT_LOADER_OPTIONS } from "../../test/data/Turanga_Library/i3s-content-loader-options";
import { ADMIN_BUILDING_CONTENT_LOADER_OPTIONS } from "../../test/data/Admin_Building_v17/i3s-content-loader-options";
import { getTile3d } from "../../test/tile-stub";

jest.mock("@loaders.gl/core");

describe("filterTile", () => {
  it("Should filter tile", async () => {
    const mockTile = getTile3d();
    mockTile.tileset.loadOptions = { i3s: {} };
    mockTile.content.featureIds = new Float32Array([
      13, 13, 13, 13, 13, 13, 100, 100, 100,
    ]);
    mockTile.content.indices = null;

    mockTile.tileset.tileset.fields =
      TURANGA_CONTENT_LOADER_OPTIONS._tilesetOptions.fields;
    mockTile.tileset.tileset.attributeStorageInfo =
      TURANGA_CONTENT_LOADER_OPTIONS._tilesetOptions.attributeStorageInfo;
    mockTile.header.attributeUrls =
      TURANGA_CONTENT_LOADER_OPTIONS._tileOptions.attributeUrls;

    const filtersByAttribute = { attributeName: "BldgLevel", value: 0 };

    (load as unknown as jest.Mock<any>)
      .mockReturnValueOnce(
        Promise.resolve({ BldgLevel: new Uint32Array([100500, 0]) })
      )
      .mockReturnValueOnce(
        Promise.resolve({ OBJECTID_1: new Uint32Array([13, 100]) })
      );

    // apply filter
    const result = await filterTile(mockTile, filtersByAttribute);
    expect(result).toEqual({ isFiltered: true, id: "41513" });
    expect(mockTile.content.indices).toEqual(new Uint32Array([6, 7, 8]));
    expect(mockTile.content.userData.originalIndices).toEqual(null);
    expect(mockTile.content.userData.customFilters).toEqual(filtersByAttribute);

    // cancel filter
    const result2 = await filterTile(mockTile, null);
    expect(result2).toEqual({ isFiltered: true, id: "41513" });
    expect(mockTile.content.indices).toEqual(null);
    expect(mockTile.content.userData.customFilters).toEqual(null);
  });

  it("Should not filter tile", async () => {
    const mockTile = getTile3d();
    mockTile.tileset.loadOptions = { i3s: {} };
    mockTile.content.featureIds = new Float32Array([
      13, 13, 13, 13, 13, 13, 100, 100, 100,
    ]);
    mockTile.content.indices = null;

    mockTile.tileset.tileset.fields =
      TURANGA_CONTENT_LOADER_OPTIONS._tilesetOptions.fields;
    mockTile.tileset.tileset.attributeStorageInfo =
      TURANGA_CONTENT_LOADER_OPTIONS._tilesetOptions.attributeStorageInfo;
    mockTile.header.attributeUrls =
      TURANGA_CONTENT_LOADER_OPTIONS._tileOptions.attributeUrls;

    const result = await filterTile(mockTile, null);
    expect(result).toEqual({ isFiltered: false, id: "41513" });

    const filtersByAttribute = { attributeName: "BldgLevel", value: 0 };

    (load as unknown as jest.Mock<any>)
      .mockReturnValueOnce(
        Promise.resolve({ BldgLevel: new Uint32Array([100500, 0]) })
      )
      .mockReturnValueOnce(
        Promise.resolve({ OBJECTID_1: new Uint32Array([13, 100]) })
      );

    // should not filter by the already applied filter, see result3
    const result2 = await filterTile(mockTile, filtersByAttribute);
    expect(result2).toEqual({ isFiltered: true, id: "41513" });
    const result3 = await filterTile(mockTile, filtersByAttribute);
    expect(result3).toEqual({ isFiltered: false, id: "41513" });
  });

  it("Should filter tile with draco geometry", async () => {
    const mockTile = getTile3d();
    mockTile.tileset.loadOptions = { i3s: {} };
    mockTile.content.featureIds = new Float32Array([
      13, 13, 13, 13, 100, 100, 100,
    ]);
    mockTile.content.indices = new Uint32Array([0, 1, 3, 3, 1, 2, 4, 5, 6]);
    mockTile.tileset.tileset.fields =
      ADMIN_BUILDING_CONTENT_LOADER_OPTIONS._tilesetOptions.fields;
    mockTile.tileset.tileset.attributeStorageInfo =
      ADMIN_BUILDING_CONTENT_LOADER_OPTIONS._tilesetOptions.attributeStorageInfo;
    mockTile.header.attributeUrls =
      ADMIN_BUILDING_CONTENT_LOADER_OPTIONS._tileOptions.attributeUrls;

    const filtersByAttribute = { attributeName: "BldgLevel", value: 2 };

    (load as unknown as jest.Mock<any>)
      .mockReturnValueOnce(
        Promise.resolve({ BldgLevel: new Uint32Array([100500, 2]) })
      )
      .mockReturnValueOnce(
        Promise.resolve({ OBJECTID_1: new Uint32Array([13, 100]) })
      );

    // apply filter
    const result = await filterTile(mockTile, filtersByAttribute);
    expect(result).toEqual({ isFiltered: true, id: "41513" });
    expect(mockTile.content.indices).toEqual(new Uint32Array([4, 5, 6]));
    expect(mockTile.content.userData.originalIndices).toEqual(
      new Uint32Array([0, 1, 3, 3, 1, 2, 4, 5, 6])
    );
    expect(mockTile.content.userData.customFilters).toEqual(filtersByAttribute);

    // cancel filter
    const result2 = await filterTile(mockTile, null);
    expect(result2).toEqual({ isFiltered: true, id: "41513" });
    expect(mockTile.content.indices).toEqual(
      new Uint32Array([0, 1, 3, 3, 1, 2, 4, 5, 6])
    );
    expect(mockTile.content.userData.customFilters).toEqual(null);
  });
});
