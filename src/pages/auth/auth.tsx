import { useEffect } from "react";
import Background from "../../../public/images/tools-background.webp";
import styled from "styled-components";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../utils/hooks/layout";

import { arcGisCompleteLogin } from "../../utils/arcgis-auth";

export type LayoutProps = {
  layout: string;
};

const AuthContainer = styled.div<LayoutProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  overflow-x: hidden;
  background: url(${Background});
  background-attachment: fixed;
  background-size: cover;

  height: ${getCurrentLayoutProperty({
    desktop: "calc(100vh - 65px)",
    tablet: "calc(100vh - 65px)",
    mobile: "calc(100vh - 58px)",
  })};

  margin-top: ${getCurrentLayoutProperty({
    desktop: "65px",
    tablet: "65px",
    mobile: "58px",
  })};
`;

export const AuthApp = () => {
  const layout = useAppLayout();
  useEffect(() => {
    arcGisCompleteLogin();
  }, []);
  return <AuthContainer id="dashboard-container" layout={layout} />;
};
