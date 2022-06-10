import styled, { css } from "styled-components";

import {
  color_brand_tertiary,
  dim_brand_tertinary,
} from "../../constants/colors";

import GearIconWhite from "../../../public/icons/gear-white.svg";
import SettingsIconWhite from "../../../public/icons/settings-white.svg";
import MemoryIconWhite from "../../../public/icons/memory-white.svg";

import GearIconGrey from "../../../public/icons/gear-grey.svg";
import SettingsIconGrey from "../../../public/icons/settings-grey.svg";
import MemoryIconGrey from "../../../public/icons/memory-grey.svg";

import { ActiveButton, Layout, Theme } from "../../types";
import { useAppLayout } from "../../utils/layout";

type ButtonProps = {
  active: boolean;
  lightImage: string;
  darkImage: string;
  layout: Layout;
};

type MainToolsPanelProps = {
  id: string;
  activeButton: ActiveButton;
  showLayerOptions?: boolean;
  showComparisonSettings?: boolean;
  onChange?: (active: ActiveButton) => void;
};

type ContainerProps = {
  id: string;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.colors.mainCanvasColor};
  border-radius: 12px;
  padding: 2px;
`;

const Button = styled.button<ButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  width: 56px;
  height: 60px;
  cursor: pointer;
  background: url(${(props) =>
      props.active
        ? props.lightImage
        : props.theme.name === Theme.Light
        ? props.darkImage
        : props.lightImage})
    no-repeat;
  background-color: ${(props) =>
    props.active ? color_brand_tertiary : "transparent"};
  background-position: center;
  outline: 0;
  border: none;

  ${({ layout, lightImage }) =>
    layout === Layout.Desktop &&
    css`
      &:hover {
        background: url(${lightImage}) no-repeat;
        background-position: center;
        background-color: ${dim_brand_tertinary};
      }
    `}
`;

export const MainToolsPanel = ({
  id,
  activeButton,
  showLayerOptions = true,
  showComparisonSettings = true,
  onChange = () => ({}),
}: MainToolsPanelProps) => {
  const layout = useAppLayout();

  return (
    <Container id={id}>
      {showLayerOptions && (
        <Button
          layout={layout}
          active={activeButton === ActiveButton.options}
          darkImage={GearIconGrey}
          lightImage={GearIconWhite}
          onClick={() => onChange(ActiveButton.options)}
        />
      )}
      {showComparisonSettings && (
        <Button
          layout={layout}
          active={activeButton === ActiveButton.settings}
          darkImage={SettingsIconGrey}
          lightImage={SettingsIconWhite}
          onClick={() => onChange(ActiveButton.settings)}
        />
      )}
      <Button
        layout={layout}
        active={activeButton === ActiveButton.memory}
        darkImage={MemoryIconGrey}
        lightImage={MemoryIconWhite}
        onClick={() => onChange(ActiveButton.memory)}
      />
    </Container>
  );
};
