import { Link } from "react-router-dom";
import styled from "styled-components";
import GitHubIcon from "../../../public/icons/github-icon.png";
import { Theme } from "../../utils/enums";

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  background-color: white;
`;

const HeaderLogo = styled.h2`
  margin-left: 15px;
  height: 30px;
`;

const MenuContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 15px;
  width: 400px;
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  color: black;
  text-decoration: inherit;
`;

const GithubImage = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 5px;
`;

const GitHubLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  color black;
`;

interface HeaderProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

/**
 * TODO: Add types to component
 */
export const Header = ({ theme, setTheme }: HeaderProps) => {
  return (
    <HeaderContainer>
      <HeaderLogo id="header-logo">I3S Explorer</HeaderLogo>
      <MenuContainer id="header-links">
        <MenuLink to="dashboard">Home</MenuLink>
        <MenuLink to="viewer">Viewer</MenuLink>
        <MenuLink to="debug">Debug</MenuLink>
        <MenuLink to="comparison">Comparison</MenuLink>
        <GitHubLink href="https://github.com/visgl/loaders.gl-showcases">
          GitHub
          <GithubImage src={GitHubIcon} />
        </GitHubLink>
      </MenuContainer>
    </HeaderContainer>
  );
};
