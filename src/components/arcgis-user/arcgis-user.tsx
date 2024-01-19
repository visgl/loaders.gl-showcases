import { useRef } from "react";
import styled from "styled-components";
import LogoutIcon from "../../../public/icons/logout.svg";
import { color_canvas_secondary_inverted } from "../../constants/colors";
import { Tooltip } from "../tooltip/tooltip";
import { TooltipPosition } from "../../types";

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 50px;
  margin-top: -18px;
`;

const UserInfo = styled.div`
  height: 17px;
  margin-right: 8px;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme }) => theme.colors.logoutButtonTextColor};
`;

const IconButton = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 63px;
  height: 17px;
  cursor: pointer;
  &:hover {
    > * {
      stroke: ${({ theme }) => theme.colors.logoutButtonIconColorHover};
    }
  }
`;

const StyledIcon = styled(LogoutIcon)`
  margin-top: 1px;
  stroke: ${color_canvas_secondary_inverted};
`;

type ArcGisUserProps = {
  children?: React.ReactNode;
  onClick?: () => void;
};

export const AcrGisUser = ({ children, onClick }: ArcGisUserProps) => {
  const refLogout = useRef(null);
  return (
    <>
      <Container>
        <UserInfo>{children}</UserInfo>
        <IconButton onClick={onClick} data-testid="userinfo-button">
          <div ref={refLogout}>
            <StyledIcon />
          </div>
        </IconButton>
      </Container>
      <Tooltip
        refElement={refLogout}
        position={TooltipPosition.OnTop}
        margin={0}
      >
        Logout from ArcGIS
      </Tooltip>
    </>
  );
};
