import styled, { css } from "styled-components";
import { CompareButtonMode, Layout } from "../../../types";
import { Title } from "../../common";
import StartIcon from "../../../../public/icons/start.svg";
import StopIcon from "../../../../public/icons/stop.svg";
import DownloadIcon from "../../../../public/icons/download.svg";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../../utils/hooks/layout";
import { useState } from "react";

type LayoutProps = {
  layout: string;
};

const Container = styled.div<LayoutProps & { disableButton: boolean }>`
  position: absolute;
  ${getCurrentLayoutProperty({
    desktop: "top: 100px",
    tablet: "top: 50%",
    mobile: "top: 50%",
  })};
  left: ${getCurrentLayoutProperty({
    desktop: "calc(50% - 95px)",
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

const Button = styled.button<LayoutProps & { disableButton: boolean }>`
  display: flex;
  color: ${({ theme }) => theme.colors.mainHiglightColorInverted};
  padding: 12px;
  align-items: center;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.mainColor};
  background-position: center;
  border: none;
  fill: ${({ theme }) => theme.colors.buttonIconColor};
  cursor: inherit;

  ${({ disableButton }) =>
    disableButton &&
    css`
      ${getCurrentLayoutProperty({
        desktop: "opacity: 0.4",
        tablet: "opacity: 0.8",
        mobile: "opacity: 0.8",
      })};
    `}

  :not([disabled])&:hover {
    fill: ${({ theme }) => theme.colors.buttonDimIconColor};
    background-color: ${({ theme }) => theme.colors.buttonDimColor};
  }
`;

const Tooltip = styled.div<{ isMobile: boolean }>`
  position: absolute;
  top: 70px;
  left: calc(50% - 200px);
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
      height: 38px;
      width: 250px;
      left: calc(50% - 130px);
      top: 65px;
      white-space: normal;
      text-align: center;
    `}

  &:before {
    content: "";
    position: absolute;
    bottom: 95%;
    left: calc(50% - 15px);
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

export const CompareButton = ({
  compareButtonMode,
  downloadStats,
  disableButton,
  disableDownloadButton,
  onCompareModeToggle,
  onDownloadClick,
}: CompareButtonProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const layout = useAppLayout();
  const isMobileLayout = layout !== Layout.Desktop;

  const showTooltip = (isHovering || isMobileLayout) && disableButton;

  const onPointerEnter = () => {
    setIsHovering(true);
  };

  const onPointerLeave = () => {
    setIsHovering(false);
  };

  return (
    <Container
      id="compare-button"
      layout={layout}
      disableButton={disableButton}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <Button
        layout={layout}
        disabled={disableButton}
        onClick={onCompareModeToggle}
        disableButton={disableButton}
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
          layout={layout}
          disabled={disableDownloadButton}
          disableButton={disableButton}
          onClick={onDownloadClick}
        >
          <DownloadIcon />
        </Button>
      )}
      {showTooltip && (
        <Tooltip isMobile={isMobileLayout}>
          You can start comparison when all tiles are fully loaded
        </Tooltip>
      )}
    </Container>
  );
};
