import { ForwardedRef, forwardRef, SyntheticEvent } from "react";
import styled, { css, useTheme } from "styled-components";
import { ExpandState } from "../../../../types";
import { color_brand_quaternary } from "../../../../constants/colors";

import ChevronIcon from "../../../../../public/icons/chevron.svg?svgr";

type BaseMapsItemProps = {
  children: React.ReactNode;
  ref: ForwardedRef<HTMLDivElement>;
  id: string;
  selected: boolean;
  hasOptions?: boolean;
  expandState?: ExpandState;
  onClick: () => void;
  onOptionsClick?: (id: string) => void;
  onExpandClick?: () => void;
};

type ContainerProps = {
  checked: boolean;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 10px;
  background: transparent;
  cursor: pointer;
  margin-bottom: 8px;

  ${({ checked }) =>
    checked &&
    css`
      background: ${({ theme }) => theme.colors.mainHiglightColor};
      box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    `}

  &:hover {
    background: ${({ theme }) => theme.colors.mainDimColor};
    box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
`;

const ItemContentWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const OptionsButton = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
`;

const OptionsIcon = styled.div`
  position: relative;
  width: 4px;
  height: 4px;
  background-color: ${color_brand_quaternary};
  border-radius: 50%;
  margin-bottom: 12px;
  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 4px;
    height: 4px;
    left: 0px;
    background-color: ${color_brand_quaternary};
    border-radius: inherit;
  }
  &:before {
    top: 6px;
  }
  &:after {
    top: 12px;
  }
`;

const ExpandIcon = styled.div<{ expandState: ExpandState }>`
  transform: rotate(
    ${({ expandState }) =>
      expandState === ExpandState.expanded ? "" : "-"}90deg
  );
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ListItemWrapper = forwardRef(
  (props: BaseMapsItemProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      children,
      id,
      selected,
      hasOptions,
      expandState,
      onOptionsClick,
      onClick,
      onExpandClick,
    } = props;
    const theme = useTheme();
    const onExpandClickHandler = (e: SyntheticEvent) => {
      e.stopPropagation();
      onExpandClick && onExpandClick();
    };
    return (
      <Container ref={ref} checked={selected} onClick={onClick}>
        <ItemContentWrapper>{children}</ItemContentWrapper>
        {hasOptions && onOptionsClick && (
          <OptionsButton
            id={id}
            className="settings"
            onClick={() => onOptionsClick(id)}
          >
            <OptionsIcon />
          </OptionsButton>
        )}
        {expandState && (
          <ExpandIcon expandState={expandState} onClick={onExpandClickHandler}>
            <ChevronIcon fill={theme.colors.fontColor} />
          </ExpandIcon>
        )}
      </Container>
    );
  }
);
