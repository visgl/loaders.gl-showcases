import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type BaseMap } from "../../types";
import { BASE_MAPS } from "../../constants/map-styles";
import { type RootState } from "../store";
import { createSelector } from "reselect";

// Define a type for the slice state
export interface BaseMapsState {
  basemaps: BaseMap[];
  selectedBaseMapId: string;
}
const initialState: BaseMapsState = {
  basemaps: BASE_MAPS,
  selectedBaseMapId: BASE_MAPS[0]?.id ?? "",
};
const baseMapsSlice = createSlice({
  name: "baseMaps",
  initialState,
  reducers: {
    setInitialBaseMaps: () => {
      return initialState;
    },
    addBaseMap: (state: BaseMapsState, action: PayloadAction<BaseMap>) => {
      state.basemaps.push(action.payload);
      state.selectedBaseMapId = action.payload.id;
    },
    setSelectedBaseMap: (
      state: BaseMapsState,
      action: PayloadAction<string>
    ) => {
      const newMap = state.basemaps.find((map) => map.id === action.payload);
      if (newMap) {
        state.selectedBaseMapId = action.payload;
      }
    },
    deleteBaseMap: (state: BaseMapsState, action: PayloadAction<string>) => {
      const idToDelete = action.payload;
      state.basemaps = state.basemaps.filter(
        (keepMap) => keepMap.id !== idToDelete
      );
      if (state.selectedBaseMapId === idToDelete) {
        state.selectedBaseMapId = state.basemaps[0]?.id ?? "";
      }
    },
  },
});

export const selectSelectedBaseMap = createSelector(
  [
    (state: RootState) => state.baseMaps.basemaps,
    (state: RootState) => state.baseMaps.selectedBaseMapId,
  ],
  (maps, selectedId): BaseMap | null => {
    const el = maps.find((item) => item.id === selectedId);
    return el ?? null;
  }
);

export const selectBaseMapsByGroup = createSelector(
  [
    (state: RootState) => state.baseMaps.basemaps,
    (_: RootState, group: string) => group,
  ],
  (maps, group): BaseMap[] => {
    return group ? maps.filter((item) => item.group === group) : maps;
  }
);

export const { setInitialBaseMaps } = baseMapsSlice.actions;
export const { addBaseMap } = baseMapsSlice.actions;
export const { setSelectedBaseMap } = baseMapsSlice.actions;
export const { deleteBaseMap } = baseMapsSlice.actions;
export default baseMapsSlice.reducer;
