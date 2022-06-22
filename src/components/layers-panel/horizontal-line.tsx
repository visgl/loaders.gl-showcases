import styled from "styled-components";

export const HorizontalLine = styled.div<{ top?: number; bottom?: number }>`
  margin: ${({ top = 24, bottom = 16 }) => `${top}px 16px ${bottom}px 16px`};
  border: 1px solid ${({ theme }) => theme.colors.mainHiglightColorInverted};
  border-radius: 1px;
  background: ${({ theme }) => theme.colors.mainHiglightColorInverted};
  opacity: 0.12;
`;
