import { ReactEventHandler } from "react";
import styled, { useTheme } from "styled-components";

import ArrowLeftIcon from "../../../../public/icons/arrow-left.svg";
import { Sublayer } from "../../../types";
import { CloseButton } from "../../close-button/close-button";
import { BuildingExplorer } from "./building-explorer";
import { HorizontalLine } from "../common";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const Header = styled.div`
  display: flex;
  margin: 19px 6px 0px;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.fontColor};
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
`;

const Button = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Icon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LayerSettingsPanel = ({
  sublayers,
  onUpdateSublayerVisibility,
  onBackClick,
  onCloseClick,
}: {
  sublayers: Sublayer[];
  onUpdateSublayerVisibility: (Sublayer) => void;
  onBackClick: ReactEventHandler;
  onCloseClick: ReactEventHandler;
}) => {
  const theme = useTheme();
  return (
    <Container>
      <Header>
        <Button onClick={onBackClick}>
          <Icon>
            <ArrowLeftIcon fill={theme.colors.fontColor} />
          </Icon>
        </Button>
        Layer settings
        <CloseButton onClick={onCloseClick} />
      </Header>
      <HorizontalLine top={13} bottom={12} />
      <BuildingExplorer
        sublayers={sublayers}
        onUpdateSublayerVisibility={onUpdateSublayerVisibility}
      ></BuildingExplorer>
    </Container>
  );
};
