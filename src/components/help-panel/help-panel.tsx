import styled from "styled-components";
import { Layout } from "../../types";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";

type LayoutProps = {
  layout: string;
};

const Overlay = styled.div`
  position: absolute;
  left: 0;
  top: 65px;
  height: calc(100% - 65px);
  width: 100%;
  z-index: 100;
  background: #23243080;
`;

const Container = styled.div<LayoutProps>`
  position: absolute;
  background: red;
  border-radius: 8px;
  z-index: 101;

  width: ${getCurrentLayoutProperty({
    desktop: "1220px",
    tablet: "100%",
    mobile: "100%",
  })};

  height: ${getCurrentLayoutProperty({
    desktop: "622px",
    tablet: "calc(100% - 65px)",
    mobile: "calc(100% - 58px)",
  })};

  left: ${getCurrentLayoutProperty({
    desktop: "calc(50% - 610px)",
    tablet: "0",
    mobile: "0",
  })};

  top: ${getCurrentLayoutProperty({
    desktop: "calc(50% - 311px)",
    tablet: "65px",
    mobile: "58px",
  })};
`;

export const HelpPanel = () => {
  const layout = useAppLayout();
  const isDesktop = layout === Layout.Desktop;

  return (
    <>
      {isDesktop && <Overlay />}
      <Container layout={layout}>Hello world!!!!</Container>
    </>
  );
};
