import styled from "styled-components";
import LogoutIcon from "../../../public/icons/logout.svg";
import {
  color_canvas_secondary_inverted,
} from "../../constants/colors";

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 10px;
  transform: translate(0, -8px);

  &:hover {
    > :nth-child(2) > * {
        stroke: ${({ theme }) => (theme.colors.logoutButtonIconColorHover)};
      }
  }
`;

const ButtonText = styled.div`
  position: relative;
  height: 17px;
  margin-left: 40px;
  margin-right: 8px;
  color: ${({ theme }) => (
    theme.colors.logoutButtonTextColor
  )};
`;

const IconContainer = styled.div`
  position: relative;
  width: 63px;
  height: 17px;
  cursor: pointer;
`;

const StyledIcon = styled(LogoutIcon)`
  position: absolute;
  top: 1px;
  stroke: ${color_canvas_secondary_inverted};
`;

type LogoutButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
};

export const LogoutButton = ({
  children,
  onClick,
}: LogoutButtonProps) => {
  return (
    <ButtonContainer>
      <ButtonText>{children}</ButtonText>
      <IconContainer onClick={onClick}>
        <StyledIcon />
      </IconContainer>
    </ButtonContainer>
  );
};
