import type { LayoutProperties } from "./types";

import { useMediaQuery } from "react-responsive";
import { Layout } from "./enums";

/**
 * Detect current device
 */
export const useAppLayout = (): Layout => {
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  switch (true) {
    case isDesktopOrLaptop:
      return Layout.Desktop;
    case isTablet:
      return Layout.Tablet;
    case isMobile:
      return Layout.Mobile;
    default:
      return Layout.Desktop;
  }
};

/**
 * Return properties based on current layout
 * @param properties
 */
export const getCurrentLayoutProperty =
  (properties: LayoutProperties) =>
  (props: any): string | number => {
    const layoutObject = props?.layout || Layout.Desktop;
    return properties[layoutObject];
  };
