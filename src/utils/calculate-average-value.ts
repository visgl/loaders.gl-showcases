export const calculateAverageValue = (
    minValue: number,
    maxValue: number
  ): number => {
    const valueSum = minValue + maxValue;

    return Math.floor(valueSum / 2);
  };
  