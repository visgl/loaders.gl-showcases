import { parseTilesetUrlFromUrl } from "./url-utils";

const mockResponse = jest.fn();
Object.defineProperty(window, "location", {
  value: {
    hash: {
      endsWith: mockResponse,
      includes: mockResponse,
    },
    assign: mockResponse,
    href: "https://test.com?url=https://tileset-url.com",
  },
  writable: true,
});

test("Should parse tileset url", () => {
  const result = parseTilesetUrlFromUrl();
  expect(result).toBe("https://tileset-url.com");
});
