import { formatMemory } from "./format-memory";

describe("Format Memory", () => {
  it("Should display bytes", () => {
    const formatMemoryValue = formatMemory(4);
    expect(formatMemoryValue).toBeDefined();
    expect(formatMemoryValue).toBe("4 bytes");
  });

  it("Should display kilobytes", () => {
    const formatMemoryValue = formatMemory(5454);
    expect(formatMemoryValue).toBeDefined();
    expect(formatMemoryValue).toBe("5.33kB");
  });

  it("Should display megabytes", () => {
    const formatMemoryValue = formatMemory(54546573);
    expect(formatMemoryValue).toBeDefined();
    expect(formatMemoryValue).toBe("52.02MB");
  });

  it("Should display gigabytes", () => {
    const formatMemoryValue = formatMemory(5454657376);
    expect(formatMemoryValue).toBeDefined();
    expect(formatMemoryValue).toBe("5.08GB");
  });
});
