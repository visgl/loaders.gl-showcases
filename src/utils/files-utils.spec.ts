import { downloadJsonFile } from "./files-utils";

describe("DownloadJsonFile", () => {
  it("Should download the file", () => {
    const link = {
      click: jest.fn(),
    };
    // @ts-expect-error -  missing the following properties from type 'HTMLElement': accessKey, accessKeyLabel, autocapitalize, dir, and 283 more
    jest.spyOn(document, "createElement").mockImplementation(() => link);

    const data = {
      key: "value",
    };

    downloadJsonFile(data, "test.json");
    // @ts-expect-error - Property 'download' does not exist on type
    expect(link.download).toEqual("test.json");
    // @ts-expect-error - Property 'href' does not exist on type
    expect(link.href).toEqual(
      "data:text/json;chatset=utf-8,%7B%22key%22%3A%22value%22%7D"
    );
    expect(link.click).toHaveBeenCalledTimes(1);
  });
});
