import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";

import { Layout, Theme } from "../../utils/enums";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";

import { lightGreen } from "../../constants/colors";

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
import { useClickOutside } from "../../utils/hooks/use-click-outside-hook";

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

interface CompareMenuProps {
  pathname: string;
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
  background-color: ${(props) => props.theme.colors.mainColor};

  height: ${getCurrentLayoutProperty({
    default: "65px",
    tablet: "65px",
    mobile: "58px",
  })};
`;

const HeaderLogo = styled.h2<PropsWithLayout>`
  white-space: nowrap;
  color: ${(props) => props.theme.colors.fontColor};
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

  color: ${(props) =>
    props.active ? lightGreen : props.theme.colors.fontColor};
  margin-right: 24px;

  &:hover {
    color: ${lightGreen};

    &::after {
      content: "";
      position: absolute;
      top: 25px;
      border: 1px solid ${lightGreen};
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
        border: 1px solid ${lightGreen};
        border-radius: 1px;
        width: 100%;
      }
    `}
`;

const GithubImage = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 5px;
  border: 1px solid ${(props) => props.theme.colors.mainColor};
  border-radius: 12px;
`;

const GitHubLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  height: 20px;

  color: ${(props) => props.theme.colors.fontColor};

  &:hover {
    color: ${lightGreen};
    & > img {
      border: 1px solid ${lightGreen};
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
    ${(props) => (props.active ? lightGreen : props.theme.colors.mainColor)};
  border-radius: 2px;

  color: ${(props) =>
    props.active ? lightGreen : props.theme.colors.fontColor};

  &::before,
  &::after {
    content: "";
    position: absolute;
    background: ${(props) => props.theme.colors.fontColor};
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
    color: ${lightGreen};
    border-bottom: 2px solid ${lightGreen};
    &::after,
    &::before {
      background: ${lightGreen};
    }
  }

  ${({ active }) =>
    active &&
    css`
      &:after,
      &:before {
        background: ${lightGreen};
      }
    `}
`;

const HelpButton = styled.button`
  color: ${(props) => props.theme.colors.fontColor};
  border: 1px solid ${(props) => props.theme.colors.buttonBorderColor};
  border-radius: 12px;
  padding: 7px 18px;
  background: transparent;
  margin-left: 42px;
  cursor: pointer;

  &:hover {
    border-color: ${lightGreen};
    color: ${lightGreen};
  }
`;

const ThemeToggleWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.colors.buttonBorderColor};
  border-radius: 12px;

  background: ${(props) => props.theme.colors.buttonBackgroundColor};
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
    props.active ? props.theme.colors.mainColor : "transparent"};

  &:hover {
    background: ${lightGreen};
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
  background-color: ${(props) => props.theme.colors.mainColor};
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
  color: ${(props) =>
    props.active ? lightGreen : props.theme.colors.fontColor};
  text-decoration: inherit;
  font-size: 16px;
  line-height: 19px;
  margin: 20px 0;
`;

const CompareTabletOrMobile = styled(CompareButton)<CompareButtonProps>`
  margin: 20px 0;
  border: none;
  height: 19px;
  color: ${(props) =>
    props.active ? lightGreen : props.theme.colors.fontColor};
  width: calc(100vw - 60px);

  &::after,
  &::before {
    background: ${(props) =>
      props.active ? lightGreen : props.theme.colors.fontColor};
  }

  &:hover {
    border: none;
    color: ${(props) =>
      props.active ? lightGreen : props.theme.colors.fontColor};
    &::after,
    &::before {
      background: ${(props) =>
        props.active ? lightGreen : props.theme.colors.fontColor};
    }
  }
`;

const TabletOrMobileGitHubLink = styled(GitHubLink)`
  margin: 20px 0;
  color: ${(props) => props.theme.colors.fontColor};

  & > img {
    border: none;
  }

  &:hover {
    color: ${(props) => props.theme.colors.fontColor};
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
  color: ${(props) => props.theme.colors.fontColor};
  cursor: pointer;
`;

const CompareTabContainer = styled.div`
  position: absolute;
  top: 49px;
  left: -80px;
  background: ${(props) => props.theme.colors.mainColor};
  border: 1px solid #616678;
  border-radius: 0px 0px 8px 8px;
  display: flex;
  flex-direction: column;
  width: 253px;
`;

const CompareItemWrapper = styled.div`
  position: relative;
`;

const CompareMenuLink = styled(MenuLink)`
  height: 43px;
  display: flex;
  align-items: center;
  margin: 0;
  padding-left: 16px;

  &::before,
  &::after {
    display: none;
  }

  &:hover {
    color: ${(props) => props.theme.colors.fontColor};
    background: ${(props) => props.theme.colors.buttonBackgroundColor};
  }

  &:first-child {
    margin-top: 8px;
  }

  &:last-child {
    margin-bottom: 8px;
  }
`;

const CompareTab = React.forwardRef<HTMLInputElement, CompareMenuProps>(
  ({ pathname }, forwardedRef) => (
    <CompareTabContainer ref={forwardedRef}>
      <CompareMenuLink
        to="compare-across-layers"
        active={pathname === "/compare-across-layers" ? 1 : 0}
      >
        Across Layers
      </CompareMenuLink>
      <CompareMenuLink
        to="compare-within-layer"
        active={pathname === "/compare-within-layer" ? 1 : 0}
      >
        Within a Layer
      </CompareMenuLink>
    </CompareTabContainer>
  )
);

const DefaultMenu = ({
  pathname,
  theme,
  setTheme,
  githubIcon,
}: DefaultMenuProps) => {
  const compareTabRef = useRef<HTMLInputElement>(null);
  const [isCompareMenuOpen, setIsCompareMenuOpen] = useState(false);

  useClickOutside(compareTabRef, () => setIsCompareMenuOpen(false));

  useEffect(() => {
    setIsCompareMenuOpen(false);
  }, [pathname]);

  const darkIcon = theme === Theme.Dark ? DarkModeDarkIcon : LightModeDarkIcon;
  const lightIcon =
    theme === Theme.Light ? LightModeLightIcon : DarkModeLightIcon;

  return (
    <MenuContainer id="header-links-default">
      <MenuLink to="dashboard" active={pathname === "/dashboard" ? 1 : 0}>
        Home
      </MenuLink>
      <MenuLink to="viewer" active={pathname === "/viewer" ? 1 : 0}>
        Viewer
      </MenuLink>
      <MenuLink to="debug" active={pathname === "/debug" ? 1 : 0}>
        Debug
      </MenuLink>
      <CompareItemWrapper>
        <CompareButton
          id="compare-default-button"
          active={
            pathname === "/compare-across-layers" ||
            pathname === "/compare-within-layer"
          }
          open={isCompareMenuOpen}
          onClick={() => setIsCompareMenuOpen((prevValue) => !prevValue)}
        >
          Compare
        </CompareButton>
        {isCompareMenuOpen && (
          <CompareTab ref={compareTabRef} pathname={pathname} />
        )}
      </CompareItemWrapper>
      <GitHubLink href={GITHUB_LINK}>
        GitHub
        <GithubImage src={githubIcon} />
      </GitHubLink>
      <HelpButton id="help-button-default">Help</HelpButton>
      <ThemeToggleWrapper id="toggle-button-default">
        <ThemeToggleImage
          id="toggle-dark-default"
          active={theme === Theme.Dark ? 1 : 0}
          src={darkIcon}
          onClick={() => setTheme(Theme.Dark)}
        />
        <ThemeToggleImage
          id="toggle-light-default"
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
        <BurgerIcon
          id="burger-menu"
          src={burgerIcon}
          onClick={() => setIsOpen(true)}
        />
      )}
      {isOpen && (
        <CloseIcon
          id="close-header-menu"
          src={closeIcon}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

const TabletOrMobileMenu = ({ pathname, githubIcon }) => {
  const [isCompareMenuOpen, setIsCompareMenuOpen] = useState(false);

  return (
    <TabletOrMobileMenuContainer id="tablet-or-mobile-menu">
      <MenuLinks id="header-links">
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
            id="compare-tablet-or-mobile-button"
            active={
              pathname === "/compare-across-layers" ||
              pathname === "/compare-within-layer"
            }
            open={isCompareMenuOpen}
            onClick={() => setIsCompareMenuOpen((prevValue) => !prevValue)}
          >
            Compare
          </CompareTabletOrMobile>
          {isCompareMenuOpen && (
            <MenuLinks>
              <TabletOrMobileLink
                id="across-layers-item"
                to="compare-across-layers"
                active={pathname === "/compare-across-layers" ? 1 : 0}
              >
                Across Layers
              </TabletOrMobileLink>
              <TabletOrMobileLink
                id="within-layer-item"
                to="compare-within-layer"
                active={pathname === "/compare-within-layer" ? 1 : 0}
              >
                Within a Layer
              </TabletOrMobileLink>
            </MenuLinks>
          )}
          <TabletOrMobileGitHubLink href={GITHUB_LINK}>
            GitHub
            <GithubImage src={githubIcon} />
          </TabletOrMobileGitHubLink>
        </LinksWrapper>
        <HorisontalLine />
        <TabletOrMobileListButton id="help-button-tablet-or-mobile">
          Help
        </TabletOrMobileListButton>
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

  useEffect(() => {
    setIsTabletOrMobileMenuOpen(false);
  }, [pathname]);

  return (
    <HeaderContainer id="header-container" layout={layout}>
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
