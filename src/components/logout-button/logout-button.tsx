import styled from "styled-components";
import LogoutIcon from "../../../public/icons/logout.svg";

type LogoutButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
};

const LogoutImage = styled(LogoutIcon)`
  display: flex;
  position: relative;
  height: 14px;
`;

const ButtonText = styled.div`
  color: ${({ theme }) => (
    theme.colors.actionIconButtonTextDisabledColor
  )};
  margin-left: 41px;
  margin-right: 16px;
`;

const Button = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: flex-start;
  align-items: center;

  &:hover {
    > * {
        background: ${({ theme }) => (
          theme.colors.actionIconButtonDisabledBGHover
      )};
    }
  }
`;

export const LogoutButton = ({
  children,
  onClick,
}: LogoutButtonProps) => {
  return (
    <Button onClick={onClick}>
      <ButtonText>{children}</ButtonText>
      <LogoutImage/>
    </Button>
  );
};



