import type { Sublayer } from "../types";
import { ActiveSublayer } from "./active-sublayer";

const sublayer1: Sublayer = {
  expanded: false,
  childNodesCount: 0,
  sublayers: [],
  id: 0,
  name: "Sublayer1",
  layerType: "group",
  visibility: true,
};

const sublayer2: Sublayer = {
  expanded: false,
  childNodesCount: 0,
  sublayers: [],
  id: 1,
  name: "Sublayer2",
  layerType: "group",
  visibility: true,
};

const parentSublayer: Sublayer = {
  expanded: false,
  childNodesCount: 2,
  sublayers: [sublayer1, sublayer2],
  id: 3,
  name: "ParentSublayer",
  layerType: "group",
};

describe("Active Sublayer", () => {
  it("Parent visibility should be true if all children are visible", () => {
    const activeSublayer = new ActiveSublayer(parentSublayer, true);

    expect(activeSublayer.visibility).toBe(true);
  });

  it("IsLeaf() should be true only for leafs", () => {
    const activeSublayer = new ActiveSublayer(parentSublayer, true);

    expect(activeSublayer.isLeaf()).toBe(false);
    activeSublayer.sublayers.forEach((leaf) => {
      expect(leaf.isLeaf()).toBe(true);
    });
  });

  it("onChildVisibilityChange() should update visibility according to children visibility", () => {
    const activeSublayer = new ActiveSublayer(parentSublayer, true);

    activeSublayer.sublayers[0].visibility = false;
    activeSublayer.onChildVisibilityChange();

    expect(activeSublayer.visibility).toBe(false);
  });

  it("setVisibility() should update subtree visibility", () => {
    const activeSublayer = new ActiveSublayer(parentSublayer, true);

    const changedLeafs = activeSublayer.setVisibility(false);

    activeSublayer.sublayers.forEach((leaf) => {
      expect(leaf.visibility).toBe(false);
    });
    expect(changedLeafs.length).toBe(2);
    expect(
      changedLeafs.findIndex((sublayer) => sublayer.id === 0)
    ).toBeGreaterThan(-1);
    expect(
      changedLeafs.findIndex((sublayer) => sublayer.id === 1)
    ).toBeGreaterThan(-1);
  });
});
