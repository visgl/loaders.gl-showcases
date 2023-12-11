import { ArcGISIdentityManager } from '@esri/arcgis-rest-request';

const ARCGIS_REST_USER_SESSION = '__ARCGIS_REST_USER_SESSION__';
const ARCGIS_REST_USER_INFO = '__ARCGIS_REST_USER_INFO__';

const updateSessionInfo = async (session?: ArcGISIdentityManager): Promise<string> => {
  let email: string = '';
  if (session) {
    localStorage.setItem(ARCGIS_REST_USER_SESSION, session.serialize());
    const user = await session.getUser();
    email = user.email || '';
    localStorage.setItem(ARCGIS_REST_USER_INFO, email);
  } else {
    localStorage.removeItem(ARCGIS_REST_USER_SESSION);
    localStorage.removeItem(ARCGIS_REST_USER_INFO);
  }
  return email;
}

/**
 * Gets the redirection URL and the client ID to use in the ArcGIS authentication workflow.
 * @returns the redirection URL and the client ID.
 */
export const getAuthOptions = () => {
  return {
    redirectUrl: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/auth`,
    clientId: process.env.REACT_APP_ARCGIS_REST_CLIENT_ID
  }
}

/**
 * Gets the email of the currently logged in user.
 * @returns the user's email or an empty string if the user is not logged in.
 */
export const getAuthenticatedUser = (): string => {
  return  localStorage.getItem(ARCGIS_REST_USER_INFO) || '';
}

/**
 * 
 * @returns 
 */
export const arcGisRequestLogin = async () => {
  const { redirectUrl, clientId } = getAuthOptions();

  if (!clientId) {
    console.error("The ClientId is not defined in .env file.");
    return '';
  }
  const options = {
    clientId: clientId,
    redirectUri: redirectUrl,
    popup: true,
    pkce: true
  }

  let email = '';
  let session: ArcGISIdentityManager | undefined;
  try {
    session = await ArcGISIdentityManager.beginOAuth2(options);
  }
  finally {
    // In case of an exception the session is not set.
    // So the following call will remove any session stored in the local storage.
    email = await updateSessionInfo(session);
  }
  return email;
};

export const arcGisRequestLogout = async () => {
  return await updateSessionInfo();
};
