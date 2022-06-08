import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

import { Theme } from "../../utils/enums";

import GitHubIconDark from "../../../public/icons/github-icon-dark.png";
import GitHubIconLight from "../../../public/icons/github-icon-light.png";

import DarkModeBurger from "../../../public/icons/dark-mode-burger.svg";
import LightModeBurger from "../../../public/icons/light-mode-burger.svg";

import DarkModeClose from "../../../public/icons/dark-mode-close.svg";
import LightModeClose from "../../../public/icons/light-mode-close.svg";
import {
  ActiveProps,
  CompareButtonProps,
  GithubImage,
  MenuProps,
} from "./common";
import { GITHUB_LINK } from "../../constants/common";
import { color_brand_secondary } from "../../constants/colors";

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

const MenuContainer = styled.div`
  position: fixed;
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

const MenuLink = styled(Link)<ActiveProps>`
  color: ${(props) =>
    props.active ? color_brand_secondary : props.theme.colors.fontColor};
  text-decoration: inherit;
  font-size: 16px;
  line-height: 19px;
  margin: 20px 0;
`;

const CompareButton = styled.div<CompareButtonProps>`
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  margin: 20px 0;
  height: 19px;
  color: ${(props) =>
    props.active ? color_brand_secondary : props.theme.colors.fontColor};
  width: calc(100vw - 60px);

  &::before,
  &::after {
    content: "";
    position: absolute;
    background: ${(props) =>
      props.active ? color_brand_secondary : props.theme.colors.fontColor};
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
    color: ${(props) =>
      props.active ? color_brand_secondary : props.theme.colors.fontColor};
    border: none;
    &::after,
    &::before {
      background: ${(props) =>
        props.active ? color_brand_secondary : props.theme.colors.fontColor};
    }
  }

  ${({ active }) =>
    active &&
    css`
      &:after,
      &:before {
        background: #60c2a4;
      }
    `}
`;

const GitHubLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  height: 20px;
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

const ListButton = styled.div`
  font-size: 16px;
  height: 20px;
  position: relative;
  margin: 20px 16px;
  color: ${(props) => props.theme.colors.fontColor};
  cursor: pointer;
`;

const Header = ({ theme, isOpen, setIsOpen }) => {
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

const Menu = ({ pathname, githubIcon }) => {
  const [isCompareMenuOpen, setIsCompareMenuOpen] = useState(false);

  return (
    <MenuContainer id="tablet-or-mobile-menu">
      <MenuLinks id="header-links">
        <LinksWrapper>
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
            id="compare-tablet-or-mobile-button"
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
            <MenuLinks>
              <MenuLink
                id="across-layers-item"
                to="compare-across-layers"
                active={pathname === "/compare-across-layers" ? 1 : 0}
              >
                Across Layers
              </MenuLink>
              <MenuLink
                id="within-layer-item"
                to="compare-within-layer"
                active={pathname === "/compare-within-layer" ? 1 : 0}
              >
                Within a Layer
              </MenuLink>
            </MenuLinks>
          )}
          <GitHubLink href={GITHUB_LINK}>
            GitHub
            <GithubImage src={githubIcon} />
          </GitHubLink>
        </LinksWrapper>
        <HorisontalLine />
        <ListButton id="help-button-tablet-or-mobile">Help</ListButton>
      </MenuLinks>
    </MenuContainer>
  );
};

export const NonDesktopHeaderContent = ({ theme, pathname }: MenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const githubIcon = theme === Theme.Light ? GitHubIconDark : GitHubIconLight;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <Fragment>
      <Header theme={theme} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

      {isMenuOpen && <Menu pathname={pathname} githubIcon={githubIcon} />}
    </Fragment>
  );
};
