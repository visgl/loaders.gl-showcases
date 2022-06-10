import { renderWithTheme } from "./render-with-theme";
import styled from "styled-components";
import { getByRole } from "@testing-library/react";

describe("Render width theme", () => {
  it("Should wrap child component with theme props", () => {
    const StyledDiv = styled.div`
      color: ${({ theme }) => theme.colors.mainColor};
    `;
    const dom = renderWithTheme(
      <StyledDiv role="greeting">Hello world</StyledDiv>
    );
    const item = getByRole(dom.container, "greeting");
    const color = getComputedStyle(item).getPropertyValue("color");

    expect(color).toEqual("white");
  });
});
