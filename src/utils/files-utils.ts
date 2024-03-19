/**
 * Allows to download json files
 * @param data
 * @param fileName
 */
export const downloadJsonFile = (
  data: Record<string, any>,
  fileName: string
) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = fileName;

  link.click();
};
