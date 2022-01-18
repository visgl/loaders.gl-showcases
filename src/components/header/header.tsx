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
`;

const HeaderLogo = styled.img`
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
      <HeaderLogo
        className="header-log"
        alt={"ESRI Logo"}
        src="esri-logo.jpg"
      ></HeaderLogo>
      <MenuContainer>
        <MenuLink to="dashboard">Home</MenuLink>
        <MenuLink to="i3s-app">I3S Explorer</MenuLink>
        <MenuLink to="i3s-debug-app">I3S Debug App</MenuLink>
        <MenuLink to="about-us">About Us</MenuLink>
      </MenuContainer>
    </HeaderContainer>
  );
};
