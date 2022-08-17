import styled from "styled-components";
import { CompareButtonMode } from "../../../types";
import { getCurrentLayoutProperty, useAppLayout } from "../../../utils/layout";

import StartIcon from "../../../../public/icons/start.svg";
import StopIcon from "../../../../public/icons/stop.svg";
import DownloadIcon from "../../../../public/icons/download.svg";

type LayoutProps = {
  layout: string;
};

const Container = styled.div<LayoutProps>`
  position: absolute;
  ${getCurrentLayoutProperty({
    desktop: "top: 100px",
    tablet: "top: 50%",
    mobile: "top: 50%",
  })};
  left: ${getCurrentLayoutProperty({
    desktop: "calc(50% - 95px)",
    tablet: "calc(50% - 90px)",
    mobile: "calc(50% - 90px)",
  })};
  background: ${({ theme }) => theme.colors.mapControlPanelColor};
  ${getCurrentLayoutProperty({
    desktop: "",
    tablet: "background: transparent",
    mobile: "background: transparent",
  })};
  display: flex;
  align-items: stretch;
  justify-content: center;
  border-radius: 12px;
  padding: 8px;
  gap: 8px;
  z-index: 1;
`;

const Button = styled.button`
  display: flex;
  color: ${({ theme }) => theme.colors.mainHiglightColorInverted};
  padding: 12px;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.mainColor};
  background-position: center;
  border: none;
  fill: ${({ theme }) => theme.colors.buttonIconColor};

  &:hover {
    fill: ${({ theme }) => theme.colors.buttonDimIconColor};
    background-color: ${({ theme }) => theme.colors.buttonDimColor};
  }
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  margin-left: 8px;
`;

type CompareButtonProps = {
  compareButtonMode: CompareButtonMode;
  downloadStats: boolean;
  disableButton: boolean;
  onCompareModeToggle: () => void;
};

export const CompareButton = ({
  compareButtonMode,
  downloadStats,
  disableButton,
  onCompareModeToggle,
}: CompareButtonProps) => {
  const layout = useAppLayout();

  return (
    <Container id="compare-button" layout={layout}>
      <Button disabled={disableButton} onClick={onCompareModeToggle}>
        {compareButtonMode === CompareButtonMode.Start && (
          <>
            <StartIcon />
            <Title>{CompareButtonMode.Start}</Title>
          </>
        )}
        {compareButtonMode === CompareButtonMode.Comparing && (
          <>
            <StopIcon />
            <Title>{CompareButtonMode.Comparing}</Title>
          </>
        )}
      </Button>
      {downloadStats && (
        <Button>
          <DownloadIcon />
        </Button>
      )}
    </Container>
  );
};
