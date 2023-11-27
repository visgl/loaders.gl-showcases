import styled, { css } from "styled-components";
import { SelectionState } from "../../../types";

type ArcGisItemProps = {
  children: React.ReactNode;
  id: string;
  selected: SelectionState;
  onClick: () => void;
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

export const ArcGisListItemWrapper = ({
  children,
  selected,
  onClick,
}: ArcGisItemProps) => {

  return (
    <Container checked={selected === SelectionState.selected} onClick={onClick}>
      <ItemContentWrapper>{children}</ItemContentWrapper>
    </Container>
  );
};
