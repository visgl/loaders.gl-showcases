const mockEmailExpected = "usermail@gmail.com";
const mockSessionExpected = '{"usermail": "usermail"}';

export class ArcGISIdentityManager {
  static beginOAuth2 = async () => {
    const session = {
      usermail: mockEmailExpected,
      serialize: () => {
        return mockSessionExpected;
      },
      getUser: async () => {
        return { email: mockEmailExpected };
      },
    };
    return session;
  };
  static completeOAuth2 = async () => {
    return;
  };
  static destroy = async () => {
    return;
  };
  static deserialize = (session) => {
    return { usermail: "usermail" };
  };
}
