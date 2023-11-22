import { ArcGISIdentityManager } from '@esri/arcgis-rest-request';

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
//export type ArcgisContent = {
import { ArcgisContent } from "../../types";
import { RootState } from "../store";
import { arcGisContent } from '../../utils/arcgis-auth';

// Define a type for the slice state
interface ArcgisContentState {
  arcgisContent: ArcgisContent[];
  selectedArcgisContent: string;
}
const initialState: ArcgisContentState = {
  arcgisContent: [],
  selectedArcgisContent: '',
};

export const arcgisContent = createAsyncThunk<
ArcgisContent[]
>
(
  'arcgis/content',
  async (): Promise<ArcgisContent[]> => {
    const response: ArcgisContent[] = await arcGisContent();
    return response;
  }
);

const arcgisContentSlice = createSlice({
  name: "arcgisContent",
  initialState,
  reducers: {
    setInitialArcgisContent: () => {
      return initialState;
    },
    addArcgisContent: (state: ArcgisContentState, action: PayloadAction<ArcgisContent>) => {
      state.arcgisContent.push(action.payload);
      state.selectedArcgisContent = action.payload.id;
    },
    setSelectedArcgisContent: (
      state: ArcgisContentState,
      action: PayloadAction<string>
    ) => {
      const newMap = state.arcgisContent.find((map) => map.id === action.payload);
      if (newMap) {
        state.selectedArcgisContent = action.payload;
      }
    },
    deleteArcgisContent: (state: ArcgisContentState, action: PayloadAction<string>) => {
      state.arcgisContent = state.arcgisContent.filter(
        (keepMap) => keepMap.id !== action.payload
      );
      state.selectedArcgisContent = state.arcgisContent[0].id;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(arcgisContent.fulfilled, (state, action) => {
      const content = action.payload;
      state.arcgisContent = [];
      for (let c of content) {
        state.arcgisContent.push(c); //push(action.payload || '');
      }
//      return { ...state, ...action.payload };
    })
  },

});

export const selectArcgisContent = (state: RootState): ArcgisContent[] =>
  state.arcgisContent.arcgisContent;
export const selectSelectedArcgisContentId = (state: RootState): string =>
  state.arcgisContent.selectedArcgisContent;

export const { setInitialArcgisContent } = arcgisContentSlice.actions;
export const { addArcgisContent } = arcgisContentSlice.actions;
export const { setSelectedArcgisContent } = arcgisContentSlice.actions;
export const { deleteArcgisContent } = arcgisContentSlice.actions;
export default arcgisContentSlice.reducer;
