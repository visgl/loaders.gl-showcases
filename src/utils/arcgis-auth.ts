import { ArcGISIdentityManager } from '@esri/arcgis-rest-request';
import { getUserContent, getItem } from "@esri/arcgis-rest-portal";
import { ArcgisContent } from "../types";

const ARCGIS_REST_USER_SESSION = '__ARCGIS_REST_USER_SESSION__';
const ARCGIS_REST_REDIRECT_URL = 'https://localhost:8443/auth';
const ARCGIS_REST_CLIENT_ID = '...';

export function getArcGisSession(): ArcGISIdentityManager | undefined {
  let session;
  const itemString = localStorage.getItem(ARCGIS_REST_USER_SESSION);
  if (itemString) {
     session = ArcGISIdentityManager.deserialize(itemString);
  }
  return session;
}

export function getAuthenticatedUser() {
  const session = getArcGisSession();
  let username = session ? session.username : '';
  const itemString = localStorage.getItem(ARCGIS_REST_USER_SESSION);
  if (itemString) {
  //    const session = ArcGISIdentityManager.deserialize(item);
  //    const user = await session.getUser();
    try {
      const item = JSON.parse(itemString);
      username = item.username;
    } catch(e) {
    }
  }
  return username;
}

function updateSessionInfo(session?: ArcGISIdentityManager) {
  if (session) {
    localStorage.setItem(ARCGIS_REST_USER_SESSION, session.serialize());
  } else {
    localStorage.removeItem(ARCGIS_REST_USER_SESSION);
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

export const myArcGisLogin = async () => {
  let options = {
    clientId: ARCGIS_REST_CLIENT_ID,
    redirectUri: ARCGIS_REST_REDIRECT_URL,
    popup: true,
    pkce: true
  }

  let username = '';
  let session: ArcGISIdentityManager | undefined;
  try {
    session = await ArcGISIdentityManager.beginOAuth2(options);
    if (session) {
      username = await session.getUsername();
    }
  }
  catch(e) {
    handleAuthError(e);
  };

  updateSessionInfo(session);
  return username;
};

export const myArcGisLogout = async () => {
  updateSessionInfo();
  return '';
};

export const arcGisContent = async (): Promise<ArcgisContent[]> => {
  const contentItems: ArcgisContent[] = [];
  const authentication = getArcGisSession();
  if (authentication) {
    const content = await getUserContent({
    // folderId: 'bao7',
    // start: 1,
    // num: 20,
    authentication
    });

    for (let i in content.items) {
      const item = content.items[i];
      if (item.url && item.type === 'Scene Service' && item.typeKeywords && item.typeKeywords.includes('Hosted Service')) {
        const contentItem: ArcgisContent = {
          id: item.id,
          name: item.title,
          mapUrl: item.url,
          created: item.created
        };
        contentItems.push(contentItem);
      }
      // id: string;
      // name: string;
      // mapUrl: string;
      // created: string;

      //      const item = await getItem(id, authentication);
      // items.push(id);
    }
  }
  return contentItems;
};
