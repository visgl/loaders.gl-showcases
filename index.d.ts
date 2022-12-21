declare module "*.png";

declare module "*.webp";

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.mp4" {
  const content: any;
  export default content;
}

declare module "*svg?svgr" {
  const content: any;
  export default content;
}
