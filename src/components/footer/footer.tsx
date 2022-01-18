import styled from "styled-components";

const FooterContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background-color: blue;
`;

export const Footer = () => {
  return <FooterContainer>Footer</FooterContainer>;
};
