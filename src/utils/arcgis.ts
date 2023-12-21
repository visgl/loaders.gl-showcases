import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

import { getUserContent } from "@esri/arcgis-rest-portal";
import { ArcGisContent } from "../types";

const ARCGIS_REST_USER_SESSION = "__ARCGIS_REST_USER_SESSION__";
const ARCGIS_REST_USER_INFO = "__ARCGIS_REST_USER_INFO__";

const updateSessionInfo = async (
  session?: ArcGISIdentityManager
): Promise<string> => {
  let email = "";
  if (session) {
    localStorage.setItem(ARCGIS_REST_USER_SESSION, session.serialize());
    const user = await session.getUser();
    email = user.email || "";
    localStorage.setItem(ARCGIS_REST_USER_INFO, email);
  } else {
    localStorage.removeItem(ARCGIS_REST_USER_SESSION);
    localStorage.removeItem(ARCGIS_REST_USER_INFO);
  }
  return email;
};

function getArcGisSession(): ArcGISIdentityManager | undefined {
  let session;
  const itemString = localStorage.getItem(ARCGIS_REST_USER_SESSION);
  if (itemString) {
    session = ArcGISIdentityManager.deserialize(itemString);
  }
  return session;
}

/**
 * Gets the redirection URL and the client ID to use in the ArcGIS authentication workflow.
 * @returns the redirection URL and the client ID.
 */
const getAuthOptions = () => {
  const port = window.location.port ? `:${window.location.port}` : "";
  const options = {
    redirectUri: `${window.location.protocol}//${window.location.hostname}${port}/auth`,
    clientId: process.env.REACT_APP_ARCGIS_REST_CLIENT_ID || "",
    popup: true,
    pkce: true,
  };

  if (!options.clientId) {
    console.error("The ClientId is not defined in .env file.");
  }
  return options;
};

/**
 * Gets the email of the currently logged in user.
 * @returns the user's email or an empty string if the user is not logged in.
 */
export const getAuthenticatedUser = (): string => {
  return localStorage.getItem(ARCGIS_REST_USER_INFO) || "";
};

/**
 * Makes an ArcGIS login request by opening a popup dialog.
 * @returns email of the user logged in or an empty string if the user is not logged in.
 */
export const arcGisRequestLogin = async () => {
  let email = "";

  const options = getAuthOptions();
  if (options.clientId) {
    let session: ArcGISIdentityManager | undefined;
    try {
      session = await ArcGISIdentityManager.beginOAuth2(options);
    } finally {
      // In case of an exception the session is not set.
      // So the following call will remove any session stored in the local storage.
      email = await updateSessionInfo(session);
    }
  }
  return email;
};

/**
 * Completes the ArcGIS login request started by {@link arcGisRequestLogin}.
 */
export const arcGisCompleteLogin = async () => {
  const options = getAuthOptions();
  if (options.clientId) {
    ArcGISIdentityManager.completeOAuth2(options);
  }
};

/**
 * Makes an ArcGIS logout request.
 * @returns empty string
 */
export const arcGisRequestLogout = async () => {
  const session = getArcGisSession();
  if (session) {
    await ArcGISIdentityManager.destroy(session);
  }
  return await updateSessionInfo();
};

export const getArcGisUserContent = async (): Promise<ArcGisContent[]> => {
  const contentItems: ArcGisContent[] = [];
  const authentication = getArcGisSession();
  if (authentication) {
    const content = await getUserContent({ authentication });
    for (const item of content.items) {
      if (
        item.url &&
        item.type === "Scene Service" &&
        item.typeKeywords &&
        item.typeKeywords.includes("Hosted Service")
      ) {
        const contentItem: ArcGisContent = {
          id: item.id,
          name: item.title,
          url: item.url,
          created: item.created,
        };
        contentItems.push(contentItem);
      }
    }
  }
  return contentItems;
};
