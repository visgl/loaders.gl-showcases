import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IIconItem } from "../../types";

/**
 *  IconListSet "BaseMap"
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
 *  IconListSet "uvDebugTexture"
 *    [
 *      {group:"HQ", icon:"6", id:"k60", custom:false, image: {}},
 *      {group:"HQ", icon:"7", id:"k61", custom:true,  image: {}},
 *      {group:"LQ", icon:"8", id:"k70", custom:false, image: {}},
 *      {group:"LQ", icon:"9", id:"k71", custom:true,  image: {}},
 *    ]
 *    pickedId: "k70"
 */
interface IIconListSet {
  iconList: IIconItem[];
  iconItemIdPicked: string;
}

/**
 * @example "BaseMap", "uvDebugTexture", "desktopBackground"
 */
interface IIconListState {
  iconListSets: Record<string, IIconListSet>;
}

const initialState: IIconListState = {
  iconListSets: {},
};

const iconListSlice = createSlice({
  name: "iconList",
  initialState,
  reducers: {
    deleteIconItem: (
      state: IIconListState,
      action: PayloadAction<{
        iconListSetName: string;
        id: string;
      }>
    ) => {
      const arg = action.payload;
      const sets = state.iconListSets[arg.iconListSetName];
      const element = sets?.iconList.find((item) => item.id === arg.id);
      // "custom" element only can be deleted.
      if (element && element.custom) {
        sets.iconList = sets.iconList.filter((item) => item.id !== arg.id);
        if (sets.iconItemIdPicked === arg.id) {
          sets.iconItemIdPicked = "";
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        addIconItem.fulfilled,
        (
          state: IIconListState,
          action: PayloadAction<{
            iconListSetName: string;
            iconItem: IIconItem;
            picked: string | null;
            index: number | undefined;
          }>
        ) => {
          const arg = action.payload;
          if (!state.iconListSets[arg.iconListSetName]) {
            state.iconListSets[arg.iconListSetName] = {
              iconList: [],
              iconItemIdPicked: "",
            };
          }
          const element =
            arg.iconItem.id &&
            state.iconListSets[arg.iconListSetName].iconList.find(
              (item) => item.id === arg.iconItem.id
            );
          if (!element) {
            if (typeof arg.index === "number") {
              state.iconListSets[arg.iconListSetName].iconList.splice(
                arg.index,
                0,
                arg.iconItem
              );
            } else {
              state.iconListSets[arg.iconListSetName].iconList.push(
                arg.iconItem
              );
            }
          }
          if (arg.picked) {
            state.iconListSets[arg.iconListSetName].iconItemIdPicked =
              arg.iconItem.id;
          }
        }
      )
      .addCase(
        setIconItemPicked.fulfilled,
        (
          state: IIconListState,
          action: PayloadAction<{
            iconListSetName: string;
            iconList: IIconItem | null;
          }>
        ) => {
          const arg = action.payload;
          state.iconListSets[arg.iconListSetName].iconItemIdPicked =
            arg.iconList?.id || "";
        }
      );
  },
});

export const addIconItem = createAsyncThunk<
  {
    iconListSetName: string;
    iconItem: IIconItem;
    picked: string | null;
    index: number | undefined;
  },
  {
    iconListSetName: string;
    iconItem: IIconItem;
    setCurrent: boolean;
    index?: number;
  }
>("addIconItem", async ({ iconListSetName, iconItem, setCurrent, index }) => {
  // if setCurrent === true, we need to fetch the content
  // if setCurrent === false, it's enough to fetch the icon only.
  // The content will be fetched when the user pick an icon.

  await iconItem.fetchPickPane(setCurrent);
  const picked = setCurrent ? iconItem.id : null;
  return {
    iconListSetName: iconListSetName,
    iconItem: iconItem,
    picked: picked,
    index: index,
  };
});

export const setIconItemPicked = createAsyncThunk<
  { iconListSetName: string; iconList: IIconItem | null },
  { iconListSetName: string; id: string }
>("setIconItemPicked", async ({ iconListSetName, id }, { getState }) => {
  const state = (getState() as RootState).iconList;
  const sets = state.iconListSets[iconListSetName];
  const pickedItem = sets?.iconList.find((item) => item.id === id);
  if (pickedItem) {
    await pickedItem.fetchPickPane(true);
  }
  return { iconListSetName: iconListSetName, iconList: pickedItem || null };
});

export const selectIconList =
  (iconListSetName: string, group?: string) =>
  (state: RootState): IIconItem[] => {
    const panes = state.iconList.iconListSets[iconListSetName]?.iconList || [];
    return group ? panes.filter((item) => item.group === group) : panes;
  };

export const selectIconItemPicked =
  (iconListSetName: string) =>
  (state: RootState): IIconItem | null => {
    const iconListSet = state.iconList.iconListSets[iconListSetName];
    const texture = iconListSet?.iconList.find(
      (item) => item.id === iconListSet.iconItemIdPicked
    );
    return texture || null;
  };

export const selectIconItemPickedId =
  (iconListSetName: string) =>
  (state: RootState): string => {
    const iconListSet = state.iconList.iconListSets[iconListSetName];
    return iconListSet?.iconItemIdPicked || "";
  };

export const { deleteIconItem } = iconListSlice.actions;

export default iconListSlice.reducer;
