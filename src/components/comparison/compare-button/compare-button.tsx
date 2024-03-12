import { useState, RefObject, useRef } from "react";
import styled, { css } from "styled-components";
import { CompareButtonMode, Layout, LayoutProps } from "../../../types";
import { Title } from "../../common";
import StartIcon from "../../../../public/icons/start.svg";
import StopIcon from "../../../../public/icons/stop.svg";
import DownloadIcon from "../../../../public/icons/download.svg";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../../utils/hooks/layout";

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

const WrapperContainer = styled.div<{
  isMobile: boolean | undefined;
  centerX: number;
  centerY: number;
}>`
  position: fixed;
  top: calc(${({ centerY }) => centerY}px + 22px);
  left: ${({ centerX }) => centerX}px;
  transform: translate(-50%, 0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0;
`;

const TooltipDiv = styled.div<{
  isMobile: boolean | undefined;
}>`
  position: relative;
  background-color: ${({ theme }) => theme.colors.mainHiglightColor};
  border-radius: 8px;
  padding: 8px;
  z-index: 1;
  font-weight: 500;
  font-style: normal;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
  white-space: nowrap;

  ${({ isMobile }) =>
    isMobile &&
    css`
      white-space: normal;
      text-align: center;
      max-width: 250px;
    `}

  &:before {
    content: "";
    position: absolute;
    bottom: 95%;
    left: calc(50% - 9px);
    border: 9px solid transparent;
    border-bottom-color: ${({ theme }) => theme.colors.mainHiglightColor};
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

type TooltipProps = {
  refElement: RefObject<HTMLElement>;
  isMobileLayout: boolean;
  children: React.ReactNode;
};

const Tooltip = ({ refElement, isMobileLayout, children }: TooltipProps) => {
  let centerX = 0;
  let centerY = 0;

  if (refElement.current) {
    const rect = refElement.current.getBoundingClientRect();
    centerX = rect.left + rect.width / 2.0;
    centerY = rect.top + rect.height;
  }
  return (
    <WrapperContainer
      isMobile={isMobileLayout}
      centerX={centerX}
      centerY={centerY}
    >
      <TooltipDiv isMobile={isMobileLayout}>{children}</TooltipDiv>
    </WrapperContainer>
  );
};

export const CompareButton = ({
  compareButtonMode,
  downloadStats,
  disableButton,
  disableDownloadButton,
  onCompareModeToggle,
  onDownloadClick,
}: CompareButtonProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isHoveringDownload, setIsHoveringDownload] = useState<boolean>(false);

  const layout = useAppLayout();
  const isMobileLayout = layout !== Layout.Desktop;

  const refCompare = useRef(null);
  const refDownload = useRef(null);

  const onPointerEnter = () => {
    setIsHovering(true);
  };

  const onPointerLeave = () => {
    setIsHovering(false);
  };

  const onPointerEnterDownload = () => {
    setIsHoveringDownload(true);
  };

  const onPointerLeaveDownload = () => {
    setIsHoveringDownload(false);
  };

  let showTooltip = false;
  let refElement;
  let content;
  if ((isHovering || isMobileLayout) && disableButton) {
    showTooltip = true;
    refElement = refCompare;
    content = "You can start comparison when all tiles are fully loaded";
  } else if ((isHoveringDownload || isMobileLayout) && downloadStats) {
    showTooltip = true;
    refElement = refDownload;
    content = "Download comparison results";
  }

  return (
    <Container
      id="compare-button"
      $layout={layout}
      disableButton={disableButton}
    >
      <Button
        ref={refCompare}
        $layout={layout}
        isMobile={isMobileLayout}
        disabled={disableButton}
        onClick={onCompareModeToggle}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
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
          $layout={layout}
          disabled={disableDownloadButton}
          onClick={onDownloadClick}
          onPointerEnter={onPointerEnterDownload}
          onPointerLeave={onPointerLeaveDownload}
        >
          <DownloadIcon />
        </Button>
      )}

      {showTooltip && (
        <Tooltip refElement={refElement} isMobileLayout={isMobileLayout}>
          {content}
        </Tooltip>
      )}
    </Container>
  );
};
