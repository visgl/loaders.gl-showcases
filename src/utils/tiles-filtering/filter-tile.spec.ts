import { parse } from "@loaders.gl/core";
import { filterTile } from "./filter-tile";
import { I3SContentLoader } from "@loaders.gl/i3s";
import { TURANGA_CONTENT_LOADER_OPTIONS } from "../../test/data/Turanga_Library/i3s-content-loader-options";
import {
  ADMIN_BUILDING_CONTENT_LOADER_OPTIONS,
  CONTENT_FEATURE_IDS,
  CONTENT_INDICES,
} from "../../test/data/Admin_Building_v17/i3s-content-loader-options";
import { fetch } from "whatwg-fetch";
import { getTile3d } from "../../test/tile-stub";

const TURANGA_TILE_CONTENT =
  "https://tiles.arcgis.com/tiles/cFEFS0EWrhfDeVw9/arcgis/rest/services/Turanga_Library/SceneServer/layers/0/sublayers/7/nodes/0/geometries/0";

describe("filterTile", () => {
  it("Should filter tile", async () => {
    const mockTile = getTile3d();
    mockTile.tileset.loadOptions = { i3s: {} };
    const response = await fetch(TURANGA_TILE_CONTENT, { method: "GET" });
    const data = await response.arrayBuffer();
    const content = await parse(data, I3SContentLoader, {
      i3s: TURANGA_CONTENT_LOADER_OPTIONS,
    });
    mockTile.content = content;

    mockTile.tileset.tileset.fields =
      TURANGA_CONTENT_LOADER_OPTIONS._tilesetOptions.fields;
    mockTile.tileset.tileset.attributeStorageInfo =
      TURANGA_CONTENT_LOADER_OPTIONS._tilesetOptions.attributeStorageInfo;
    mockTile.header.attributeUrls =
      TURANGA_CONTENT_LOADER_OPTIONS._tileOptions.attributeUrls;

    const filtersByAttribute = { attributeName: "BldgLevel", value: 0 };

    // apply filter
    const result = await filterTile(mockTile, filtersByAttribute);
    expect(result).toEqual({ isFiltered: true, id: "41513" });
    expect(mockTile.content.indices).toEqual(
      new Uint32Array([
        11466, 11467, 11468, 11469, 11470, 11471, 11472, 11473, 11474, 11475,
        11476, 11477, 11478, 11479, 11480, 11481, 11482, 11483, 11484, 11485,
        11486, 11487, 11488, 11489, 11490, 11491, 11492, 11493, 11494, 11495,
        11496, 11497, 11498, 11499, 11500, 11501,
      ])
    );
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
    const response = await fetch(TURANGA_TILE_CONTENT, { method: "GET" });
    const data = await response.arrayBuffer();
    const content = await parse(data, I3SContentLoader, {
      i3s: TURANGA_CONTENT_LOADER_OPTIONS,
    });
    mockTile.content = content;

    mockTile.tileset.tileset.fields =
      TURANGA_CONTENT_LOADER_OPTIONS._tilesetOptions.fields;
    mockTile.tileset.tileset.attributeStorageInfo =
      TURANGA_CONTENT_LOADER_OPTIONS._tilesetOptions.attributeStorageInfo;
    mockTile.header.attributeUrls =
      TURANGA_CONTENT_LOADER_OPTIONS._tileOptions.attributeUrls;

    const result = await filterTile(mockTile, null);
    expect(result).toEqual({ isFiltered: false, id: "41513" });

    const filtersByAttribute = { attributeName: "BldgLevel", value: 0 };
    //should not filter by the already applied filter, see result3
    const result2 = await filterTile(mockTile, filtersByAttribute);
    expect(result2).toEqual({ isFiltered: true, id: "41513" });
    const result3 = await filterTile(mockTile, filtersByAttribute);
    expect(result3).toEqual({ isFiltered: false, id: "41513" });
  });

  it("Should filter tile with draco geometry", async () => {
    const mockTile = getTile3d();
    mockTile.tileset.loadOptions = { i3s: {} };
    mockTile.content.featureIds = CONTENT_FEATURE_IDS;
    mockTile.content.indices = CONTENT_INDICES;
    mockTile.tileset.tileset.fields =
      ADMIN_BUILDING_CONTENT_LOADER_OPTIONS._tilesetOptions.fields;
    mockTile.tileset.tileset.attributeStorageInfo =
      ADMIN_BUILDING_CONTENT_LOADER_OPTIONS._tilesetOptions.attributeStorageInfo;
    mockTile.header.attributeUrls =
      ADMIN_BUILDING_CONTENT_LOADER_OPTIONS._tileOptions.attributeUrls;

    const filtersByAttribute = { attributeName: "BldgLevel", value: 2 };

    // apply filter
    const result = await filterTile(mockTile, filtersByAttribute);
    expect(result).toEqual({ isFiltered: true, id: "41513" });
    expect(mockTile.content.indices).toEqual(
      new Uint32Array([
        464, 465, 466, 466, 465, 467, 467, 465, 468, 468, 465, 469, 465, 464,
        469, 469, 464, 470, 464, 466, 470, 466, 467, 470, 470, 467, 471, 467,
        468, 471, 468, 469, 471, 470, 471, 469,
      ])
    );
    expect(mockTile.content.userData.originalIndices.length).toEqual(2544);
    expect(mockTile.content.userData.customFilters).toEqual(filtersByAttribute);

    // cancel filter
    const result2 = await filterTile(mockTile, null);
    expect(result2).toEqual({ isFiltered: true, id: "41513" });
    expect(mockTile.content.indices.length).toEqual(2544);
    expect(mockTile.content.userData.customFilters).toEqual(null);
  });
});
