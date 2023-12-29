import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ArcGisContent, ArcGisContentColumnName } from "../../types";
import { RootState } from "../store";
import { getArcGisUserContent } from "../../utils/arcgis";

// Define a type for the slice state
interface ArcGisContentState {
  /** Array of user's content items taken from ArcGIS */
  arcGisContent: ArcGisContent[];
  /** Content item selected in UI */
  arcGisContentSelected: string;
  /** Column name to sort the list by */
  sortColumn: ArcGisContentColumnName | null;
  /** Sort order: 'ascending' - true, 'descending' - false */
  sortAscending: boolean;
  /** Content loading status: when in progress - 'loading', otherwise - 'idle' */
  status: "idle" | "loading";
}

const initialState: ArcGisContentState = {
  arcGisContent: [],
  arcGisContentSelected: "",
  sortColumn: null,
  sortAscending: true,
  status: "idle",
};

const sortList = (state: ArcGisContentState) => {
  const column = state.sortColumn;
  if (column) {
    state.arcGisContent.sort((a: ArcGisContent, b: ArcGisContent) => {
      let ac = a[column];
      let bc = b[column];
      if (ac === undefined || bc === undefined || ac === null || bc === null) {
        return 0;
      }
      if (typeof ac === "string" && typeof bc === "string") {
        ac = ac.toLowerCase();
        bc = bc.toLowerCase();
      }
      if (ac === bc) {
        return 0;
      }
      const comp = state.sortAscending ? ac > bc : ac < bc;
      return comp ? 1 : -1;
    });
  }
};

const arcGisContentSlice = createSlice({
  name: "arcGisContent",
  initialState,
  reducers: {
    setSortAscending: (
      state: ArcGisContentState,
      action: PayloadAction<boolean>
    ) => {
      state.sortAscending = action.payload;
      sortList(state);
    },

    // Note, sortColumn will never be set to its initial value (null).
    // It's done on purpose. We don't support a scenario to get back to the unsorted content list.
    setSortColumn: (
      state: ArcGisContentState,
      action: PayloadAction<ArcGisContentColumnName>
    ) => {
      state.sortColumn = action.payload;
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
        sortList(state);
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
export const selectSortColumn = (state: RootState): ArcGisContentColumnName | null =>
  state.arcGisContent.sortColumn;
export const selectStatus = (state: RootState): string =>
  state.arcGisContent.status;

export const {
  setArcGisContentSelected,
  resetArcGisContentSelected,
  setSortAscending,
  setSortColumn,
} = arcGisContentSlice.actions;

export default arcGisContentSlice.reducer;
