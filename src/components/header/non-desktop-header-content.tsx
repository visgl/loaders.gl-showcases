import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled, { css, useTheme } from "styled-components";
import { Theme } from "../../utils/enums";
import GitHubIconDark from "../../../public/icons/github-icon-dark.png";
import GitHubIconLight from "../../../public/icons/github-icon-light.png";
import BurgerIcon from "../../../public/icons/burger.svg";
import CloseIcon from "../../../public/icons/close.svg";
import {
  ActiveProps,
  CompareButtonProps,
  GithubImage,
  MenuProps,
} from "./common";
import { GITHUB_LINK } from "../../constants/common";
import { color_brand_secondary } from "../../constants/colors";
import { ThemeToggler } from "./theme-toggler";

const Button = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
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

const ToggleItem = styled(ListButton)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  margin-top: 12px;
`;

const Header = ({ isOpen, setIsOpen }) => {
  const theme = useTheme();
  return (
    <>
      {!isOpen && (
        <Button
          id="burger-menu"
          data-testid="burger-menu-non-desktop"
          onClick={() => setIsOpen(true)}
        >
          <BurgerIcon fill={theme.colors.fontColor} />
        </Button>
      )}
      {isOpen && (
        <Button
          id="close-header-menu"
          data-testid="close-header-menu-non-desktop"
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon fill={theme.colors.fontColor} />
        </Button>
      )}
    </>
  );
};

const Menu = ({
  pathname,
  githubIcon,
  theme,
  setTheme,
}: {
  pathname: string;
  githubIcon: string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}) => {
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
        <ToggleItem id="theme-toggle-tablet-or-mobile">
          Theme
          <ThemeToggler
            data-testid="theme-toggler-non-desktop"
            theme={theme}
            setTheme={setTheme}
          />
        </ToggleItem>
      </MenuLinks>
    </MenuContainer>
  );
};

export const NonDesktopHeaderContent = ({
  theme,
  setTheme,
  pathname,
}: MenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const githubIcon = theme === Theme.Light ? GitHubIconDark : GitHubIconLight;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <Fragment>
      <Header isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

      {isMenuOpen && (
        <Menu
          pathname={pathname}
          githubIcon={githubIcon}
          theme={theme}
          setTheme={setTheme}
        />
      )}
    </Fragment>
  );
};
