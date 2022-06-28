import styled from "styled-components";
import { Theme } from "../../utils/enums";
import { getCurrentLayoutProperty } from "../../utils/layout";

type LayoutProps = {
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
    props.panel === Panels.Layers ? "center" : "flex-start"};
  background: transparent;
  position: relative;
  border-radius: 8px;
  margin-top: 20px;
  gap: 32px;
`;

export const CloseButton = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  top: 0;
  right: 20px;
  width: 16px;
  height: 16px;
  cursor: pointer;

  &::after,
  &::before {
    content: "";
    position: absolute;
    height: 16px;
    width: 2px;
    background-color: ${({ theme }) => theme.colors.fontColor};
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }

  &:hover {
    &::before,
    &::after {
      background-color: ${({ theme }) => theme.colors.mainDimColorInverted};
    }
  }
`;

export const HorizontalLine = styled.div`
  margin: 20px 16px 16px 16px;
  border: 1px solid ${({ theme }) => theme.colors.mainHiglightColorInverted};
  border-radius: 1px;
  background: ${({ theme }) => theme.colors.mainHiglightColorInverted};
  opacity: 0.12;
`;
