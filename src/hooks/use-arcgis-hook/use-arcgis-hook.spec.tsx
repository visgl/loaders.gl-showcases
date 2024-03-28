import { loadArcGISModules } from "@deck.gl/arcgis";

import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { renderHook } from "@testing-library/react-hooks";
import { useArcgis } from "./use-arcgis-hook";
import { type AppStore, setupStore } from "../../redux/store";

const getWrapper = (store: AppStore) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return Wrapper;
};

jest.mock("@deck.gl/arcgis", () => {
  return {
    loadArcGISModules: jest.fn().mockReturnValue(Promise.resolve({})),
  };
});

describe("ArcGis Hook", () => {
  it("Should be able to call ArcGis hook", async () => {
    const store = setupStore();
    const wrapper = getWrapper(store);

    const hook = renderHook(
      () =>
        useArcgis(
          { current: null },
          {
            main: { longitude: 1, latitude: 2, pitch: 3, bearing: 4, zoom: 5 },
          },
          null
        ),
      {
        wrapper,
      }
    );
    const renderer = hook.result.current;
    expect(renderer).toBeNull();
    expect(loadArcGISModules).not.toHaveBeenCalled();
  });
});
