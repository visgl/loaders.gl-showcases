import styled from "styled-components";
import { Theme } from "../../utils/enums";
import { getCurrentLayoutProperty } from "../../utils/layout";

export type LayoutProps = {
  layout: string;
};

export enum Panels {
  Layers,
  ComparisonParams,
  MemoryUsage,
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
    desktop: "calc(100vh - 82px)",
    tablet: "382px",
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

export const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
`;

export const Title = styled.div<{ bottom?: number; left?: number }>`
  margin: ${({ bottom = 0, left = 0 }) => `0 0 ${bottom}px ${left}px`};
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

export const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 0px;
  margin-bottom: 8px;
`;

export const HorizontalLine = styled.div<{ top?: number; bottom?: number }>`
  margin: ${({ top = 24, bottom = 16 }) => `${top}px 16px ${bottom}px 16px`};
  border: 1px solid ${({ theme }) => theme.colors.mainHiglightColorInverted};
  border-radius: 1px;
  background: ${({ theme }) => theme.colors.mainHiglightColorInverted};
  opacity: 0.12;
`;
