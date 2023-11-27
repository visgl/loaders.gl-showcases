import { ArcGISIdentityManager } from '@esri/arcgis-rest-request';
import { getUserContent } from "@esri/arcgis-rest-portal";
import { ArcGisContent } from "../types";

const ARCGIS_REST_USER_SESSION = '__ARCGIS_REST_USER_SESSION__';

const ARCGIS_REST_REDIRECT_URL = process.env.REACT_APP_ARCGIS_REST_REDIRECT_URL || '';
const ARCGIS_REST_CLIENT_ID = process.env.REACT_APP_ARCGIS_REST_CLIENT_ID || '';

function getArcGisSession(): ArcGISIdentityManager | undefined {
  let session;
  const itemString = localStorage.getItem(ARCGIS_REST_USER_SESSION);
  if (itemString) {
     session = ArcGISIdentityManager.deserialize(itemString);
  }
  return session;
}

export function getAuthenticatedUser() {
  const session = getArcGisSession();
  const username = session ? session.username : '';
  return username;
}

function updateSessionInfo(session?: ArcGISIdentityManager) {
  if (session) {
    localStorage.setItem(ARCGIS_REST_USER_SESSION, session.serialize());
  } else {
    localStorage.removeItem(ARCGIS_REST_USER_SESSION);
  }
}

export const arcGisRequestLogin = async () => {
  if (!ARCGIS_REST_CLIENT_ID || !ARCGIS_REST_REDIRECT_URL) {
    console.error("The ClientId or the RedirectUrl is not defined in .env file.");
    return '';
  }
  const options = {
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
  finally {
    // In case of an exception the session is not set.
    // So the following call will remove any session stored in the local storage.
    updateSessionInfo(session);
  }

  return username;
};

export const arcGisRequestLogout = async () => {
  updateSessionInfo();
  return '';
};

export const getArcGisUserContent = async (): Promise<ArcGisContent[]> => {
  const contentItems: ArcGisContent[] = [];
  const authentication = getArcGisSession();
  if (authentication) {
    const content = await getUserContent({
    authentication
    });

    for (const item of content.items) {
      if (item.url && item.type === 'Scene Service' && item.typeKeywords && item.typeKeywords.includes('Hosted Service')) {
        const contentItem: ArcGisContent = {
          id: item.id,
          name: item.title,
          url: item.url,
          created: item.created
        };
        contentItems.push(contentItem);
      }
    }
  }
  return contentItems;
};
