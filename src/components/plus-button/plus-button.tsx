import styled from "styled-components";
import { primaryViolet } from "../../constants/colors";

type PlusButtonProps = {
  text?: string;
  onClick: () => void;
};

const Button = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: flex-start;
  align-items: center;

  &:hover {
    > * {
      &:first-child {
        opacity: 0.4;
      }
    }
  }
`;

const PlusIcon = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  background: #605dec66;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 16px;

  &:after {
    content: "";
    position: absolute;
    transform: translate(-50%, -50%);
    height: 2px;
    width: 50%;
    background: ${primaryViolet};
    top: 50%;
    left: 50%;
  }

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${primaryViolet};
    height: 50%;
    width: 2px;
  }
`;

const ButtonText = styled.div`
  color: ${primaryViolet};
`;

export const PlusButton = ({ text = "", onClick }: PlusButtonProps) => {
  return (
    <Button onClick={onClick}>
      <PlusIcon />
      <ButtonText>{text}</ButtonText>
    </Button>
  );
};
