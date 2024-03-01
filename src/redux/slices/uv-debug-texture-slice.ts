import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ImageLoader } from "@loaders.gl/images";
import { load } from "@loaders.gl/core";
import { RootState } from "../store";
import { IIconItem, ITexture, IconListSetName } from "../../types";
import { addIconItem } from "./icon-list-slice";

import uv1 from "../../../public/images/uvTexture1.png";
import uv1Icon from "../../../public/images/uvTexture1.thumb.png";
import uv2 from "../../../public/images/uvTexture2.png";
import uv2Icon from "../../../public/images/uvTexture2.thumb.png";
import uv3 from "../../../public/images/uvTexture3.png";
import uv3Icon from "../../../public/images/uvTexture3.thumb.png";
import uv4 from "../../../public/images/uvTexture4.png";
import uv4Icon from "../../../public/images/uvTexture4.thumb.png";
import uv5 from "../../../public/images/uvTexture5.png";
import uv5Icon from "../../../public/images/uvTexture5.thumb.png";

export const TEXTURE_ICON_SIZE = 54;
export const TEXTURE_GROUP_PREDEFINED = "predefined";
export const TEXTURE_GROUP_CUSTOM = "custom";

type ImageWithLinkedIcon = {
  image: ImageBitmap | null;
  imageUrl: string;
  iconId: string;
};

// Define a type for the slice state
interface uvDebugTextureState {
  /** Array of Image Bitmap with linked icons for the debug texture */
  images: ImageWithLinkedIcon[];
}

const initialState: uvDebugTextureState = {
  images: [],
};

const uvDebugTextureSlice = createSlice({
  name: "uvDebugTexture",
  initialState,
  reducers: {
    addTexture: (
      state: uvDebugTextureState,
      action: PayloadAction<ImageWithLinkedIcon>
    ) => {
      const texture = action.payload;
      const textureObj = state.images.find(
        (item) => item.iconId === texture.iconId
      );
      if (!textureObj) {
        state.images.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchUVDebugTexture.fulfilled,
      (
        state: uvDebugTextureState,
        action: PayloadAction<ImageWithLinkedIcon>
      ) => {
        const iconItemPickedId = action.payload.iconId;
        const textureObj = state.images.find(
          (item) => item.iconId === iconItemPickedId
        );

        if (textureObj) {
          textureObj.image = action.payload.image;
        }
      }
    );
  },
});

export const addUVDebugTexture = createAsyncThunk<
  ImageWithLinkedIcon,
  { texture: ITexture; setCurrent: boolean }
>(
  "addUVDebugTexture",
  async ({ texture, setCurrent }, { getState, dispatch }) => {
    const state = (getState() as RootState).uvDebugTexture;
    const textureObj = state.images.find((item) => item.iconId === texture.id);

    if (!textureObj) {
      const imageLinkedIcon: ImageWithLinkedIcon = {
        image: null,
        imageUrl: texture.imageUrl,
        iconId: texture.id,
      };
      dispatch(uvDebugTextureSlice.actions.addTexture(imageLinkedIcon));

      const iconItem: IIconItem = {
        id: texture.id,
        icon: texture.icon,
        group: texture.group,
        custom: texture.custom,
      };
      dispatch(
        addIconItem({
          iconListSetName: IconListSetName.uvDebugTexture,
          iconItem: iconItem,
          setCurrent: setCurrent,
        })
      );

      return {
        image: null,
        imageUrl: texture.imageUrl,
        iconId: texture.id,
      };
    }

    return { image: null, imageUrl: "", iconId: "" };
  }
);

export const fetchUVDebugTexture = createAsyncThunk<
  ImageWithLinkedIcon,
  string
>("fetchUVDebugTexture", async (iconItemPickedId: string, { getState }) => {
  const state = (getState() as RootState).uvDebugTexture;
  const textureObj = state.images.find(
    (item) => item.iconId === iconItemPickedId
  );

  if (textureObj) {
    const image = (await load(textureObj.imageUrl, ImageLoader)) as ImageBitmap;
    return {
      image: image,
      imageUrl: textureObj.imageUrl,
      iconId: iconItemPickedId,
    };
  }

  return { image: null, imageUrl: "", iconId: "" };
});

export const initTextures = createAsyncThunk<void, never>(
  "initTextures",
  async (some, { dispatch }) => {
    const array: ImageWithLinkedIcon[] = [];
    const UV_DEBUG_TEXTURE_URL_ARRAY: {
      id: string;
      uv: string;
      icon: string;
    }[] = [
      { id: "uv1", uv: uv1, icon: uv1Icon },
      { id: "uv2", uv: uv2, icon: uv2Icon },
      { id: "uv3", uv: uv3, icon: uv3Icon },
      { id: "uv4", uv: uv4, icon: uv4Icon },
      { id: "uv5", uv: uv5, icon: uv5Icon },
    ];

    for (const tex of UV_DEBUG_TEXTURE_URL_ARRAY) {
      const texture: ITexture = {
        id: tex.id,
        icon: tex.icon,
        image: null,
        imageUrl: tex.uv,
        group: TEXTURE_GROUP_PREDEFINED,
        custom: false,
      };
      await dispatch(
        addUVDebugTexture({ texture: texture, setCurrent: tex.id === "uv1" })
      );
    }
  }
);

export const selectUVDebugTexture =
  (iconId: string) =>
  (state: RootState): ImageBitmap | null => {
    const textureObj = state.uvDebugTexture.images.find(
      (item) => item.iconId === iconId
    );
    return textureObj ? textureObj.image : null;
  };

export default uvDebugTextureSlice.reducer;
