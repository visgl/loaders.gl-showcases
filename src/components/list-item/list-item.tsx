import { ForwardedRef, forwardRef, SyntheticEvent } from "react";
import styled, { css, useTheme } from "styled-components";
import { color_brand_quaternary } from "../../constants/colors";
import { ExpandState, ListItemType, Theme } from "../../types";
import { Checkbox } from "../checkbox/checkbox";
import { RadioButton } from "../radio-button/radio-button";

import ChevronIcon from "../../../public/icons/chevron.svg?svgr";

type ListItemProps = {
  id: string;
  title: string;
  type: ListItemType;
  selected: boolean;
  hasOptions?: boolean;
  expandState?: ExpandState;
  onChange: (id: string) => void;
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
`;

const Title = styled.div`
  margin-left: 16px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
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

const ItemContentWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
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

export const ListItem = forwardRef(
  (props: ListItemProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      id,
      title,
      type,
      selected,
      hasOptions,
      expandState,
      onChange,
      onOptionsClick,
      onExpandClick,
    } = props;
    const theme = useTheme();

    const onExpandClickHandler = (e: SyntheticEvent) => {
      e.stopPropagation();
      onExpandClick && onExpandClick();
    };

    return (
      <Container ref={ref} checked={selected} onClick={() => onChange(id)}>
        <ItemContentWrapper>
          {type === ListItemType.Checkbox ? (
            <Checkbox
              id={id}
              checked={selected}
              onChange={() => onChange(id)}
            />
          ) : (
            <RadioButton
              id={id}
              checked={selected}
              onChange={() => onChange(id)}
            />
          )}

          <Title>{title}</Title>
        </ItemContentWrapper>
        {hasOptions && onOptionsClick && (
          <OptionsButton
            className="layer-settings"
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
