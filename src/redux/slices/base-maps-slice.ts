import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type BaseMap } from "../../types";
import { BASE_MAPS } from "../../constants/map-styles";
import { type RootState } from "../store";
import { createSelector } from "reselect";

// Define a type for the slice state
export interface BaseMapsState {
  baseMap: BaseMap[];
  selectedBaseMap: string;
}
const initialState: BaseMapsState = {
  baseMap: BASE_MAPS,
  selectedBaseMap: BASE_MAPS[0]?.id ?? "",
};
const baseMapsSlice = createSlice({
  name: "baseMaps",
  initialState,
  reducers: {
    setInitialBaseMaps: () => {
      return initialState;
    },
    addBaseMap: (state: BaseMapsState, action: PayloadAction<BaseMap>) => {
      state.baseMap.push(action.payload);
      state.selectedBaseMap = action.payload.id;
    },
    setSelectedBaseMaps: (
      state: BaseMapsState,
      action: PayloadAction<string>
    ) => {
      const newMap = state.baseMap.find((map) => map.id === action.payload);
      if (newMap) {
        state.selectedBaseMap = action.payload;
      }
    },
    deleteBaseMaps: (state: BaseMapsState, action: PayloadAction<string>) => {
      const idToDelete = action.payload;
      state.baseMap = state.baseMap.filter(
        (keepMap) => keepMap.id !== idToDelete
      );
      if (state.selectedBaseMap === idToDelete) {
        state.selectedBaseMap = state.baseMap[0]?.id ?? "";
      }
    },
  },
});

export const selectSelectedBaseMap = createSelector(
  [
    (state: RootState) => state.baseMaps.baseMap,
    (state: RootState) => state.baseMaps.selectedBaseMap,
  ],
  (maps, selectedId): BaseMap | null => {
    const el = maps.find((item) => item.id === selectedId);
    return el ?? null;
  }
);

export const selectBaseMapsByGroup = createSelector(
  [
    (state: RootState) => state.baseMaps.baseMap,
    (_: RootState, group: string) => group,
  ],
  (maps, group): BaseMap[] => {
    return group ? maps.filter((item) => item.group === group) : maps;
  }
);

export const { setInitialBaseMaps } = baseMapsSlice.actions;
export const { addBaseMap } = baseMapsSlice.actions;
export const { setSelectedBaseMaps } = baseMapsSlice.actions;
export const { deleteBaseMaps } = baseMapsSlice.actions;
export default baseMapsSlice.reducer;
