declare module "*.png";

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*svg?svgr" {
  const content: any;
  export default content;
}
