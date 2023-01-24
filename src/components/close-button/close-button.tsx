import { ReactEventHandler } from "react";
import styled from "styled-components";

const CloseIcon = styled.div`
  display: flex;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;

  &::after,
  &::before {
    content: "";
    position: absolute;
    height: 16px;
    width: 2px;
    background-color: ${({ theme }) => theme.colors.fontColor};
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }

  &:hover {
    &::before,
    &::after {
      background-color: ${({ theme }) => theme.colors.mainDimColorInverted};
    }
  }
`;

const Button = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const CloseButton = ({
  onClick,
  id,
}: {
  onClick: ReactEventHandler;
  id?: string;
}) => {
  return (
    <Button id={id} onClick={onClick}>
      <CloseIcon />
    </Button>
  );
};
