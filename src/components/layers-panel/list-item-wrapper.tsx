import { ForwardedRef, forwardRef } from "react";
import styled, { css } from "styled-components";
import { OptionButton } from "../option-button/option-button";
import { MAP_STYLES } from "../../constants/map-styles";

type BaseMapsItemProps = {
  children: React.ReactNode;
  ref?: ForwardedRef<HTMLDivElement>;
  id: string;
  selected?: boolean;
  hasOptions: boolean;
  onChange?: (id: string) => void;
  onMapClick?: ({ selectedMapStyle }) => void;
  onOptionsClick: (id: string) => void;
};

type ContainerProps = {
  checked?: boolean;
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

export const ListItemWrapper = forwardRef(({
  children,
  ref,
  id,
  selected,
  hasOptions,
  onOptionsClick,
  onMapClick,
  onChange,
}: BaseMapsItemProps) => {
  const handleClick = () => {
    if (onChange) {
      onChange(id);
    }

    if (onMapClick) {
      onMapClick({
        selectedMapStyle: MAP_STYLES[id] ? MAP_STYLES[id] : "Terrain",
      });
    }
  };

  return (
    <Container ref={ref} checked={selected} onClick={handleClick}>
      <ItemContentWrapper>{children}</ItemContentWrapper>
      {hasOptions && <OptionButton id={id} onOptionsClick={onOptionsClick} />}
    </Container>
  );
});