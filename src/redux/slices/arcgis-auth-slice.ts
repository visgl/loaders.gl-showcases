import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getAuthenticatedUser, arcGisRequestLogin, arcGisRequestLogout } from '../../utils/arcgis-auth';

// Define a type for the slice state
export interface ArcGisAuthState {
  user: string;
}

const initialState: ArcGisAuthState = {
  user: getAuthenticatedUser(),
}

const arcGisAuthSlice = createSlice({
  name: "arcGisAuth",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(arcGisLogin.fulfilled, (state, action) => {
      state.user = action.payload || '';
    })
      .addCase(arcGisLogout.fulfilled, (state) => {
        state.user = '';
      })
  },
});

export const arcGisLogin = createAsyncThunk(
  'arcGisLogin',
  async () => {
    return await arcGisRequestLogin();
  }
);

export const arcGisLogout = createAsyncThunk(
  'arcGisLogout',
  async () => {
    return await arcGisRequestLogout();
  }
);

export const selectUser = (state: RootState): string =>
  state.arcGisAuth.user;

export default arcGisAuthSlice.reducer;
