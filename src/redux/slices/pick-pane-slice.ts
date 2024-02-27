import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IPickPane } from "../../types";

/**
 *  PickPaneSet "BaseMap"
 *    [
 *      {group:"ArcGIS",   icon:"1", id:"k10", custom:false, mapUrl:"x1", name:"A", ...},
 *      {group:"ArcGIS",   icon:"2", id:"k11", custom:false, mapUrl:"x1", name:"B", ...},
 *      {group:"Maplibre", icon:"3", id:"k20", custom:false, mapUrl:"x1", name:"C", ...},
 *      {group:"Maplibre", icon:"4", id:"k21", custom:false, mapUrl:"x1", name:"D", ...},
 *      {group:"UserMap",  icon:"5", id:"k30", custom:true,  mapUrl:"x1", name:"C", ...},
 *      {group:"UserMap",  icon:"6", id:"k31", custom:true,  mapUrl:"x1", name:"D", ...},
 *    ]
 *    pickedId: "k20"
 *
 *  PickPaneSet "uvDebugTexture"
 *    [
 *      {group:"HQ", icon:"6", id:"k60", custom:false, image: {}},
 *      {group:"HQ", icon:"7", id:"k61", custom:true,  image: {}},
 *      {group:"LQ", icon:"8", id:"k70", custom:false, image: {}},
 *      {group:"LQ", icon:"9", id:"k71", custom:true,  image: {}},
 *    ]
 *    pickedId: "k70"
 */
interface IPickPaneSet {
  pickPanes: IPickPane[];
  pickedPickPaneId: string;
}

/**
 * @example "BaseMap", "uvDebugTexture", "desktopBackground"
 */
interface IPickPaneState {
  pickPaneSets: Record<string, IPickPaneSet>;
}

const initialState: IPickPaneState = {
  pickPaneSets: {},
};

const pickPaneSlice = createSlice({
  name: "pickPane",
  initialState,
  reducers: {
    deletePickPane: (
      state: IPickPaneState,
      action: PayloadAction<{
        pickPaneSetName: string;
        id: string;
      }>
    ) => {
      const arg = action.payload;
      const sets = state.pickPaneSets[arg.pickPaneSetName];
      const element = sets?.pickPanes.find((item) => item.id === arg.id);
      // "custom" element only can be deleted.
      if (element && element.custom) {
        sets.pickPanes = sets.pickPanes.filter((item) => item.id !== arg.id);
        if (sets.pickedPickPaneId === arg.id) {
          sets.pickedPickPaneId = "";
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        addPickPane.fulfilled,
        (
          state: IPickPaneState,
          action: PayloadAction<{
            pickPaneSetName: string;
            pickPane: IPickPane;
            picked: string | null;
            index: number | undefined;
          }>
        ) => {
          const arg = action.payload;
          if (!state.pickPaneSets[arg.pickPaneSetName]) {
            state.pickPaneSets[arg.pickPaneSetName] = {
              pickPanes: [],
              pickedPickPaneId: "",
            };
          }
          const element =
            arg.pickPane.id &&
            state.pickPaneSets[arg.pickPaneSetName].pickPanes.find(
              (item) => item.id === arg.pickPane.id
            );
          if (!element) {
            if (typeof arg.index === "number") {
              state.pickPaneSets[arg.pickPaneSetName].pickPanes.splice(
                arg.index,
                0,
                arg.pickPane
              );
            } else {
              state.pickPaneSets[arg.pickPaneSetName].pickPanes.push(
                arg.pickPane
              );
            }
          }
          if (arg.picked) {
            state.pickPaneSets[arg.pickPaneSetName].pickedPickPaneId =
              arg.pickPane.id;
          }
        }
      )
      .addCase(
        setPickPanePicked.fulfilled,
        (
          state: IPickPaneState,
          action: PayloadAction<{
            pickPaneSetName: string;
            pickPane: IPickPane | null;
          }>
        ) => {
          const arg = action.payload;
          state.pickPaneSets[arg.pickPaneSetName].pickedPickPaneId =
            arg.pickPane?.id || "";
        }
      );
  },
});

export const addPickPane = createAsyncThunk<
  {
    pickPaneSetName: string;
    pickPane: IPickPane;
    picked: string | null;
    index: number | undefined;
  },
  {
    pickPaneSetName: string;
    pickPane: IPickPane;
    setCurrent: boolean;
    index?: number;
  }
>("addPickPane", async ({ pickPaneSetName, pickPane, setCurrent, index }) => {
  // if setCurrent === true, we need to fetch the content
  // if setCurrent === false, it's enough to fetch the icon only.
  // The content will be fetched when the user pick a pane.
  await pickPane.fetchPickPane(setCurrent);
  const picked = setCurrent ? pickPane.id : null;
  return {
    pickPaneSetName: pickPaneSetName,
    pickPane: pickPane,
    picked: picked,
    index: index,
  };
});

export const setPickPanePicked = createAsyncThunk<
  { pickPaneSetName: string; pickPane: IPickPane | null },
  { pickPaneSetName: string; id: string }
>("setPickPanePicked", async ({ pickPaneSetName, id }, { getState }) => {
  const state = (getState() as RootState).pickPane;
  const sets = state.pickPaneSets[pickPaneSetName];
  const pickedItem = sets?.pickPanes.find((item) => item.id === id);
  if (pickedItem) {
    await pickedItem.fetchPickPane(true);
  }
  return { pickPaneSetName: pickPaneSetName, pickPane: pickedItem || null };
});

export const selectPickPaneArray =
  (pickPaneSetName: string) =>
  (state: RootState): IPickPane[] => {
    return state.pickPane.pickPaneSets[pickPaneSetName]?.pickPanes || [];
  };

export const selectPickPaneSet =
  (pickPaneSetName: string) =>
  (state: RootState): IPickPaneSet | null => {
    return state.pickPane.pickPaneSets[pickPaneSetName] || null;
  };

export const selectPickPanePicked =
  (pickPaneSetName: string) =>
  (state: RootState): IPickPane | null => {
    const pickPaneSet = state.pickPane.pickPaneSets[pickPaneSetName];
    const texture = pickPaneSet?.pickPanes.find(
      (item) => item.id === pickPaneSet.pickedPickPaneId
    );
    return texture || null;
  };

export const selectPickPaneById =
  (pickPaneSetName: string, id: string) =>
  (state: RootState): IPickPane | null => {
    const pickPaneSet = state.pickPane.pickPaneSets[pickPaneSetName];
    const texture = pickPaneSet?.pickPanes.find((item) => item.id === id);
    return texture || null;
  };

export const selectPickPanePickedId =
  (pickPaneSetName: string) =>
  (state: RootState): string => {
    const pickPaneSet = state.pickPane.pickPaneSets[pickPaneSetName];
    return pickPaneSet?.pickedPickPaneId || "";
  };

export const { deletePickPane } = pickPaneSlice.actions;

export default pickPaneSlice.reducer;
