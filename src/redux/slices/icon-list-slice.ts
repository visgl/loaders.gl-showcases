import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IIconItem, IconListSetName } from "../../types";

import uv1 from "../../../public/images/uvTexture1.png";
import uv1Icon from "../../../public/images/uvTexture1.thumb.png";
import uv2 from "../../../public/images/uvTexture2.png";
import uv2Icon from "../../../public/images/uvTexture2.thumb.png";
import uv3 from "../../../public/images/uvTexture3.png";
import uv3Icon from "../../../public/images/uvTexture3.thumb.png";
import uv4 from "../../../public/images/uvTexture4.png";
import uv4Icon from "../../../public/images/uvTexture4.thumb.png";
import uv5 from "../../../public/images/uvTexture5.png";
import uv5Icon from "../../../public/images/uvTexture5.thumb.png";

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

const initialState = (): IIconListState => {
  const initState = { iconListSets: {} };
  const UV_DEBUG_TEXTURE_URL_ARRAY: {
    id: string;
    uv: string;
    icon: string;
  }[] = [
    { id: "uv1", uv: uv1, icon: uv1Icon },
    { id: "uv2", uv: uv2, icon: uv2Icon },
    { id: "uv3", uv: uv3, icon: uv3Icon },
    { id: "uv4", uv: uv4, icon: uv4Icon },
    { id: "uv5", uv: uv5, icon: uv5Icon },
  ];

  for (const tex of UV_DEBUG_TEXTURE_URL_ARRAY) {
    const texture: IIconItem = {
      id: tex.id,
      icon: tex.icon,
      extData: { imageUrl: tex.uv },
      custom: false,
    };
    addItem(initState, {
      iconListSetName: IconListSetName.uvDebugTexture,
      iconItem: texture,
      setCurrent: tex.id === "uv1",
    });
  }
  return initState;
};

const iconListSlice = createSlice({
  name: "iconList",
  initialState,
  reducers: {
    addIconItem: (
      state: IIconListState,
      action: PayloadAction<{
        iconListSetName: string;
        iconItem: IIconItem;
        setCurrent: boolean;
      }>
    ) => {
      addItem(state, action.payload);
    },
    setIconItemPicked: (
      state: IIconListState,
      action: PayloadAction<{
        iconListSetName: string;
        id: string;
      }>
    ) => {
      const arg = action.payload;
      state.iconListSets[arg.iconListSetName].iconItemIdPicked = arg.id;
    },
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
});

const addItem = (
  state: IIconListState,
  arg: {
    iconListSetName: string;
    iconItem: IIconItem;
    setCurrent: boolean;
  }
) => {
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
    state.iconListSets[arg.iconListSetName].iconList.push(arg.iconItem);
  }
  if (arg.setCurrent) {
    state.iconListSets[arg.iconListSetName].iconItemIdPicked = arg.iconItem.id;
  }
};

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

export const { addIconItem, deleteIconItem, setIconItemPicked } =
  iconListSlice.actions;

export default iconListSlice.reducer;
