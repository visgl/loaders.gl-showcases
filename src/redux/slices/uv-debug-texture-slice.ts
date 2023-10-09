import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ImageLoader } from "@loaders.gl/images";
import { load } from "@loaders.gl/core";
import { RootState } from "../store";

// Define a type for the slice state
interface uvDebugTextureState {
  /** Image Bitmap for the debug texture */
  value: ImageBitmap | null;
}

const initialState: uvDebugTextureState = {
  value: null,
};

const UV_DEBUG_TEXTURE_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/images/uv-debug-texture.jpg";

const uvDebugTextureSlice = createSlice({
  name: "uvDebugTexture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchUVDebugTexture.fulfilled,
      (
        state: uvDebugTextureState,
        action: PayloadAction<uvDebugTextureState>
      ) => {
        return action.payload;
      }
    );
  },
});

export const fetchUVDebugTexture = createAsyncThunk<uvDebugTextureState>(
  "fetchUVDebugTexture",
  async () => {
    const image = (await load(
      UV_DEBUG_TEXTURE_URL,
      ImageLoader
    )) as ImageBitmap;

    return { value: image };
  }
);

export const selectUVDebugTexture = (state: RootState): ImageBitmap | null =>
  state.uvDebugTexture.value;

export default uvDebugTextureSlice.reducer;
