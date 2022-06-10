/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { fireEvent } from "@testing-library/react";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { InputText } from "./input-text";

describe("Input Text", () => {
  it("Should render InputText without label", () => {
    const onChange = jest.fn();

    const dom = renderWithTheme(
      <InputText id="input-test" onChange={onChange} />
    );

    const input: HTMLElement | null =
      dom.container.querySelector("input[type=text]");
    const inputLabel: HTMLLabelElement | null =
      dom.container.querySelector("label");

    expect(input).toBeInTheDocument();
    expect(inputLabel).not.toBeInTheDocument();
  });

  it("Should render InputText with label", () => {
    const onChange = jest.fn();

    const dom = renderWithTheme(
      <InputText id="input-test" label="Label Text" onChange={onChange} />
    );
    const input: HTMLElement | null =
      dom.container.querySelector("input[type=text]")!;
    const inputLabel: HTMLLabelElement | null =
      dom.container.querySelector("label")!;

    expect(input).toBeInTheDocument();
    expect(inputLabel).toBeInTheDocument();
    expect(inputLabel?.textContent).toEqual("Label Text");
  });

  it("Should change InputText", () => {
    const onChange = jest.fn();

    const dom = renderWithTheme(
      <InputText id="input-test" onChange={onChange} />
    );
    const input: HTMLInputElement | null =
      dom.container.querySelector("input[type=text]")!;
    fireEvent.change(input, { target: { value: "test" } });

    expect(input.value).toBe("test");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("Should handle value as prop", () => {
    const onChange = jest.fn();

    const dom = renderWithTheme(
      <InputText id="input-test" value="test-prop-value" onChange={onChange} />
    );
    const input: HTMLInputElement | null =
      dom.container.querySelector("input[type=text]")!;

    expect(input.value).toBe("test-prop-value");
    expect(onChange).toHaveBeenCalledTimes(0);
  });
});
