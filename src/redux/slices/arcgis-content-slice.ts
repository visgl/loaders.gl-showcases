import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ArcGisContent } from "../../types";
import { RootState } from "../store";
import { getArcGisUserContent } from '../../utils/arcgis-auth';

// Define a type for the slice state
interface ArcGisContentState {
  arcGisContent: ArcGisContent[];
  arcGisContentSelected: string;
}
const initialState: ArcGisContentState = {
  arcGisContent: [],
  arcGisContentSelected: '',
};

const arcGisContentSlice = createSlice({
  name: "arcGisContent",
  initialState,
  reducers: {
    setInitialArcGisContent: () => {
      return initialState;
    },

    // Content
    addArcGisContent: (state: ArcGisContentState, action: PayloadAction<ArcGisContent>) => {
      state.arcGisContent.push(action.payload);
    },
    deleteArcGisContent: (state: ArcGisContentState, action: PayloadAction<string>) => {
      state.arcGisContent = state.arcGisContent.filter( (map) => map.id !== action.payload );
      if (state.arcGisContentSelected === action.payload) {
        state.arcGisContentSelected = '';
      }
    },

    // Content Selected
    setArcGisContentSelected: (
      state: ArcGisContentState,
      action: PayloadAction<string>
    ) => {
      const item = state.arcGisContent.find((item) => item.id === action.payload);
      if (item) {
        state.arcGisContentSelected = action.payload;
      }
    },
    resetArcGisContentSelected: (
      state: ArcGisContentState
    ) => {
      state.arcGisContentSelected = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getArcGisContent.fulfilled, (state, action) => {
      state.arcGisContent = [...action.payload];
    })
  },

});

export const getArcGisContent = createAsyncThunk<
ArcGisContent[]
>
(
  'getArcGisContent',
  async (): Promise<ArcGisContent[]> => {
    const response: ArcGisContent[] = await getArcGisUserContent();
    return response;
  }
);

export const selectArcGisContent = (state: RootState): ArcGisContent[] =>
  state.arcGisContent.arcGisContent;
export const selectArcGisContentSelected = (state: RootState): string =>
  state.arcGisContent.arcGisContentSelected;

export const { setInitialArcGisContent } = arcGisContentSlice.actions;
export const { addArcGisContent } = arcGisContentSlice.actions;
export const { setArcGisContentSelected } = arcGisContentSlice.actions;
export const { resetArcGisContentSelected } = arcGisContentSlice.actions;
export const { deleteArcGisContent } = arcGisContentSlice.actions;
export default arcGisContentSlice.reducer;
