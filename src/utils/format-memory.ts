const KB = 1024;
const MB = 1024 * KB;
const GB = 1024 * MB;

export function formatMemory(b: number) {
  let value;
  let unit;
  let precision;

  if (b < KB) {
    value = b;
    unit = " bytes";
    precision = 0;
  } else if (b < MB) {
    value = b / KB;
    unit = "kB";
    precision = 2;
  } else if (b < GB) {
    value = b / MB;
    unit = "MB";
    precision = 2;
  } else {
    value = b / GB;
    unit = "GB";
    precision = 2;
  }

  return `${value.toFixed(precision)}${unit}`;
}
