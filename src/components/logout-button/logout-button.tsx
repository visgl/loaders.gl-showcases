import styled from "styled-components";
import { ButtonSize } from "../../types";
import LogoutIcon from "../../../public/icons/logout.svg";

type LogoutButtonProps = {
  children?: React.ReactNode;
  buttonSize: ButtonSize;
  onClick?: () => void;
};

const LogoutImage = styled(LogoutIcon)`
  display: flex;
  position: relative;
  height: 14px;
`;

const ButtonText = styled.div<{ buttonSize: number }>`
  color: rgba(128, 128, 128, 0.6);
  margin-left: ${(props) => (props.buttonSize === ButtonSize.Big ? "57px" : "41px")};
  margin-right: 16px;
`;

const Button = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: flex-start;
  align-items: center;
  margin-top: -28px;

  &:hover {
    > * {
        // Note: it's applied to all children, not just the first one.
        // Keep rgba format to avoid issue with opacity inheritance and pseudo elements.
        background: rgba(128, 128, 128, 0.3);
    }
  }

`;

export const LogoutButton = ({
  children,
  buttonSize,
  onClick,
}: LogoutButtonProps) => {
  return (
    <Button onClick={onClick}>
      <ButtonText buttonSize={buttonSize}>{children}</ButtonText>
      <LogoutImage/>
    </Button>
  );
};



