import Background from "../../../public/images/tools-background.webp";
import styled from "styled-components";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../utils/hooks/layout";

import { ArcGISIdentityManager } from '@esri/arcgis-rest-request';

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
/*
function updateSessionInfo(session) {
    // Get the signed in users into and log it to the console
    if (session) {
      console.log(`session=${JSON.stringify(session, null, 2)}`);
      session.getUser().then((user) => {
        console.log("User info:", user);
      });
    }

    let sessionInfo = document.getElementById('sessionInfo')
    let sessionCode = document.getElementById("sessionCode");

    if (session) {
      localStorage.setItem('__ARCGIS_REST_USER_SESSION__', session.serialize());
    } else {
      localStorage.removeItem('__ARCGIS_REST_USER_SESSION__');
    }
  }

function handleAuthError(e) {
    switch (e.code) {
      case "no-auth-state":
        console.log("No auth state found to complete sign in. This error can be ignored.");
        break;
      case "access-denied-error":
        console.log("The user hit cancel on the authorization screen.");
        break;
      default:
        console.error(e);
        break;
    }
  }
*/

export const AuthApp = () => {
  let session: any = null;
  const config = {
    clientId: '...',
    // Client secret: 9f4ebd45cd3041eb97ef75a53f9f0252
    //        redirectUri: 'https://localhost:8443/dashboard',
    redirectUri: 'https://localhost:8443/auth',
  };
  const layout = useAppLayout();
  let opts = {
    clientId: config.clientId,
    redirectUri: config.redirectUri,
    popup: true,
  }
  //   if (config.portal) {
  //     opts.portal = config.portal
  //   }
  debugger;
  const sessionCompleted = ArcGISIdentityManager.completeOAuth2(opts).then(newSession => {
    session = newSession;
    if (session) {
      //            updateSessionInfo(session);
    }
  }).catch(e => {
    //        handleAuthError(e);
  });

  return (
    <AuthContainer id="dashboard-container" layout={layout}>
    </AuthContainer>
  );

}