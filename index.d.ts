declare module "*.png";

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*svg?svgr" {
  import React = require("react");
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  const content: any;
  export default content;
}
