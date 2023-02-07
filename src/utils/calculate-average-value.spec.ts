import { calculateAverageValue } from './calculate-average-value';

describe("Calculate average value", () => {
  it("Should calculate average value", () => {
    const formatMemoryValue = calculateAverageValue(1000, 2000);
    expect(formatMemoryValue).toBeDefined();
    expect(formatMemoryValue).toBe(1500);
  });
});
