import Background from "../../../public/images/tools-background.webp";
import styled from "styled-components";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../utils/hooks/layout";

import { ArcGISIdentityManager } from '@esri/arcgis-rest-request';
import { getAuthOptions } from "../../utils/arcgis-auth";

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

  const { redirectUrl, clientId } = getAuthOptions();
  if (!clientId) {
    console.error("The ClientId is not defined in .env file.");
  } else {
    const options = {
      clientId: clientId,
      redirectUri: redirectUrl,
      popup: true,
      pkce: true
    }
    ArcGISIdentityManager.completeOAuth2(options);
  }
  return (
    <AuthContainer id="dashboard-container" layout={layout}>
    </AuthContainer>
  );

}