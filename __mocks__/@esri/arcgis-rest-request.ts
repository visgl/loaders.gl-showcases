const mockEmailExpected = "usermail@gmail.com";
const mockSessionExpected = '{"usermail": "usermail"}';
const mockTokenExpectedPrefix = "token-";

const session = {
  usermail: mockEmailExpected,
  serialize: () => {
    return mockSessionExpected;
  },
  getUser: async () => {
    return { email: mockEmailExpected };
  },
  getToken: async (url: string) => {
    return mockTokenExpectedPrefix + url;
  },
};

export class ArcGISIdentityManager {
  static beginOAuth2 = async () => {
    return session;
  };
  static completeOAuth2 = async () => {
    return;
  };
  static destroy = async () => {
    return;
  };
  static deserialize = () => {
    return session;
  };
}
