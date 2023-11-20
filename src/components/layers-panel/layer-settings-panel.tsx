import { ReactEventHandler, useEffect } from "react";
import styled, { useTheme } from "styled-components";

import ArrowLeftIcon from "../../../public/icons/arrow-left.svg";
import { CloseButton } from "../close-button/close-button";
import { BuildingExplorer } from "./building-explorer";
import { PanelHorizontalLine } from "../common";
import { ActiveSublayer } from "../../utils/active-sublayer";
import { useAppDispatch } from "../../redux/hooks";
import { setColorsByAttrubute } from "../../redux/slices/colors-by-attribute-slice";
import { setFiltersByAttrubute } from "../../redux/slices/filters-by-attribute-slice";
import { ComparisonSideMode } from "../../types";

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
  side,
  onUpdateSublayerVisibility,
  onBackClick,
  onCloseClick,
  onBuildingExplorerOpened,
}: {
  sublayers: ActiveSublayer[];
  side?: ComparisonSideMode;
  onUpdateSublayerVisibility: (Sublayer) => void;
  onBackClick: ReactEventHandler;
  onCloseClick: ReactEventHandler;
  onBuildingExplorerOpened: (opended: boolean) => void;
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setColorsByAttrubute(null));
    return () => {
      dispatch(setColorsByAttrubute(null));
      dispatch(setFiltersByAttrubute({ filter: null, side }));
    };
  }, []);

  return (
    <Container>
      <Header>
        <Button data-testid="back-button-layers-panel" onClick={onBackClick}>
          <Icon>
            <ArrowLeftIcon fill={theme.colors.fontColor} />
          </Icon>
        </Button>
        Layer settings
        <CloseButton onClick={onCloseClick} />
      </Header>
      <PanelHorizontalLine top={13} bottom={12} />
      <BuildingExplorer
        sublayers={sublayers}
        onUpdateSublayerVisibility={onUpdateSublayerVisibility}
        onBuildingExplorerOpened={onBuildingExplorerOpened}
        side={side}
      ></BuildingExplorer>
    </Container>
  );
};
