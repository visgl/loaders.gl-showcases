import { setupStore } from "../store";
import reducer, {
  type BaseMapsState,
  selectBaseMapsByGroup,
  selectSelectedBaseMap,
  setInitialBaseMaps,
  addBaseMap,
  setSelectedBaseMaps,
  deleteBaseMaps,
} from "./base-maps-slice";
import { BaseMapGroup } from "../../types";
import { BASE_MAPS } from "../../constants/map-styles";

jest.mock("@loaders.gl/i3s", () => {
  return jest.fn().mockImplementation(() => {
    return null;
  });
});

describe("slice: base-maps", () => {
  it("Reducer should return the initial state", () => {
    expect(reducer(undefined, { type: "none" })).toEqual({
      baseMap: BASE_MAPS,
      selectedBaseMap: "Dark",
    });
  });

  it("Reducer setBaseMaps should add base map", () => {
    const previousState: BaseMapsState = {
      baseMap: [
        {
          id: "Dark",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
          name: "Dark",
          group: BaseMapGroup.Maplibre,
          iconId: "Dark",
        },
        {
          id: "Light",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
          name: "Light",
          group: BaseMapGroup.Maplibre,
          iconId: "Light",
        },
        {
          id: "Terrain",
          mapUrl: "",
          name: "Terrain",
          group: BaseMapGroup.Terrain,
          iconId: "Terrain",
        },
      ],
      selectedBaseMap: "Dark",
    };

    expect(
      reducer(
        previousState,
        addBaseMap({
          id: "first",
          mapUrl: "https://first-url.com",
          name: "first name",
          group: BaseMapGroup.Maplibre,
          iconId: "Dark",
        })
      )
    ).toEqual({
      baseMap: [
        {
          id: "Dark",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
          name: "Dark",
          group: BaseMapGroup.Maplibre,
          iconId: "Dark",
        },
        {
          id: "Light",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
          name: "Light",
          group: BaseMapGroup.Maplibre,
          iconId: "Light",
        },
        {
          id: "Terrain",
          mapUrl: "",
          name: "Terrain",
          group: BaseMapGroup.Terrain,
          iconId: "Terrain",
        },
        {
          id: "first",
          mapUrl: "https://first-url.com",
          name: "first name",
          group: BaseMapGroup.Maplibre,
          iconId: "Dark",
        },
      ],
      selectedBaseMap: "first",
    });
  });

  it("Reducer deleteBaseMaps should remove base map", () => {
    const previousState: BaseMapsState = {
      baseMap: [
        {
          id: "Dark",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
          name: "Dark",
          group: BaseMapGroup.Maplibre,
          iconId: "Dark",
        },
        {
          id: "Light",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
          name: "Light",
          group: BaseMapGroup.Maplibre,
          iconId: "Light",
        },
        {
          id: "Terrain",
          mapUrl: "",
          name: "Terrain",
          group: BaseMapGroup.Terrain,
          iconId: "Terrain",
        },
      ],
      selectedBaseMap: "Dark",
    };

    expect(reducer(previousState, deleteBaseMaps("Dark"))).toEqual({
      baseMap: [
        {
          id: "Light",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
          name: "Light",
          group: BaseMapGroup.Maplibre,
          iconId: "Light",
        },
        {
          id: "Terrain",
          mapUrl: "",
          name: "Terrain",
          group: BaseMapGroup.Terrain,
          iconId: "Terrain",
        },
      ],
      selectedBaseMap: "Light",
    });
  });

  it("Reducer setSelectedBaseMaps should update selected base map", () => {
    const previousState: BaseMapsState = {
      baseMap: [
        {
          id: "Dark",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
          name: "Dark",
          group: BaseMapGroup.Maplibre,
          iconId: "Dark",
        },
        {
          id: "Light",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
          name: "Light",
          group: BaseMapGroup.Maplibre,
          iconId: "Light",
        },
        {
          id: "Terrain",
          mapUrl: "",
          name: "Terrain",
          group: BaseMapGroup.Terrain,
          iconId: "Terrain",
        },
      ],
      selectedBaseMap: "Dark",
    };

    expect(reducer(previousState, setSelectedBaseMaps("Light"))).toEqual({
      baseMap: [
        {
          id: "Dark",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
          name: "Dark",
          group: BaseMapGroup.Maplibre,
          iconId: "Dark",
        },
        {
          id: "Light",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
          name: "Light",
          group: BaseMapGroup.Maplibre,
          iconId: "Light",
        },
        {
          id: "Terrain",
          mapUrl: "",
          name: "Terrain",
          group: BaseMapGroup.Terrain,
          iconId: "Terrain",
        },
      ],
      selectedBaseMap: "Light",
    });
  });

  it("Reducer setInitialBaseMaps should return initial base maps", () => {
    const previousState: BaseMapsState = {
      baseMap: [
        {
          id: "Terrain",
          mapUrl: "",
          name: "Terrain",
          group: BaseMapGroup.Terrain,
          iconId: "Terrain",
        },
      ],
      selectedBaseMap: "Terrain",
    };

    expect(reducer(previousState, setInitialBaseMaps())).toEqual({
      baseMap: BASE_MAPS,
      selectedBaseMap: "Dark",
    });
  });

  it("Selectors should return initially selected value", () => {
    const store = setupStore();
    const state = store.getState();
    const mapId = selectSelectedBaseMap(state)?.id;
    expect(mapId).toEqual("Dark");
    expect(selectBaseMapsByGroup(state, "")).toEqual(BASE_MAPS);
  });

  it("Selectors should return updated value", () => {
    const store = setupStore();
    store.dispatch(deleteBaseMaps("Dark"));
    const newItem = {
      id: "first",
      mapUrl: "https://first-url.com",
      name: "first name",
      group: BaseMapGroup.Maplibre,
      iconId: "Dark",
    };
    store.dispatch(addBaseMap(newItem));
    store.dispatch(setSelectedBaseMaps("Terrain"));
    const state = store.getState();
    const mapId = selectSelectedBaseMap(state)?.id;
    expect(mapId).toEqual("Terrain");

    const expectedArray = BASE_MAPS.filter((item) => item.id !== "Dark");
    expectedArray.push(newItem);

    expect(selectBaseMapsByGroup(state, "")).toEqual(expectedArray);
    // set wrong id of basemap
    store.dispatch(setSelectedBaseMaps("Dark"));
    const newState = store.getState();
    // it doesn't use wrong id and keeps previous one
    expect(selectSelectedBaseMap(newState)?.id).toEqual("Terrain");
  });

  it("Selector should return value selected by group", () => {
    const store = setupStore();
    const state = store.getState();
    const mapId = selectSelectedBaseMap(state)?.id;
    expect(mapId).toEqual("Dark");
    expect(selectBaseMapsByGroup(state, BaseMapGroup.Maplibre)).toEqual([
      {
        id: "Dark",
        mapUrl:
          "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
        name: "Dark",
        group: BaseMapGroup.Maplibre,
        iconId: "Dark",
      },
      {
        id: "Light",
        mapUrl:
          "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
        name: "Light",
        group: BaseMapGroup.Maplibre,
        iconId: "Light",
      },
    ]);
  });
});
