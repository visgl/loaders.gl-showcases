import { setupStore } from "../store";
import reducer, {
  type ViewStateState,
  selectViewState,
  setViewState,
} from "./view-state-slice";

describe("slice: view-state", () => {
  it("Reducer should return the initial state", () => {
    expect(reducer(undefined, { type: "none" })).toEqual({
      main: {
        longitude: -120,
        latitude: 34,
        pitch: 45,
        maxPitch: 90,
        bearing: 0,
        minZoom: 2,
        maxZoom: 30,
        zoom: 14.5,
        transitionDuration: 0,
        transitionInterpolator: null,
      },
      minimap: {
        latitude: 34,
        longitude: -120,
        zoom: 9,
        pitch: 0,
        bearing: 0,
      },
    });
  });

  it("Reducer setViewState should set a viewState", () => {
    const previousState: ViewStateState = {
      main: { longitude: -120, latitude: 34 },
      minimap: { longitude: -120, latitude: 34 },
    };

    expect(
      reducer(
        previousState,
        setViewState({ main: { longitude: 1, latitude: 2 } })
      )
    ).toEqual({
      main: { longitude: 1, latitude: 2 },
      minimap: { longitude: -120, latitude: 34 },
    });
    expect(
      reducer(
        previousState,
        setViewState({ minimap: { longitude: 1, latitude: 2 } })
      )
    ).toEqual({
      main: { longitude: -120, latitude: 34 },
      minimap: { longitude: 1, latitude: 2 },
    });
    expect(
      reducer(
        previousState,
        setViewState({
          main: { longitude: 1, latitude: 2 },
          minimap: { longitude: 3, latitude: 4 },
        })
      )
    ).toEqual({
      main: { longitude: 1, latitude: 2 },
      minimap: { longitude: 3, latitude: 4 },
    });
  });

  it("Selector should return the initial state", () => {
    const store = setupStore();
    const state = store.getState();
    expect(selectViewState(state)).toEqual({
      main: {
        longitude: -120,
        latitude: 34,
        pitch: 45,
        maxPitch: 90,
        bearing: 0,
        minZoom: 2,
        maxZoom: 30,
        zoom: 14.5,
        transitionDuration: 0,
        transitionInterpolator: null,
      },
      minimap: {
        latitude: 34,
        longitude: -120,
        zoom: 9,
        pitch: 0,
        bearing: 0,
      },
    });
  });

  it("Selector should return the updated value", () => {
    const store = setupStore();

    store.dispatch(
      setViewState({
        main: { longitude: 1, latitude: 2 },
        minimap: { longitude: 3, latitude: 4 },
      })
    );

    const state = store.getState();
    expect(selectViewState(state)).toEqual({
      main: { longitude: 1, latitude: 2 },
      minimap: { longitude: 3, latitude: 4 },
    });
  });
});
