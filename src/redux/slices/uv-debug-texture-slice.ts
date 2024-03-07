import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ImageLoader } from "@loaders.gl/images";
import { load } from "@loaders.gl/core";
import { RootState } from "../store";

type Texture = {
  imageUrl: string;
  image: ImageBitmap | null;
};
// Define a type for the slice state
interface uvDebugTextureState {
  textureArray: Texture[];
}

const initialState: uvDebugTextureState = {
  textureArray: [],
};

const uvDebugTextureSlice = createSlice({
  name: "uvDebugTexture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchUVDebugTexture.fulfilled,
      (
        state: uvDebugTextureState,
        action: PayloadAction<{
          imageUrl: string;
          image: ImageBitmap | null;
        } | null>
      ) => {
        if (action.payload) {
          state.textureArray.push(action.payload);
        }
      }
    );
  },
});

export const fetchUVDebugTexture = createAsyncThunk<
  { imageUrl: string; image: ImageBitmap | null } | null,
  string
>("fetchUVDebugTexture", async (imageUrl, { getState }) => {
  const state = (getState() as RootState).uvDebugTexture;
  const el = state.textureArray.find((item) => item.imageUrl === imageUrl);

  if (!el || !el.image) {
    const image = (await load(imageUrl, ImageLoader)) as ImageBitmap;
    return { imageUrl: imageUrl, image: image };
  }
  return null;
});

export const selectUVDebugTexture =
  (imageUrl: string) =>
  (state: RootState): ImageBitmap | null => {
    const el = state.uvDebugTexture.textureArray.find(
      (item) => item.imageUrl === imageUrl
    );
    return el?.image || null;
  };

export default uvDebugTextureSlice.reducer;
