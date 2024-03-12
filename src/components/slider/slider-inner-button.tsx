import styled, { css } from "styled-components";
import { color_brand_tertiary } from "../../constants/colors";
import { LayoutProps } from "../../types";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../utils/hooks/layout";

export const InnerButton = styled.button<
  {
    blurButton?: boolean;
    hide?: boolean;
    width?: number;
    height?: number;
  } & LayoutProps
>`
  opacity: ${({ blurButton }) => (blurButton ? 0.4 : 1)};
  display: ${({ hide }) => (hide ? "none" : "flex")};
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${color_brand_tertiary};
  fill: ${({ theme }) => theme.colors.fontColor};
  padding: 0px;

  border-radius: ${getCurrentLayoutProperty({
    desktop: "8px",
    tablet: "6px",
    mobile: "4px",
  })};

  width: ${getCurrentLayoutProperty({
    desktop: "44px",
    tablet: "34px",
    mobile: "24px",
  })};

  height: ${getCurrentLayoutProperty({
    desktop: "44px",
    tablet: "34px",
    mobile: "24px",
  })};

  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}

  ${({ height }) =>
    height &&
    css`
      height: ${height}px;
    `}
`;

type BookmarkInnerButtonProps = {
  children: React.ReactNode;
  blurButton?: boolean;
  hide?: boolean;
  width?: number;
  height?: number;
  disabled?: boolean;
  onInnerClick: () => void;
};

export const SliderInnerButton = ({
  children,
  blurButton,
  hide,
  width,
  height,
  disabled,
  onInnerClick,
}: BookmarkInnerButtonProps) => {
  const layout = useAppLayout();

  return (
    <InnerButton
      $layout={layout}
      blurButton={blurButton}
      hide={hide}
      width={width}
      height={height}
      disabled={disabled}
      onClick={onInnerClick}
    >
      {children}
    </InnerButton>
  );
};
