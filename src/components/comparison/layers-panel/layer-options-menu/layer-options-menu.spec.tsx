import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LayerOptionsMenu } from "./layer-options-menu";
import { renderWithTheme } from "../../../../utils/testing-utils/render-with-theme";

describe("Layer option menu", () => {
  it("Should render options only with point to layer", () => {
    const onPointToLayerClick = jest.fn();
    const onLayerSettingsClick = jest.fn();
    const onDeleteLayerClick = jest.fn();

    renderWithTheme(
      <LayerOptionsMenu
        layerId={"test"}
        showLayerSettings={false}
        showDeleteLayer={false}
        onPointToLayerClick={onPointToLayerClick}
        onLayerSettingsClick={onLayerSettingsClick}
        onDeleteLayerClick={onDeleteLayerClick}
      />
    );

    const pointToLayerIcon = screen.getByText("Point to layer");
    expect(pointToLayerIcon).toBeInTheDocument();
    userEvent.click(pointToLayerIcon);
    expect(onPointToLayerClick).toHaveBeenCalled();
  });

  it("Should render options with point to layer, layer settings and delete layer", () => {
    const onPointToLayerClick = jest.fn();
    const onLayerSettingsClick = jest.fn();
    const onDeleteLayerClick = jest.fn();

    renderWithTheme(
      <LayerOptionsMenu
        layerId={"test"}
        showLayerSettings={true}
        showDeleteLayer={true}
        onPointToLayerClick={onPointToLayerClick}
        onLayerSettingsClick={onLayerSettingsClick}
        onDeleteLayerClick={onDeleteLayerClick}
      />
    );

    const pointToLayer = screen.getByText("Point to layer");
    expect(pointToLayer).toBeInTheDocument();
    userEvent.click(pointToLayer);
    expect(onPointToLayerClick).toHaveBeenCalled();

    const layerSettings = screen.getByText("Layer settings");
    expect(layerSettings).toBeInTheDocument();
    userEvent.click(layerSettings);
    expect(onLayerSettingsClick).toHaveBeenCalled();

    const deleteLayer = screen.getByText("Delete layer");
    expect(deleteLayer).toBeInTheDocument();
    userEvent.click(deleteLayer);
    expect(onDeleteLayerClick).toHaveBeenCalled();
  });
});
