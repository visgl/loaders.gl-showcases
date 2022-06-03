const FLOAT_VALUES_FIXED_COUNT = 3;

export const formatStringValue = (value = ""): string => {
  return value.replace(/[{}']+/g, "").trim();
};

export const formatIntValue = (value: number): string => {
  if (isNaN(value) || value === null) {
    return "";
  }
  return value.toString();
};

export const formatFloatNumber = (value: number): string => {
  if (isNaN(value)) {
    return "";
  }
  return value.toFixed(FLOAT_VALUES_FIXED_COUNT);
};
