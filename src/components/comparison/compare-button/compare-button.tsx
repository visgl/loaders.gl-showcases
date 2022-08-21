import styled from "styled-components";
import { CompareButtonMode } from "../../../types";
import { getCurrentLayoutProperty, useAppLayout } from "../../../utils/layout";
import { Title } from "../common";
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
    tablet: "calc(50% - 85px)",
    mobile: "calc(50% - 85px)",
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

const ButtonTitle = styled(Title)`
  margin: 0 0 0 8px;
  font-weight: 500;
  color: inherit;
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
        <Button>
          <DownloadIcon />
        </Button>
      )}
    </Container>
  );
};
