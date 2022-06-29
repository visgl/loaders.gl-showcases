/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { ComparisonParamsPanel } from "./comparison-params-panel";

describe("Comparison Params Panel", () => {
  it("Should render panel", () => {
    const props = {
      id: "params-test",
      isCompressedGeometry: false,
      isCompressedTextures: false,
      onGeometryChange: jest.fn(),
      onTexturesChange: jest.fn(),
      onClose: jest.fn(),
    }

    const { container } = renderWithTheme(
      <ComparisonParamsPanel {...props}/>
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText("Comparison parameters")).toBeInTheDocument();
    expect(screen.getByText("Draco compressed geometry")).toBeInTheDocument();
    expect(screen.getByText("Compressed textures")).toBeInTheDocument();
  });
});