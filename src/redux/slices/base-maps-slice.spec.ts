import { setupStore } from "../store";
import reducer, {
  type BaseMapsState,
  selectBaseMapsByGroup,
  selectSelectedBaseMap,
  setInitialBaseMaps,
  addBaseMap,
  setSelectedBaseMap,
  deleteBaseMap,
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
      basemaps: BASE_MAPS,
      selectedBaseMapId: "Dark",
    });
  });

  it("Reducer setBaseMaps should add base map", () => {
    const previousState: BaseMapsState = {
      basemaps: [
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
      selectedBaseMapId: "Dark",
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
      basemaps: [
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
      selectedBaseMapId: "first",
    });
  });

  it("Reducer deleteBaseMap should remove base map", () => {
    const previousState: BaseMapsState = {
      basemaps: [
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
      selectedBaseMapId: "Dark",
    };

    expect(reducer(previousState, deleteBaseMap("Dark"))).toEqual({
      basemaps: [
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
      selectedBaseMapId: "Light",
    });
  });

  it("Reducer setSelectedBaseMap should update selected base map", () => {
    const previousState: BaseMapsState = {
      basemaps: [
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
      selectedBaseMapId: "Dark",
    };

    expect(reducer(previousState, setSelectedBaseMap("Light"))).toEqual({
      basemaps: [
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
      selectedBaseMapId: "Light",
    });
  });

  it("Reducer setInitialBaseMaps should return initial base maps", () => {
    const previousState: BaseMapsState = {
      basemaps: [
        {
          id: "Terrain",
          mapUrl: "",
          name: "Terrain",
          group: BaseMapGroup.Terrain,
          iconId: "Terrain",
        },
      ],
      selectedBaseMapId: "Terrain",
    };

    expect(reducer(previousState, setInitialBaseMaps())).toEqual({
      basemaps: BASE_MAPS,
      selectedBaseMapId: "Dark",
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
    store.dispatch(deleteBaseMap("Dark"));
    const newItem = {
      id: "first",
      mapUrl: "https://first-url.com",
      name: "first name",
      group: BaseMapGroup.Maplibre,
      iconId: "Dark",
    };
    store.dispatch(addBaseMap(newItem));
    store.dispatch(setSelectedBaseMap("Terrain"));
    const state = store.getState();
    const mapId = selectSelectedBaseMap(state)?.id;
    expect(mapId).toEqual("Terrain");

    const expectedArray = BASE_MAPS.filter((item) => item.id !== "Dark");
    expectedArray.push(newItem);

    expect(selectBaseMapsByGroup(state, "")).toEqual(expectedArray);
    // set wrong id of basemap
    store.dispatch(setSelectedBaseMap("Dark"));
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
