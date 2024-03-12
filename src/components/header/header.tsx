import { MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

import { Layout, Theme } from "../../types";

import GitHubIconDark from "../../../public/icons/github-icon-dark.png";
import GitHubIconLight from "../../../public/icons/github-icon-light.png";
import LogoImage from "../../../public/images/logo.svg";

import { DesktopHeaderContent } from "./desktop-header-content";
import { NonDesktopHeaderContent } from "./non-desktop-header-content";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../utils/hooks/layout";

type HeaderProps = {
  theme: Theme;
  showHelp: boolean;
  setTheme: (theme: Theme) => void;
  onHelpClick: () => void;
};

type PropsWithLayout = {
  $layout: string;
};

const HeaderContainer = styled.div<PropsWithLayout>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 103;
  background-color: ${(props) => props.theme.colors.mainColor};

  height: ${getCurrentLayoutProperty({
    desktop: "65px",
    tablet: "65px",
    mobile: "58px",
  })};
`;

const HeaderLogo = styled(Link)<PropsWithLayout>`
  display: flex;
  align-items: center;
  gap: 13px;
  white-space: nowrap;
  color: ${(props) => props.theme.colors.fontColor};
  font-size: ${getCurrentLayoutProperty({
    desktop: "24px",
    tablet: "16px",
    mobile: "16px",
  })};

  margin-left: ${getCurrentLayoutProperty({
    desktop: "24px",
    tablet: "16px",
    mobile: "16px",
  })};
  text-decoration: none;
  font-weight: bold;
`;

export const Header = ({
  theme,
  setTheme,
  showHelp,
  onHelpClick,
}: HeaderProps) => {
  const layout = useAppLayout();
  const location = useLocation();
  const { pathname } = location;

  const isDesktopLayout = layout === Layout.Desktop;
  const githubIcon = theme === Theme.Light ? GitHubIconDark : GitHubIconLight;

  const redirectHandler = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/dashboard") {
      event.preventDefault();
    }
  };

  return (
    <HeaderContainer id="header-container" $layout={layout}>
      <HeaderLogo
        $layout={layout}
        id="header-logo"
        to="/"
        onClick={redirectHandler}
      >
        <LogoImage />
        I3S Explorer
      </HeaderLogo>
      {isDesktopLayout ? (
        <DesktopHeaderContent
          pathname={pathname}
          theme={theme}
          setTheme={setTheme}
          githubIcon={githubIcon}
          showHelp={showHelp}
          onHelpClick={onHelpClick}
        />
      ) : (
        <NonDesktopHeaderContent
          theme={theme}
          setTheme={setTheme}
          pathname={pathname}
          githubIcon={githubIcon}
          showHelp={showHelp}
          onHelpClick={onHelpClick}
        />
      )}
    </HeaderContainer>
  );
};
