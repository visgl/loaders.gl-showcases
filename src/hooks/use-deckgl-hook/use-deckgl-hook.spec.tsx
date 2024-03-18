import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { renderHook } from "@testing-library/react-hooks";
import { useDeckGl } from "./use-deckgl-hook";
import { type AppStore, setupStore } from "../../redux/store";

const getWrapper = (store: AppStore) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return Wrapper;
};

describe("DeckGl Hook", () => {
  it("Should be able to call DeckGl hook", async () => {
    const store = setupStore();
    const wrapper = getWrapper(store);
    const hook = renderHook(() => useDeckGl("id", false, [], true), {
      wrapper,
    });
    const result = hook.result.current;
    expect(result.VIEWS).toBeDefined();
    expect(result.dragMode).toBeDefined();
    expect(result.showMinimap).toBeDefined();
    expect(result.loadTiles).toBeDefined();
    expect(result.createIndependentMinimapViewport).toBeDefined();
    expect(result.tileColorMode).toBeDefined();
    expect(result.boundingVolumeColorMode).toBeDefined();
    expect(result.wireframe).toBeDefined();
    expect(result.showTerrain).toBeDefined();
    expect(result.mapStyle).toBeDefined();
    expect(result.boundingVolume).toBeDefined();
    expect(result.boundingVolumeType).toBeDefined();
    expect(result.colorsByAttribute).toBeDefined();
    expect(result.globalViewState).toBeDefined();
    expect(result.terrainTiles).toBeDefined();
    expect(result.needTransitionToTileset).toBeDefined();
    expect(result.VIEWS).toBeDefined();
    expect(result.viewState).toBeDefined();
    expect(result.showDebugTextureRef).toBeDefined();
    expect(result.uvDebugTextureRef).toBeDefined();
    expect(result.setNeedTransitionToTileset).toBeDefined();
    expect(result.setTerrainTiles).toBeDefined();
  });
});
