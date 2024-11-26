import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { ActionButton } from "./action-button";
import { ActionButtonVariant } from "../../types";

describe("Action Button", () => {
  const onClick = jest.fn();

  it("Should render primary button by default", async () => {
    const { container } =
      renderWithTheme(
        <ActionButton onClick={onClick}>Action Button</ActionButton>
      ) ?? {};
    expect(container).toBeInTheDocument();

    const button = screen.getByText("Action Button") as Element;

    // TODO item is hovered after initialization
    expect(button).toHaveStyle({ "background-color": "#4744D3" });

    await userEvent.click(screen.getByText("Action Button"));
    expect(onClick).toHaveBeenCalled();
  });

  it("Should render primary button by props", async () => {
    const { container } =
      renderWithTheme(
        <ActionButton variant={ActionButtonVariant.primary} onClick={onClick}>
          Action Button
        </ActionButton>
      ) ?? {};
    expect(container).toBeInTheDocument();

    const button = screen.getByText("Action Button");
    // TODO item is hovered after initialization
    expect(button).toHaveStyle({ "background-color": "#4744D3" });
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it("Should render secondary button", async () => {
    const { container } =
      renderWithTheme(
        <ActionButton variant={ActionButtonVariant.secondary} onClick={onClick}>
          Action Button
        </ActionButton>
      ) ?? {};
    expect(container).toBeInTheDocument();

    const button = screen.getByText("Action Button");
    const bgColor = getComputedStyle(button as Element).getPropertyValue(
      "background-color"
    );

    expect(bgColor).toBe("transparent");

    // TODO item is hovered after initialization
    expect(button).toHaveStyle({ "border-color": "#000001" });
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it("Should render cancel button", async () => {
    const { container } =
      renderWithTheme(
        <ActionButton variant={ActionButtonVariant.cancel} onClick={onClick}>
          Action Button
        </ActionButton>
      ) ?? {};
    expect(container).toBeInTheDocument();

    const button = screen.getByText("Action Button");
    const bgColor = getComputedStyle(button as Element).getPropertyValue(
      "background-color"
    );

    expect(bgColor).toBe("transparent");

    const borderColor = getComputedStyle(button as Element).getPropertyValue(
      "border-color"
    );

    expect(borderColor).toBe("transparent");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it("Should't render if wrong type is provided", () => {
    renderWithTheme(
      <ActionButton
        // @ts-expect-error - Wrong types
        variant={"test"}
        onClick={onClick}
      >
        Action Button
      </ActionButton>
    );

    const button = screen.queryByText("Action Button");
    expect(button).toBe(null);
  });
});
