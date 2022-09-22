import { calculateAverageValue } from './calculate-average-value';

describe("Format Memory", () => {
  it("Should calculate average value", () => {
    const formatMemoryValue = calculateAverageValue(1000, 2000);
    expect(formatMemoryValue).toBeDefined();
    expect(formatMemoryValue).toBe(1500);
  });
});
