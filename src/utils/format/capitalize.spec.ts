import { capitalize } from "./capitalize";

describe("Capitalize", () => {
  it("Should capitalize word", () => {
    const formatMemoryValue = capitalize("max");
    expect(formatMemoryValue).toBeDefined();
    expect(formatMemoryValue).toBe("Max");
  });
});
