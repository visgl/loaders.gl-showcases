import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { TextureSection } from "./texture-section";
import { getTile3d } from "../../test/tile-stub";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let tile3d;
beforeEach(() => {
  tile3d = getTile3d();
});

const callRender = (renderFunc, props = {}) => {
  return renderFunc(<TextureSection tile={tile3d} {...props} />);
};

describe("Texture Section", () => {
  it("Should render texture section", async () => {
    const { container } = callRender(renderWithTheme);
    expect(container.firstChild).toBeInTheDocument();

    const texturePanel = await screen.findByText("Texture:");
    expect(texturePanel).toBeInTheDocument();

    const texture = texturePanel?.nextSibling as Element;
    texture && userEvent.click(texture);

    const texturePreview = await screen.findByText("Preview texture");
    expect(texturePreview).toBeInTheDocument();
  });
});
