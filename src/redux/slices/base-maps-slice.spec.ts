import { setupStore } from "../store";
import reducer, {
  BaseMapsState,
  selectBaseMaps,
  selectSelectedBaseMaps,
  setInitialBaseMaps,
  setBaseMaps,
  setSelectedBaseMaps,
  deleteBaseMaps,
} from "./base-maps-slice";

describe("slice: base-maps", () => {
  it("Reducer should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual({
      baseMap: [
        {
          id: "Dark",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
          name: "Dark",
        },
        {
          id: "Light",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
          name: "Light",
        },
        { id: "Terrain", mapUrl: "", name: "Terrain" },
      ],
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
        },
        {
          id: "Light",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
          name: "Light",
        },
        { id: "Terrain", mapUrl: "", name: "Terrain" },
      ],
      selectedBaseMap: "Dark",
    };

    expect(
      reducer(
        previousState,
        setBaseMaps({
          id: "first",
          mapUrl: "https://first-url.com",
          name: "first name",
        })
      )
    ).toEqual({
      baseMap: [
        {
          id: "Dark",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
          name: "Dark",
        },
        {
          id: "Light",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
          name: "Light",
        },
        { id: "Terrain", mapUrl: "", name: "Terrain" },
        { id: "first", mapUrl: "https://first-url.com", name: "first name" },
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
        },
        {
          id: "Light",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
          name: "Light",
        },
        { id: "Terrain", mapUrl: "", name: "Terrain" },
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
        },
        { id: "Terrain", mapUrl: "", name: "Terrain" },
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
        },
        {
          id: "Light",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
          name: "Light",
        },
        { id: "Terrain", mapUrl: "", name: "Terrain" },
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
        },
        {
          id: "Light",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
          name: "Light",
        },
        { id: "Terrain", mapUrl: "", name: "Terrain" },
      ],
      selectedBaseMap: "Light",
    });
  });

  it("Reducer setInitialBaseMaps should return initial base maps", () => {
    const previousState: BaseMapsState = {
      baseMap: [{ id: "Terrain", mapUrl: "", name: "Terrain" }],
      selectedBaseMap: "Terrain",
    };

    expect(reducer(previousState, setInitialBaseMaps())).toEqual({
      baseMap: [
        {
          id: "Dark",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
          name: "Dark",
        },
        {
          id: "Light",
          mapUrl:
            "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
          name: "Light",
        },
        { id: "Terrain", mapUrl: "", name: "Terrain" },
      ],
      selectedBaseMap: "Dark",
    });
  });

  it("Selectors should return initial value", () => {
    const store = setupStore();
    const state = store.getState();
    expect(selectSelectedBaseMaps(state)).toEqual("Dark");
    expect(selectBaseMaps(state)).toEqual([
      {
        id: "Dark",
        mapUrl:
          "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
        name: "Dark",
      },
      {
        id: "Light",
        mapUrl:
          "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
        name: "Light",
      },
      { id: "Terrain", mapUrl: "", name: "Terrain" },
    ]);
  });

  it("Selectors should return updated value", () => {
    const store = setupStore();
    store.dispatch(deleteBaseMaps("Dark"));
    store.dispatch(
      setBaseMaps({
        id: "first",
        mapUrl: "https://first-url.com",
        name: "first name",
      })
    );
    store.dispatch(setSelectedBaseMaps("Terrain"));
    const state = store.getState();
    expect(selectSelectedBaseMaps(state)).toEqual("Terrain");
    expect(selectBaseMaps(state)).toEqual([
      {
        id: "Light",
        mapUrl:
          "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
        name: "Light",
      },
      { id: "Terrain", mapUrl: "", name: "Terrain" },
      {
        id: "first",
        mapUrl: "https://first-url.com",
        name: "first name",
      },
    ]);
  });
});
