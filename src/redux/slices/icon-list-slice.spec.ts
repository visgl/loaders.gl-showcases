import { setupStore } from "../store";
import {
  addIconItem,
  deleteIconItem,
  setIconItemPicked,
  selectIconList,
  selectIconItemPicked,
  selectIconItemPickedId,
} from "./icon-list-slice";
import { IIconItem, IconListSetName } from "../../types";

describe("slice: icon-list", () => {
  it("Selector should return the initial state", () => {
    const store = setupStore();
    const state = store.getState();
    expect(selectIconList("")(state)).toEqual([]);
    const list = selectIconList(IconListSetName.uvDebugTexture)(state);
    expect(list.length).toEqual(5);
  });

  it("Selectors should return picked items", () => {
    const store = setupStore();
    const state = store.getState();
    const id = selectIconItemPickedId(IconListSetName.uvDebugTexture)(state);
    expect(id).toEqual("uv1");
    const itemPicked = selectIconItemPicked(IconListSetName.uvDebugTexture)(
      state
    );
    expect(itemPicked?.id).toEqual("uv1");
  });

  it("Should add an icon item and set it as a current one", () => {
    const store = setupStore();
    const texture: IIconItem = {
      id: `myTexture`,
      icon: "",
      extData: { imageUrl: "path" },
      custom: true,
    };
    store.dispatch(
      addIconItem({
        iconListSetName: IconListSetName.uvDebugTexture,
        iconItem: texture,
        setCurrent: true,
      })
    );
    const state = store.getState();
    const itemPicked = selectIconItemPicked(IconListSetName.uvDebugTexture)(
      state
    );
    expect(itemPicked?.id).toEqual("myTexture");
  });

  it("Should remove an icon item and clear the selection if necessary", () => {
    const store = setupStore();
    store.dispatch(
      deleteIconItem({
        iconListSetName: IconListSetName.uvDebugTexture,
        id: "uv2",
      })
    );
    const state = store.getState();
    const itemPicked1 = selectIconItemPicked(IconListSetName.uvDebugTexture)(
      state
    );
    expect(itemPicked1?.id).toEqual("uv1");

    // Delete the picked item
    store.dispatch(
      deleteIconItem({
        iconListSetName: IconListSetName.uvDebugTexture,
        id: "uv1",
      })
    );
    const newState = store.getState();
    const itemPicked2 = selectIconItemPicked(IconListSetName.uvDebugTexture)(
      newState
    );
    expect(itemPicked2).toEqual(null);
  });

  it("Should set an icon item as a picked one", () => {
    const store = setupStore();
    store.dispatch(
      setIconItemPicked({
        iconListSetName: IconListSetName.uvDebugTexture,
        id: "uv2",
      })
    );
    const state = store.getState();
    const itemPicked1 = selectIconItemPicked(IconListSetName.uvDebugTexture)(
      state
    );
    expect(itemPicked1?.id).toEqual("uv2");
  });
});
