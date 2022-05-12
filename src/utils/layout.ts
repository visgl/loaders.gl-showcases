import type { Layout, LayoutProperties } from "./types";

import { useMediaQuery } from "react-responsive";

const DEFAULT_LAYOUT = { isMobile: true };
const DEFAULT_LAYOUT_KEY = 'isMobile';

/**
 * Detect current device
 */
export const useAppLayout = (): Layout => {
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return {
    isDesktopOrLaptop,
    isTablet,
    isMobile,
  };
};

/**
 * Return properties based on current layout
 * @param properties 
 */
export const getCurrentLayoutProperty = (properties: LayoutProperties) => (props: any): string | number => {
  const layoutObject = props?.layout || DEFAULT_LAYOUT;
  const detectedLayoutKey = Object.entries(layoutObject).find(([_, value]) => value)?.[0] || DEFAULT_LAYOUT_KEY;
  return properties[detectedLayoutKey];
};
