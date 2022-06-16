import styled from "styled-components";
import {color_brand_tertiary} from "../../constants/colors";

type PlusButtonProps = {
  children?: React.ReactNode;
  buttonSize: number;
  onClick?: () => void;
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

const PlusIcon = styled.div<{buttonSize: number}>`
  position: relative;
  width: ${props => (props.buttonSize ? "40px" : "24px")};
  height: ${props => (props.buttonSize ? "40px" : "24px")};
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
    background: ${color_brand_tertiary};
    top: 50%;
    left: 50%;
  }

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${color_brand_tertiary};
    height: 50%;
    width: 2px;
  }
`;

const ButtonText = styled.div`
  color: ${color_brand_tertiary};
`;

export const PlusButton = ({
  children,
  buttonSize,
  onClick,
}: PlusButtonProps) => {
  return (
    <Button onClick={onClick}>
      <PlusIcon buttonSize={buttonSize} />
      <ButtonText>{children}</ButtonText>
    </Button>
  );
};
