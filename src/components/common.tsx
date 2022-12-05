import styled from "styled-components";
import { color_brand_quaternary } from "../constants/colors";
import { LayoutProps } from "../types";
import { Theme } from "../utils/enums";
import { getCurrentLayoutProperty } from "../utils/hooks/layout";

export enum Panels {
  Layers,
  ComparisonParams,
  MemoryUsage,
  Bookmarks,
}

export const PanelContainer = styled.div<LayoutProps>`
  display: flex;
  flex-direction: column;
  width: 359px;
  background: ${({ theme }) => theme.colors.mainCanvasColor};
  opacity: ${({ theme }) => (theme.name === Theme.Dark ? 0.9 : 1)};
  border-radius: 8px;
  padding-bottom: 26px;
  position: relative;

  max-height: ${getCurrentLayoutProperty({
    desktop: "calc(100vh - 115px)",
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

export const PanelContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
`;

export const PanelHorizontalLine = styled.div<{
  top?: number;
  bottom?: number;
}>`
  margin: ${({ top = 24, bottom = 16 }) => `${top}px 16px ${bottom}px 16px`};
  border: 1px solid ${({ theme }) => theme.colors.mainHiglightColorInverted};
  border-radius: 1px;
  background: ${({ theme }) => theme.colors.mainHiglightColorInverted};
  opacity: 0.12;
`;

export const LeftSideToolsPanelWrapper = styled.div<LayoutProps>`
  position: absolute;

  left: ${getCurrentLayoutProperty({
    desktop: "24px",
    tablet: "24px",
    mobile: "8px",
  })};

  ${getCurrentLayoutProperty({
    desktop: "top: 24px;",
    tablet: "top: 16px;",
    mobile: "bottom: 8px;",
  })};
`;

export const RightSideToolsPanelWrapper = styled(LeftSideToolsPanelWrapper)`
  left: auto;
  top: auto;

  ${getCurrentLayoutProperty({
    desktop: "right 24px",
    tablet: "left 24px",
    mobile: "left 8px",
  })};

  ${getCurrentLayoutProperty({
    desktop: "top: 24px;",
    tablet: "top: 16px;",
    mobile: "bottom: 8px;",
  })};
`;

export const LeftSidePanelWrapper = styled.div<LayoutProps>`
  position: absolute;
  z-index: 2;

  left: ${getCurrentLayoutProperty({
    desktop: "100px",
    tablet: "100px",
    /**
     * Make mobile panel centered horisontally
     * 180px is half the width of the mobile layers panel
     *  */
    mobile: "calc(50% - 180px)",
  })};

  ${getCurrentLayoutProperty({
    desktop: "top: 24px;",
    tablet: "top: 16px;",
    mobile: "bottom: 8px;",
  })};
`;

export const RightSidePanelWrapper = styled(LeftSidePanelWrapper)`
  left: auto;
  top: auto;

  ${getCurrentLayoutProperty({
    desktop: "right 100px;",
    tablet: "left: 100px;",
    /**
     * Make mobile panel centered horisontally
     * 180px is half the width of the mobile layers panel
     *  */
    mobile: "left: calc(50% - 180px);",
  })};

  ${getCurrentLayoutProperty({
    desktop: "top: 24px;",
    tablet: "top: 16px;",
    mobile: "bottom: 8px;",
  })};
`;

export const OptionsIcon = styled.div<{ panel: number }>`
  position: relative;
  width: 4px;
  height: 4px;
  background-color: ${({ theme, panel }) =>
    panel === Panels.Layers
      ? `${color_brand_quaternary}`
      : theme.colors.buttonIconColor};
  border-radius: 50%;
  margin-bottom: 12px;
  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 4px;
    height: 4px;
    left: 0px;
    background-color: ${({ theme, panel }) =>
      panel === Panels.Layers
        ? `${color_brand_quaternary}`
        : theme.colors.buttonIconColor};
    border-radius: inherit;
  }
  &:before {
    top: 6px;
  }
  &:after {
    top: 12px;
  }
`;

export const Title = styled.div<{ bottom?: number; left?: number }>`
  margin: ${({ bottom = 0, left = 0 }) => `0 0 ${bottom}px ${left}px`};
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 202px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.mainColor};
  color: ${({ theme }) => theme.colors.fontColor};
`;

export const MenuItem = styled.div<{
  customColor?: string;
  opacity?: number;
}>`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  padding: 10px 0px;
  color: ${({ theme, customColor }) =>
    customColor ? customColor : theme.colors.fontColor};
  opacity: ${({ opacity = 1 }) => opacity};
  display: flex;
  gap: 10px;
  cursor: pointer;
`;

export const MenuSettingsIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  margin-right: 10px;
`;

export const MenuDevider = styled.div`
  height: 1px;
  width: 100%;
  border-top: 1px solid #393a45;
`;
