const FLOAT_VALUES_FIXED_COUNT = 3;

/**
 * Format string value:
 * replace "{}'"->""
 * trim string
 * @param value string value
 * @returns formatted string
 */
export const formatStringValue = (value = ""): string => {
  return value.replace(/[{}']+/g, "").trim();
};

/**
 * Format int value:
 * * return "" if NaN
 * * convert to string
 * @param value number value
 * @returns string formatted value
 */
export const formatIntValue = (value: number): string => {
  if (isNaN(value)) {
    return "";
  }
  return value.toString();
};

/**
 * Format float number:
 * * return "" if NaN
 * * convert to fixed `FLOAT_VALUES_FIXED_COUNT` fraction digits number
 * @param value number value
 * @returns formatted string
 */
export const formatFloatNumber = (value: number): string => {
  if (isNaN(value)) {
    return "";
  }
  return value.toFixed(FLOAT_VALUES_FIXED_COUNT);
};

/**
 * Format boolean:
 * return "Yes" if true
 * return "No" if false
 * @param value boolean value
 * @returns formatted string
 */
export const formatBoolean = (value: boolean): string => {
  return value ? "Yes" : "No";
};

/**
 * Formats a date according to "en-US" locale.
 * @param timestamp - timestamp to convert to string.
 * @returns date formatted.
 */
export const formatTimestamp = (timestamp: number): string => {
 const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
  return formatter.format(timestamp);
}
