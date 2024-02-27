import { ImageLoader } from "@loaders.gl/images";
import { load } from "@loaders.gl/core";
import { ITexture } from "../types";
import { drawBitmap } from "../utils/debug/texture-render-utils";
import md5 from "md5";

import uv1 from "../../public/images/uvTexture1.png";
import uv1Icon from "../../public/images/uvTexture1.thumb.png";
import uv2 from "../../public/images/uvTexture2.png";
import uv2Icon from "../../public/images/uvTexture2.thumb.png";
import uv3 from "../../public/images/uvTexture3.png";
import uv3Icon from "../../public/images/uvTexture3.thumb.png";
import uv4 from "../../public/images/uvTexture4.png";
import uv4Icon from "../../public/images/uvTexture4.thumb.png";
import uv5 from "../../public/images/uvTexture5.png";
import uv5Icon from "../../public/images/uvTexture5.thumb.png";

import { addPickPane } from "../redux/slices/pick-pane-slice";
import { PickPaneSetName } from "../types";

export const TEXTURE_ICON_SIZE = 54;
export const TEXTURE_GROUP_PREDEFINED = "predefined";
export const TEXTURE_GROUP_CUSTOM = "custom";

export class Texture implements ITexture {
  // IPickPane:
  id: string;
  icon: string;
  group: string;
  name?: string;
  custom?: boolean;

  // ITexture:
  image: ImageBitmap | null = null;

  // class properties:
  iconUrl?: string;
  iconPanelSize: number;
  imageUrl: string;
  imageArrayBuffer?: string | ArrayBuffer;

  constructor(texture: {
    id?: string;
    imageUrl: string;
    imageArrayBuffer?: string | ArrayBuffer;
    iconUrl?: string;
    iconPanelSize: number;
    group: string;
    name?: string;
    custom?: boolean;
  }) {
    this.iconUrl = texture.iconUrl;
    this.icon = texture.iconUrl || "";

    this.iconPanelSize = texture.iconPanelSize;
    this.group = texture.group;
    this.name = texture.name;
    this.imageUrl = texture.imageUrl;
    this.imageArrayBuffer = texture.imageArrayBuffer;
    this.custom = texture.custom;

    if (texture.id) {
      this.id = texture.id;
    } else {
      const hash = md5(this.imageUrl);
      this.id = `${hash}`;
    }
  }

  fetchPickPane = async (fetchContent: boolean): Promise<void> => {
    if (!this.image && (fetchContent || (!this.iconUrl && !this.icon))) {
      this.image = (await load(
        this.imageArrayBuffer || this.imageUrl,
        ImageLoader
      )) as ImageBitmap;
    }

    if (!this.icon) {
      if (this.iconUrl) {
        this.icon = this.iconUrl;
      } else if (this.image) {
        this.icon = drawBitmap(this.image, this.iconPanelSize)?.url;
      }
    }
  };
}

export const initTexturePickPanes = async (dispatch) => {
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
    const texture = new Texture({
      id: tex.id,
      imageUrl: tex.uv,
      iconUrl: tex.icon,
      iconPanelSize: TEXTURE_ICON_SIZE,
      group: TEXTURE_GROUP_PREDEFINED,
      custom: false,
    });

    await dispatch(
      addPickPane({
        pickPaneSetName: PickPaneSetName.uvDebugTexture,
        pickPane: texture,
        setCurrent: tex.id === "uv1",
      })
    );
  }
};
