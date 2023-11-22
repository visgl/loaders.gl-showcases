import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getAuthenticatedUser, myArcGisLogin, myArcGisLogout } from '../../utils/arcgis-auth';

// Define a type for the slice state
export interface ArcGisAuthState {
  /** Show ... */
  user: string;
  authenticated: boolean;
}

const initialState: ArcGisAuthState = {
  user: getAuthenticatedUser(),
  authenticated: false,
}

export const arcgisLogin = createAsyncThunk(
  'arcgis/login',
  async () => {
    const response = await myArcGisLogin();
    return response;
  }
);

export const arcgisLogout = createAsyncThunk(
  'arcgis/logout',
  async () => {
    const response = await myArcGisLogout();
    return response;
  }
);

const arcGisAuthSlice = createSlice({
  name: "arcGisAuth",
  initialState,
  reducers: {
    resetArcGisAuth: () => {
      return initialState;
    },
    setArcGisAuth: (
      state: ArcGisAuthState,
      action: PayloadAction<Partial<ArcGisAuthState>>
    ) => {
      return { ...state, ...action.payload };
    },
    // requestArcGisAuth: () => {
    //   return {user: '', authenticated: false, fetching: true};
    // },
  },
  extraReducers: (builder) => {
      builder.addCase(arcgisLogin.fulfilled, (state, action) => {
        state.user = action.payload || '';
        state.authenticated  =true;
      })
      .addCase(arcgisLogout.fulfilled, (state, action) => {
        state.user = '';
        state.authenticated  = false;
      })
    },
});


export const selectUser = (state: RootState): string =>
  state.arcgisAuth.user;

export const selectAuthenticated = (state: RootState): boolean =>
  state.arcgisAuth.authenticated;

export const { resetArcGisAuth } = arcGisAuthSlice.actions;
export const { setArcGisAuth } = arcGisAuthSlice.actions;
export default arcGisAuthSlice.reducer;
