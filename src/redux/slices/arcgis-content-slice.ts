import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ArcGisContent } from "../../types";
import { RootState } from "../store";
import { getArcGisUserContent } from "../../utils/arcgis";

// Define a type for the slice state
interface ArcGisContentState {
  arcGisContent: ArcGisContent[];
  arcGisContentSelected: string;
  sortColumn: string;
  sortAscending: boolean;
  status: "idle" | "loading";
}

const initialState: ArcGisContentState = {
  arcGisContent: [],
  arcGisContentSelected: "",
  sortColumn: "",
  sortAscending: false,
  status: "idle",
};

const sortList = (state: ArcGisContentState) => {
  const column = state.sortColumn;
  if (column) {
    state.arcGisContent.sort((a: ArcGisContent, b: ArcGisContent) => {
      let ac = a[column];
      let bc = b[column];
      if (typeof ac === "string") {
        ac = ac.toLowerCase();
        bc = bc.toLowerCase();
      }
      if (ac === bc) {
        return 0;
      }
      const comp = state.sortAscending ? ac > bc : ac < bc;
      return comp ? -1 : 1;
    });
  }
};

const arcGisContentSlice = createSlice({
  name: "arcGisContent",
  initialState,
  reducers: {
    setInitialArcGisContent: () => {
      return initialState;
    },

    setSortAscending: (
      state: ArcGisContentState,
      action: PayloadAction<boolean>
    ) => {
      state.sortAscending = action.payload;
      sortList(state);
    },

    setSortColumn: (
      state: ArcGisContentState,
      action: PayloadAction<string>
    ) => {
      state.sortColumn = action.payload;
      sortList(state);
    },

    addArcGisContent: (
      state: ArcGisContentState,
      action: PayloadAction<ArcGisContent>
    ) => {
      state.arcGisContent.push(action.payload);
      sortList(state);
    },

    deleteArcGisContent: (
      state: ArcGisContentState,
      action: PayloadAction<string>
    ) => {
      state.arcGisContent = state.arcGisContent.filter(
        (map) => map.id !== action.payload
      );
      if (state.arcGisContentSelected === action.payload) {
        state.arcGisContentSelected = "";
      }
      sortList(state);
    },

    setArcGisContentSelected: (
      state: ArcGisContentState,
      action: PayloadAction<string>
    ) => {
      const item = state.arcGisContent.find(
        (item) => item.id === action.payload
      );
      if (item) {
        state.arcGisContentSelected = action.payload;
      }
    },

    resetArcGisContentSelected: (state: ArcGisContentState) => {
      state.arcGisContentSelected = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getArcGisContent.fulfilled, (state, action) => {
        state.arcGisContent = [...action.payload];
        state.status = "idle";
      })
      .addCase(getArcGisContent.pending, (state) => {
        state.status = "loading";
      });
  },
});

export const getArcGisContent = createAsyncThunk<ArcGisContent[]>(
  "getArcGisContent",
  async (): Promise<ArcGisContent[]> => {
    const response: ArcGisContent[] = await getArcGisUserContent();
    return response;
  }
);

export const selectArcGisContent = (state: RootState): ArcGisContent[] =>
  state.arcGisContent.arcGisContent;
export const selectArcGisContentSelected = (state: RootState): string =>
  state.arcGisContent.arcGisContentSelected;
export const selectSortAscending = (state: RootState): boolean =>
  state.arcGisContent.sortAscending;
export const selectSortColumn = (state: RootState): string =>
  state.arcGisContent.sortColumn;
export const selectStatus = (state: RootState): string =>
  state.arcGisContent.status;

export const {
  setInitialArcGisContent,
  addArcGisContent,
  setArcGisContentSelected,
  resetArcGisContentSelected,
  deleteArcGisContent,
  setSortAscending,
  setSortColumn,
} = arcGisContentSlice.actions;

export default arcGisContentSlice.reducer;
