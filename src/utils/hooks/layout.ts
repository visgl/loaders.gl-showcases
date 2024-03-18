import { type LayoutProperties, Layout, type LayoutProps } from "../../types";
import { useMediaQuery } from "react-responsive";

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
    (props?: LayoutProps): string | number => {
      const layoutObject = props?.$layout ?? Layout.Desktop;
      return properties[layoutObject];
    };
