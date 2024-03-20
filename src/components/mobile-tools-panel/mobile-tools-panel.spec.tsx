import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActiveButton } from "../../types";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { MobileToolsPanel } from "./mobile-tools-panel";

const onChangeMock = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <MobileToolsPanel
      id={""}
      activeButton={ActiveButton.none}
      onChange={onChangeMock}
      {...props}
    />
  );
};

describe("Mobile Tools Panel", () => {
  it("Should render for viewer", async () => {
    const { container } = callRender(renderWithTheme);

    const mapButton = screen.getByText("Map");
    const memoryButton = screen.getByText("Memory");

    expect(container).toBeInTheDocument();
    expect(mapButton).toBeInTheDocument();
    expect(memoryButton).toBeInTheDocument();

    await userEvent.click(mapButton);
    expect(onChangeMock).toHaveBeenCalledWith(ActiveButton.options);

    await userEvent.click(memoryButton);
    expect(onChangeMock).toHaveBeenCalledWith(ActiveButton.memory);
  });

  it("Should render for debug", async () => {
    const { container } = callRender(renderWithTheme, {
      showDebug: true,
      showValidator: true,
    });
    expect(container).toBeInTheDocument();

    const mapButton = screen.getByText("Map");
    const memoryButton = screen.getByText("Memory");
    const validator = screen.getByText("Validator");
    const debugButton = screen.getByText("Debug");

    expect(container).toBeInTheDocument();
    expect(mapButton).toBeInTheDocument();
    expect(memoryButton).toBeInTheDocument();
    expect(validator).toBeInTheDocument();
    expect(debugButton).toBeInTheDocument();

    await userEvent.click(validator);
    expect(onChangeMock).toHaveBeenCalledWith(ActiveButton.validator);

    await userEvent.click(debugButton);
    expect(onChangeMock).toHaveBeenCalledWith(ActiveButton.debug);
  });
});
