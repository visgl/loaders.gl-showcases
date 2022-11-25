import { formatBoolean, formatFloatNumber, formatIntValue, formatStringValue } from "./format-utils";

describe("Format Utils", () => {
  describe("formatStringValue", () => {
    it("Should replace restricted values", () => {
      const result1 = formatStringValue("{asdf}");
      expect(result1).toBe("asdf");
      const result2 = formatStringValue("{}asdf'");
      expect(result2).toBe("asdf");
    });

    it("Should trim the string", () => {
      const result = formatStringValue("   {}asdf'    ");
      expect(result).toBe("asdf");
    });
  });

  describe("formatIntValue", () => {
    it("Should return empty string", () => {
      const result1 = formatIntValue(NaN);
      expect(result1).toBe("");
    });

    it("Should return formatted string", () => {
      const result1 = formatIntValue(123321);
      expect(result1).toBe("123321");
      const result2 = formatIntValue(-2292);
      expect(result2).toBe("-2292");
    });
  });

  describe("formatFloatValue", () => {
    it("Should return empty string", () => {
      const result1 = formatFloatNumber(NaN);
      expect(result1).toBe("");
    });

    it("Should return formatted string", () => {
      const result1 = formatFloatNumber(123321.3213333);
      expect(result1).toBe("123321.321");
      const result2 = formatFloatNumber(-0.33);
      expect(result2).toBe("-0.330");
    });
  });

  describe("formatBoolean", () => {
    it("Should return 'Yes'", () => {
      const result1 = formatBoolean(true);
      expect(result1).toBe("Yes");
    });

    it("Should return 'No'", () => {
      const result1 = formatBoolean(false);
      expect(result1).toBe("No");
    });
  });
});
