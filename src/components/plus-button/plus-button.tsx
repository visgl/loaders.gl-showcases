import styled from "styled-components";
import { color_ui_primary } from "../../constants/colors";

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
        // Keep rgba format to avoid issue with opacity inheritance and pseudo elements.
        background: rgba(96, 93, 236, 0.2);
      }
    }
  }
`;

const PlusIcon = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  // Keep rgba format to avoid issue with opacity inheritance and pseudo elements.
  background: rgba(96, 93, 236, 0.4);
  cursor: pointer;
  border-radius: 4px;
  margin-right: 16px;

  &:after {
    content: "";
    position: absolute;
    transform: translate(-50%, -50%);
    height: 2px;
    width: 50%;
    background: ${color_ui_primary};
    top: 50%;
    left: 50%;
  }

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${color_ui_primary};
    height: 50%;
    width: 2px;
  }
`;

const ButtonText = styled.div`
  color: ${color_ui_primary};
`;

export const PlusButton = ({ text = "", onClick }: PlusButtonProps) => {
  return (
    <Button onClick={onClick}>
      <PlusIcon />
      <ButtonText>{text}</ButtonText>
    </Button>
  );
};
