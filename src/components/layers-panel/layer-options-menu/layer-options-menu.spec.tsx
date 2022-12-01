import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LayerOptionsMenu } from "./layer-options-menu";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";

describe("Layer option menu", () => {
  it("Should render options only with point to layer", () => {
    const onPointToLayerClick = jest.fn();
    const onLayerSettingsClick = jest.fn();
    const onDeleteLayerClick = jest.fn();

    renderWithTheme(
      <LayerOptionsMenu
        layer={{
          id: "test",
          name: "test",
          url: "https://test.url",
        }}
        selected={false}
        hasSettings={false}
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
        layer={{
          id: "test",
          name: "test",
          url: "https://test.url",
          custom: true,
        }}
        selected={false}
        hasSettings={true}
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

  it("Should point to child layer viewState if layer is group", () => {
    const onPointToLayerClick = jest.fn();
    const onLayerSettingsClick = jest.fn();
    const onDeleteLayerClick = jest.fn();

    renderWithTheme(
      <LayerOptionsMenu
        layer={{
          id: "test",
          name: "test",
          url: "",
          layers: [
            {
              id: "test",
              name: "test",
              url: "https://test.url",
            },
            {
              id: "1-test",
              name: "test",
              url: "https://test.url",
              viewState: {
                zoom: 10,
                latitude: 30,
                longitude: 120,
              },
            },
          ],
        }}
        selected={false}
        hasSettings={false}
        onPointToLayerClick={onPointToLayerClick}
        onLayerSettingsClick={onLayerSettingsClick}
        onDeleteLayerClick={onDeleteLayerClick}
      />
    );

    const pointToLayerIcon = screen.getByText("Point to layer");
    expect(pointToLayerIcon).toBeInTheDocument();
    userEvent.click(pointToLayerIcon);
    expect(onPointToLayerClick).toHaveBeenCalledWith({
      latitude: 30,
      longitude: 120,
      zoom: 10,
    });
  });

  it("Should point to deep child layer viewState if layer is group", () => {
    const onPointToLayerClick = jest.fn();
    const onLayerSettingsClick = jest.fn();
    const onDeleteLayerClick = jest.fn();

    renderWithTheme(
      <LayerOptionsMenu
        layer={{
          id: "test",
          name: "test",
          url: "",
          layers: [
            {
              id: "1-test",
              name: "test",
              url: "https://test1.url",
              layers: [
                {
                  id: "2-test",
                  name: "test",
                  url: "https://test2.url",
                  viewState: {
                    zoom: 10,
                    latitude: 30,
                    longitude: 120,
                  },
                },
              ],
            },
          ],
        }}
        selected={false}
        hasSettings={false}
        onPointToLayerClick={onPointToLayerClick}
        onLayerSettingsClick={onLayerSettingsClick}
        onDeleteLayerClick={onDeleteLayerClick}
      />
    );

    const pointToLayerIcon = screen.getByText("Point to layer");
    expect(pointToLayerIcon).toBeInTheDocument();
    userEvent.click(pointToLayerIcon);
    expect(onPointToLayerClick).toHaveBeenCalledWith({
      latitude: 30,
      longitude: 120,
      zoom: 10,
    });
  });
});
