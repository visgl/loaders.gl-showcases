const mockContent = {
  items: [
    {
      id: "new-york",
      name: "NewYork.slpk",
      url: "https://123.com",
      created: 123456,
      type: "Scene Service",
      typeKeywords: "This is a Hosted Service",
      title: "New York",
      token: "token-https://123.com",
    },
    {
      id: "turanga-library",
      name: "TurangaLibrary.slpk",
      url: "https://456.com",
      created: 123457,
      type: "Scene Service",
      typeKeywords: "This is a Hosted Service",
      title: "Turanga Library",
      token: "token-https://456.com",
    },
  ],
};

export const getUserContent = async (authentication) => {
  return mockContent;
};
