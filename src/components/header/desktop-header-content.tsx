import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

import { Theme } from "../../utils/enums";

import DarkModeLightIcon from "../../../public/icons/dark-mode-light.svg";
import DarkModeDarkIcon from "../../../public/icons/dark-mode-dark.svg";

import LightModeLightIcon from "../../../public/icons/light-mode-light.svg";
import LightModeDarkIcon from "../../../public/icons/light-mode-dark.svg";

import { useClickOutside } from "../../utils/hooks/use-click-outside-hook";
import {
  ActiveProps,
  CompareButtonProps,
  GithubImage,
  MenuProps,
} from "./common";

const GITHUB_LINK = "https://github.com/visgl/loaders.gl-showcases";

type CompareMenuProps = {
  pathname: string;
};

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

  ${({ active }) =>
    active &&
    css`
      &:after,
      &:before {
        background: #60c2a4;
      }
    `}
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

const CompareTabContainer = styled.div`
  position: absolute;
  top: 49px;
  left: -80px;
  background: ${(props) => props.theme.mainColor};
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
    color: ${(props) => props.theme.fontColor};
    background: ${(props) => props.theme.buttonBackgroundColor};
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

export const DesktopHeaderContent = ({
  pathname,
  theme,
  setTheme,
  githubIcon,
}: MenuProps) => {
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
