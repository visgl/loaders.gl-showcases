import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";

import { Layout, Theme } from "../../utils/enums";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";

import GitHubIconDark from "../../../public/icons/github-icon-dark.png";
import GitHubIconLight from "../../../public/icons/github-icon-light.png";

import DarkModeLightIcon from "../../../public/icons/dark-mode-light.svg";
import DarkModeDarkIcon from "../../../public/icons/dark-mode-dark.svg";

import LightModeLightIcon from "../../../public/icons/light-mode-light.svg";
import LightModeDarkIcon from "../../../public/icons/light-mode-dark.svg";

import DarkModeBurger from "../../../public/icons/dark-mode-burger.svg";
import LightModeBurger from "../../../public/icons/light-mode-burger.svg";

import DarkModeClose from "../../../public/icons/dark-mode-close.svg";
import LightModeClose from "../../../public/icons/light-mode-close.svg";

const GITHUB_LINK = "https://github.com/visgl/loaders.gl-showcases";

interface HeaderProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

interface DefaultMenuProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  pathname: string;
  githubIcon: string;
}

interface PropsWithLayout {
  layout: string;
}

interface CompareButtonProps {
  open: boolean;
  active: boolean;
}

interface ActiveProps {
  active: number;
}

const HeaderContainer = styled.div<PropsWithLayout>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  background-color: ${(props) => props.theme.mainColor};

  height: ${getCurrentLayoutProperty({
    default: "65px",
    tablet: "65px",
    mobile: "58px",
  })};
`;

const HeaderLogo = styled.h2<PropsWithLayout>`
  white-space: nowrap;
  color: ${(props) => props.theme.fontColor};
  font-size: ${getCurrentLayoutProperty({
    default: "24px",
    tablet: "16px",
    mobile: "16px",
  })};

  margin-left: ${getCurrentLayoutProperty({
    default: "24px",
    tablet: "16px",
    mobile: "16px",
  })};
`;

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 26px;
`;

const MenuLink = styled(Link)<ActiveProps>`
  display: flex;
  align-items: center;
  text-decoration: inherit;
  font-size: 16px;
  height: 20px;
  position: relative;

  color: ${(props) => (props.active ? "#60c2a4" : props.theme.fontColor)};
  margin-right: 24px;

  &:hover {
    color: #60c2a4;

    &::after {
      content: "";
      position: absolute;
      top: 25px;
      border: 1px solid #60c2a4;
      border-radius: 1px;
      width: 100%;
    }
  }

  ${({ active }) =>
    active &&
    css`
      &:after {
        content: "";
        position: absolute;
        top: 25px;
        border: 1px solid #60c2a4;
        border-radius: 1px;
        width: 100%;
      }
    `}
`;

const GithubImage = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 5px;
  border: 1px solid ${(props) => props.theme.mainColor};
  border-radius: 12px;
`;

const GitHubLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  height: 20px;

  color: ${(props) => props.theme.fontColor};

  &:hover {
    color: #60c2a4;
    & > img {
      border: 1px solid #60c2a4;
    }
  }
`;

const CompareButton = styled.div<CompareButtonProps>`
  display: flex;
  align-items: center;

  position: relative;
  cursor: pointer;
  margin-right: 45px;
  margin-top: 2px;
  height: 30px;
  border-bottom: 2px solid
    ${(props) => (props.active ? "#60c2a4" : props.theme.mainColor)};
  border-radius: 2px;

  color: ${(props) => (props.active ? "#60c2a4" : props.theme.fontColor)};

  &::before,
  &::after {
    content: "";
    position: absolute;
    background: ${(props) => props.theme.fontColor};
    border-radius: 2px;
    display: block;
    height: 7px;
    width: 2px;
  }

  &::before {
    transform: ${(props) =>
      props.open ? "rotate(-45deg)" : "rotate(-135deg)"};
    left: calc(100% + 16px);
  }

  &::after {
    transform: ${(props) => (props.open ? "rotate(45deg)" : "rotate(135deg)")};
    right: -14px;
  }

  &:hover {
    color: #60c2a4;
    border-bottom: 2px solid #60c2a4;
    &::after,
    &::before {
      background: #60c2a4;
    }
  }
`;

const HelpButton = styled.button`
  color: ${(props) => props.theme.fontColor};
  border: 1px solid ${(props) => props.theme.buttonBorderColor};
  border-radius: 12px;
  padding: 7px 18px;
  background: transparent;
  margin-left: 42px;
  cursor: pointer;

  &:hover {
    border-color: #60c2a4;
    color: #60c2a4;
  }
`;

const ThemeToggleWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.buttonBorderColor};
  border-radius: 12px;

  background: ${(props) => props.theme.buttonBackgroundColor};
  margin-left: 24px;
  padding: 1px;

  display: flex;
  justify-content: space-between;
`;

const ThemeToggleImage = styled.img<ActiveProps>`
  display: block;
  width: 13px;
  height: 14px;

  padding: 9px;
  border-radius: 12px;

  cursor: pointer;
  background: ${(props) =>
    props.active ? props.theme.mainColor : "transparent"};

  &:hover {
    background: #60c2a4;
  }
`;

const MenuIcon = styled.img`
  display: block;
  margin-right: 19px;
  cursor: pointer;
`;

const BurgerIcon = styled(MenuIcon)`
  width: 18px
  height: 12px;
`;

const CloseIcon = styled(MenuIcon)`
  width: 16px
  height: 16px;
`;

const TabletOrMobileMenuContainer = styled.div`
  position: fixed;
  z-index: 10;
  top: 58px;
  display: flex;
  width: 100vw;
  background-color: ${(props) => props.theme.mainColor};
`;

const MenuLinks = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 70vh;
`;

const LinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 16px;
  width: 100%;
`;

const TabletOrMobileLink = styled(Link)<ActiveProps>`
  color: ${(props) => (props.active ? "#60c2a4" : props.theme.fontColor)};
  text-decoration: inherit;
  font-size: 16px;
  line-height: 19px;
  margin: 20px 0;
`;

const CompareTabletOrMobile = styled(CompareButton)<CompareButtonProps>`
  margin: 20px 0;
  border: none;
  height: 19px;
  color: ${(props) => (props.active ? "#60c2a4" : props.theme.fontColor)};
  width: calc(100vw - 60px);

  &::after,
  &::before {
    background: ${(props) =>
      props.active ? "#60c2a4" : props.theme.fontColor};
  }

  &:hover {
    border: none;
    color: ${(props) => (props.active ? "#60c2a4" : props.theme.fontColor)};
    &::after,
    &::before {
      background: ${(props) =>
        props.active ? "#60c2a4" : props.theme.fontColor};
    }
  }
`;

const TabletOrMobileGitHubLink = styled(GitHubLink)`
  margin: 20px 0;
  color: ${(props) => props.theme.fontColor};

  & > img {
    border: none;
  }

  &:hover {
    color: ${(props) => props.theme.fontColor};
    & > img {
      border: none;
    }
  }
`;

const HorisontalLine = styled.div`
  width: 100%;
  border-bottom: 1px solid #616678;
`;

const TabletOrMobileListButton = styled.div`
  font-size: 16px;
  height: 20px;
  position: relative;
  margin: 20px 16px;
  color: ${(props) => props.theme.fontColor};
  cursor: pointer;
`;

const CompareMenuItem = styled(TabletOrMobileListButton)`
  margin: 20px 0;
`;

const DefaultMenu = ({
  pathname,
  theme,
  setTheme,
  githubIcon,
}: DefaultMenuProps) => {
  const [isCompareMenuOpen, setIsCompareMenuOpen] = useState(false);

  const darkIcon = theme === Theme.Dark ? DarkModeDarkIcon : LightModeDarkIcon;
  const lightIcon =
    theme === Theme.Light ? LightModeLightIcon : DarkModeLightIcon;

  return (
    <MenuContainer id="header-links">
      <MenuLink to="dashboard" active={pathname === "/dashboard" ? 1 : 0}>
        Home
      </MenuLink>
      <MenuLink to="viewer" active={pathname === "/viewer" ? 1 : 0}>
        Viewer
      </MenuLink>
      <MenuLink to="debug" active={pathname === "/debug" ? 1 : 0}>
        Debug
      </MenuLink>
      <CompareButton
        active={pathname === "/comparison"}
        open={isCompareMenuOpen}
        onClick={() => setIsCompareMenuOpen((prevValue) => !prevValue)}
      >
        Compare
      </CompareButton>
      <GitHubLink href={GITHUB_LINK}>
        GitHub
        <GithubImage src={githubIcon} />
      </GitHubLink>
      <HelpButton>Help</HelpButton>
      <ThemeToggleWrapper>
        <ThemeToggleImage
          active={theme === Theme.Dark ? 1 : 0}
          src={darkIcon}
          onClick={() => setTheme(Theme.Dark)}
        />
        <ThemeToggleImage
          active={theme === Theme.Light ? 1 : 0}
          src={lightIcon}
          onClick={() => setTheme(Theme.Light)}
        />
      </ThemeToggleWrapper>
    </MenuContainer>
  );
};

const TabletOrMobileHeader = ({ theme, isOpen, setIsOpen }) => {
  const burgerIcon = theme === Theme.Light ? LightModeBurger : DarkModeBurger;
  const closeIcon = theme === Theme.Light ? LightModeClose : DarkModeClose;

  return (
    <>
      {!isOpen && (
        <BurgerIcon src={burgerIcon} onClick={() => setIsOpen(true)} />
      )}
      {isOpen && <CloseIcon src={closeIcon} onClick={() => setIsOpen(false)} />}
    </>
  );
};

const TabletOrMobileMenu = ({ pathname, githubIcon }) => {
  const [isCompareMenuOpen, setIsCompareMenuOpen] = useState(false);
  return (
    <TabletOrMobileMenuContainer>
      <MenuLinks>
        <LinksWrapper>
          <TabletOrMobileLink
            to="dashboard"
            active={pathname === "/dashboard" ? 1 : 0}
          >
            Home
          </TabletOrMobileLink>
          <TabletOrMobileLink
            to="viewer"
            active={pathname === "/viewer" ? 1 : 0}
          >
            Viewer
          </TabletOrMobileLink>
          <TabletOrMobileLink to="debug" active={pathname === "/debug" ? 1 : 0}>
            Debug
          </TabletOrMobileLink>
          <CompareTabletOrMobile
            active={pathname === "/comparison"}
            open={isCompareMenuOpen}
            onClick={() => setIsCompareMenuOpen((prevValue) => !prevValue)}
          >
            Compare
          </CompareTabletOrMobile>
          {isCompareMenuOpen && (
            <MenuLinks>
              <CompareMenuItem>Across Layers</CompareMenuItem>
              <CompareMenuItem>Within a Layer</CompareMenuItem>
            </MenuLinks>
          )}
          <TabletOrMobileGitHubLink href={GITHUB_LINK}>
            GitHub
            <GithubImage src={githubIcon} />
          </TabletOrMobileGitHubLink>
        </LinksWrapper>
        <HorisontalLine />
        <TabletOrMobileListButton>Help</TabletOrMobileListButton>
      </MenuLinks>
    </TabletOrMobileMenuContainer>
  );
};

export const Header = ({ theme, setTheme }: HeaderProps) => {
  const [isTabletOrMobileMenuOpen, setIsTabletOrMobileMenuOpen] =
    useState(false);
  const layout = useAppLayout();
  const location = useLocation();
  const { pathname } = location;

  const isDefaultLayout = layout === Layout.Default;
  const githubIcon = theme === Theme.Light ? GitHubIconDark : GitHubIconLight;

  return (
    <HeaderContainer layout={layout}>
      <HeaderLogo layout={layout} id="header-logo">
        I3S Explorer
      </HeaderLogo>
      {isDefaultLayout && (
        <DefaultMenu
          pathname={pathname}
          theme={theme}
          setTheme={setTheme}
          githubIcon={githubIcon}
        />
      )}
      {!isDefaultLayout && (
        <TabletOrMobileHeader
          theme={theme}
          isOpen={isTabletOrMobileMenuOpen}
          setIsOpen={setIsTabletOrMobileMenuOpen}
        />
      )}

      {!isDefaultLayout && isTabletOrMobileMenuOpen && (
        <TabletOrMobileMenu pathname={pathname} githubIcon={githubIcon} />
      )}
    </HeaderContainer>
  );
};
