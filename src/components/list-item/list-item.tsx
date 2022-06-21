import { ForwardedRef, forwardRef } from "react";
import styled, { css } from "styled-components";
import { color_brand_quaternary } from "../../constants/colors";
import { ListItemType } from "../../types";
import { Checkbox } from "../checkbox/checkbox";
import { RadioButton } from "../radio-button/radio-button";

type ListItemProps = {
  id: string;
  title: string;
  type: ListItemType;
  selected: boolean;
  hasOptions?: boolean;
  onChange: (id: string) => void;
  onOptionsClick?: (id: string) => void;
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

export const ListItem = forwardRef(
  (props: ListItemProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { id, title, type, selected, hasOptions, onChange, onOptionsClick } =
      props;
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
      </Container>
    );
  }
);
