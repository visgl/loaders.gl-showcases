import html2canvas from "html2canvas";
import {
  createComparisonBookmarkThumbnail,
  createViewerBookmarkThumbnail,
} from "./deck-thumbnail-utils";

jest.mock("html2canvas");
const html2canvasMock = html2canvas as unknown as jest.Mocked<any>;
const mockDrawImage = jest.fn();

const BASE64_IMAGE =
  "data:image/png;base64,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";

describe("Deck.gl thumbnails", () => {
  beforeAll(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      drawImage: mockDrawImage,
    });
    HTMLCanvasElement.prototype.toDataURL = jest
      .fn()
      .mockReturnValue(BASE64_IMAGE);
    html2canvasMock.mockImplementation(async () => {
      const canvas = document.createElement("canvas");
      return await Promise.resolve(canvas);
    });
  });

  test("createComparisonBookmarkThumbnail: should return null", async () => {
    const thumbnail = await createComparisonBookmarkThumbnail(
      "#container1",
      "#container2"
    );
    expect(thumbnail).toBeNull();
  });

  test("createComparisonBookmarkThumbnail: should return null", async () => {
    const div1 = document.createElement("div");
    div1.setAttribute("id", "container1");
    div1.setAttribute("width", "900");
    div1.setAttribute("height", "600");
    document.body.appendChild(div1);
    const div2 = document.createElement("div");
    div2.setAttribute("id", "container2");
    div2.setAttribute("width", "900");
    div2.setAttribute("height", "600");
    document.body.appendChild(div2);
    const thumbnail = await createComparisonBookmarkThumbnail(
      "#container1",
      "#container2"
    );
    expect(thumbnail).toBe(BASE64_IMAGE);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledTimes(3);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledTimes(1);
    expect(mockDrawImage).toHaveBeenCalledTimes(4);
  });

  test("createViewerBookmarkThumbnail: should return null", async () => {
    const thumbnail = await createViewerBookmarkThumbnail("#container3");
    expect(thumbnail).toBeNull();
  });
});
