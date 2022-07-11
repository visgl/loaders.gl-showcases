import styled from "styled-components";
import { Theme } from "../../utils/enums";
import { getCurrentLayoutProperty } from "../../utils/layout";

export type LayoutProps = {
  layout: string;
};

export enum Panels {
  Layers,
  ComparisonParams,
}

export const Container = styled.div<LayoutProps>`
  display: flex;
  flex-direction: column;
  width: 359px;
  background: ${({ theme }) => theme.colors.mainCanvasColor};
  opacity: ${({ theme }) => (theme.name === Theme.Dark ? 0.9 : 1)};
  border-radius: 8px;
  padding-bottom: 26px;
  position: relative;

  max-height: ${getCurrentLayoutProperty({
    desktop: "408px",
    tablet: "408px",
    mobile: "calc(50vh - 110px)",
  })};
`;

export const PanelHeader = styled.div<{ panel: number }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.panel === Panels.Layers ? "center" : "space-between"};
  background: transparent;
  position: relative;
  border-radius: 8px;
  margin-top: 20px;
  gap: 32px;
`;

export const HorizontalLine = styled.div<{ top?: number; bottom?: number }>`
  margin: ${({ top = 24, bottom = 16 }) => `${top}px 16px ${bottom}px 16px`};
  border: 1px solid ${({ theme }) => theme.colors.mainHiglightColorInverted};
  border-radius: 1px;
  background: ${({ theme }) => theme.colors.mainHiglightColorInverted};
  opacity: 0.12;
`;
