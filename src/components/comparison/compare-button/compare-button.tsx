import { useRef } from "react";
import styled, { css } from "styled-components";
import { CompareButtonMode, Layout, LayoutProps, TooltipPosition } from "../../../types";
import { Title } from "../../common";
import StartIcon from "../../../../public/icons/start.svg";
import StopIcon from "../../../../public/icons/stop.svg";
import DownloadIcon from "../../../../public/icons/download.svg";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../../utils/hooks/layout";
import { Tooltip } from "../../tooltip/tooltip";

const Container = styled.div<LayoutProps & { disableButton: boolean }>`
  position: absolute;
  ${getCurrentLayoutProperty({
    desktop: "top: 100px",
    tablet: "top: 50%",
    mobile: "top: 50%",
  })};
  left: ${getCurrentLayoutProperty({
    desktop: "calc(50% - 89px)",
    tablet: "calc(50% - 85px)",
    mobile: "calc(50% - 85px)",
  })};
  background: ${({ theme }) => theme.colors.mapControlPanelColor};
  ${getCurrentLayoutProperty({
    desktop: "",
    tablet: "background: transparent",
    mobile: "background: transparent",
  })};
  cursor: pointer;
  display: flex;
  justify-content: center;
  border-radius: 12px;
  padding: 8px;
  gap: 8px;
  z-index: 1;
  ${({ disableButton }) =>
    disableButton &&
    css`
      cursor: not-allowed;
    `}
`;

const Button = styled.button<
  LayoutProps & { disabled: boolean; isMobile?: boolean }
>`
  display: flex;
  color: ${({ theme }) => theme.colors.mainHiglightColorInverted};
  padding: 12px;
  align-items: center;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.mainColor};
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  ${({ disabled, isMobile }) => {
    if (disabled) {
      return isMobile
        ? css`
            opacity: 0.8;
          `
        : css`
            opacity: 0.4;
          `;
    }
  }}
  fill: ${({ theme }) => theme.colors.buttonIconColor};
  :not([disabled])&:hover {
    fill: ${({ theme }) => theme.colors.buttonDimIconColor};
    background-color: ${({ theme }) => theme.colors.buttonDimColor};
  }
`;

const ButtonTitle = styled(Title)`
  margin: 0 0 0 8px;
  font-weight: 500;
  color: inherit;
`;

type CompareButtonProps = {
  compareButtonMode: CompareButtonMode;
  downloadStats: boolean;
  disableButton: boolean;
  disableDownloadButton: boolean;
  onCompareModeToggle: () => void;
  onDownloadClick: () => void;
};

export const CompareButton = ({
  compareButtonMode,
  downloadStats,
  disableButton,
  disableDownloadButton,
  onCompareModeToggle,
  onDownloadClick,
}: CompareButtonProps) => {
  const layout = useAppLayout();
  const isMobileLayout = layout !== Layout.Desktop;

  const refCompare = useRef(null);
  const refDownload = useRef(null);

  return (
    <Container
      id="compare-button"
      layout={layout}
      disableButton={disableButton}
    >
      <Button
        ref={refCompare}
        layout={layout}
        isMobile={isMobileLayout}
        disabled={disableButton}
        onClick={onCompareModeToggle}
      >
        {compareButtonMode === CompareButtonMode.Start && (
          <>
            <StartIcon />
            <ButtonTitle>{CompareButtonMode.Start}</ButtonTitle>
          </>
        )}
        {compareButtonMode === CompareButtonMode.Comparing && (
          <>
            <StopIcon />
            <ButtonTitle>{CompareButtonMode.Comparing}</ButtonTitle>
          </>
        )}
      </Button>
      {downloadStats && (
        <Button
          ref={refDownload}
          layout={layout}
          disabled={disableDownloadButton}
          onClick={onDownloadClick}
        >
          <DownloadIcon />
        </Button>
      )}
      <Tooltip
        refElement={refCompare}
        position={TooltipPosition.OnBottom}
        disabled={!disableButton}
      >
        You can start comparison when all tiles are fully loaded
      </Tooltip>

      <Tooltip refElement={refDownload} position={TooltipPosition.OnBottom}>
        Download comparison results
      </Tooltip>
    </Container>
  );
};
