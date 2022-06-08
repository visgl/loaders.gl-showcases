import styled, {css} from "styled-components";
import {OptionButton} from "../option-button/option-button";

type BaseMapsItemProps = {
  children: React.ReactNode;
  id: string;
  selected?: boolean;
  hasOptions: boolean;
  onChange?: (id: string) => void;
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

  ${({checked}) =>
    checked &&
    css`
      background: ${({theme}) => theme.colors.mainHiglightColor};
      box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    `}

  &:hover {
    background: ${({theme}) => theme.colors.mainDimColor};
    box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
`;

const ItemContentWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const ListItemWrapper = ({
  children,
  id,
  selected,
  hasOptions,
  onOptionsClick,
  onChange,
}: BaseMapsItemProps) => {
  const handleClick = () => {
    if (onChange) onChange(id);
  };
  return (
    <Container checked={selected} onClick={handleClick}>
      <ItemContentWrapper>{children}</ItemContentWrapper>
      {hasOptions && <OptionButton id={id} onOptionsClick={onOptionsClick} />}
    </Container>
  );
};
