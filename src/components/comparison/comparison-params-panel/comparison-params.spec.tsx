/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { fireEvent, screen } from "@testing-library/react";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { ComparisonParamsPanel } from "./comparison-params-panel";

describe("Comparison Params Panel", () => {
  it("Should render panel", () => {
    const onClose = jest.fn();

    const { container } = renderWithTheme(
      <ComparisonParamsPanel id="params-test" onClose={onClose} />
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText("Comparison parameters")).toBeInTheDocument();
    expect(screen.getByText("Draco compressed geometry")).toBeInTheDocument();
    expect(screen.getByText("Compressed textures")).toBeInTheDocument();
  });

  it("Toggle switch should be checked", () => {
    const onClose = jest.fn();

    const { getAllByRole } = renderWithTheme(
      <ComparisonParamsPanel id="params-test" onClose={onClose} />
    );
    getAllByRole("checkbox").forEach((item) => {
      item.click();
      fireEvent.change(item, { target: { checked: "true" } });
      expect(item).toBeChecked();
    });
  });
});
