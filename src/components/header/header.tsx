import { Link } from "react-router-dom";
import styled from "styled-components";

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
  color: black;
  text-decoration: inherit;
`;

export const Header = () => {
  return (
    <HeaderContainer>
      <HeaderLogo>I3S Explorer</HeaderLogo>
      <MenuContainer>
        <MenuLink to="dashboard">Home</MenuLink>
        <MenuLink to="viewer">Viewer</MenuLink>
        <MenuLink to="debug">Debug</MenuLink>
        <MenuLink to="comparison">Comparison</MenuLink>
        <MenuLink to="about-us">About Us</MenuLink>
      </MenuContainer>
    </HeaderContainer>
  );
};
