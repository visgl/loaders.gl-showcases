/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { fireEvent } from "@testing-library/react";
import { renderWithTheme } from "../../../../utils/testing-utils/render-with-theme";
import { InputDropdown } from "./input-dropdown";

describe("Input Text", () => {
  it("Should render InputText without label", () => {
    const onChange = jest.fn();

    const dom = renderWithTheme(
      <InputDropdown
        id="input-dropdown"
        value={["test1", "test2"]}
        onChange={onChange}
      />
    );

    const input: HTMLSelectElement | null =
      dom.container.querySelector("select");
    const inputLabel: HTMLLabelElement | null =
      dom.container.querySelector("label");

    expect(input).toBeInTheDocument();
    expect(inputLabel).not.toBeInTheDocument();
  });

  it("Should render InputText with label", () => {
    const onChange = jest.fn();

    const dom = renderWithTheme(
      <InputDropdown
        id="input-dropdown"
        label="Label Text"
        value={["test1", "test2"]}
        onChange={onChange}
      />
    );
    const input: HTMLSelectElement | null =
      dom.container.querySelector("select");
    const inputLabel: HTMLLabelElement | null =
      dom.container.querySelector("label");

    expect(input).toBeInTheDocument();
    expect(input?.value).toBe("test1");
    expect(inputLabel).toBeInTheDocument();
    expect(inputLabel?.textContent).toEqual("Label Text");
  });

  it("Should change InputText", () => {
    let changedValue = "";
    const onChange = jest
      .fn()
      .mockImplementation((event) => (changedValue = event.target.value));

    const dom = renderWithTheme(
      <InputDropdown
        id="input-dropdown"
        value={["test1", "test2"]}
        onChange={onChange}
      />
    );
    expect(dom).toBeDefined();
    if (!dom) {
      return;
    }
    const input: HTMLSelectElement | null =
      dom.container.querySelector("select");
    if (input) {
      fireEvent.change(input, { target: { value: "test2" } });
    }

    expect(changedValue).toBe("test2");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("Should handle value as prop", () => {
    const onChange = jest.fn();

    const dom = renderWithTheme(
      <InputDropdown
        id="input-dropdown"
        value={["test1", "test2"]}
        onChange={onChange}
      />
    );
    const input: HTMLSelectElement | null =
      dom.container.querySelector("select");

    expect(input?.value).toBe("test1");
    expect(onChange).toHaveBeenCalledTimes(0);
  });
});
