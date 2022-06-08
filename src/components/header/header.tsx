import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { Layout, Theme } from "../../types";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";

import GitHubIconDark from "../../../public/icons/github-icon-dark.png";
import GitHubIconLight from "../../../public/icons/github-icon-light.png";

import { DesktopHeaderContent } from "./desktop-header-content";
import { NonDesktopHeaderContent } from "./non-desktop-header-content";

type HeaderProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

type PropsWithLayout = {
  layout: string;
};

const HeaderContainer = styled.div<PropsWithLayout>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  background-color: ${(props) => props.theme.colors.mainColor};

  height: ${getCurrentLayoutProperty({
    desktop: "65px",
    tablet: "65px",
    mobile: "58px",
  })};
`;

const HeaderLogo = styled.h2<PropsWithLayout>`
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
`;

export const Header = ({ theme, setTheme }: HeaderProps) => {
  const layout = useAppLayout();
  const location = useLocation();
  const { pathname } = location;

  const isDesktopLayout = layout === Layout.Desktop;
  const githubIcon = theme === Theme.Light ? GitHubIconDark : GitHubIconLight;

  return (
    <HeaderContainer id="header-container" layout={layout}>
      <HeaderLogo layout={layout} id="header-logo">
        I3S Explorer
      </HeaderLogo>
      {isDesktopLayout ? (
        <DesktopHeaderContent
          pathname={pathname}
          theme={theme}
          setTheme={setTheme}
          githubIcon={githubIcon}
        />
      ) : (
        <NonDesktopHeaderContent
          theme={theme}
          setTheme={setTheme}
          pathname={pathname}
          githubIcon={githubIcon}
        />
      )}
    </HeaderContainer>
  );
};
