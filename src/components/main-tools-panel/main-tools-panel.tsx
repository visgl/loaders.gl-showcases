import { useState } from "react";
import styled, { css } from "styled-components";

import { color_ui_primary, dim_ui_primary } from "../../constants/colors";

import GearIconWhite from "../../../public/icons/gear-white.svg";
import SettingsIconWhite from "../../../public/icons/settings-white.svg";
import MemoryIconWhite from "../../../public/icons/memory-white.svg";

import GearIconGrey from "../../../public/icons/gear-grey.svg";
import SettingsIconGrey from "../../../public/icons/settings-grey.svg";
import MemoryIconGrey from "../../../public/icons/memory-grey.svg";

import { Layout, Theme } from "../../utils/enums";
import { useAppLayout } from "../../utils/layout";

enum ActiveButton {
  options,
  settings,
  memory,
  none,
}

type ButtonProps = {
  active: boolean;
  lightImage: string;
  darkImage: string;
  layout: Layout;
};

type MainToolsPanelProps = {
  id: string;
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
  background: ${(props) => props.theme.colors.mainColor};
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
    props.active ? color_ui_primary : "transparent"};
  background-position: center;
  outline: 0;
  border: none;

  ${({ layout, lightImage }) =>
    layout === Layout.Default &&
    css`
      &:hover {
        background: url(${lightImage}) no-repeat;
        background-position: center;
        background-color: ${dim_ui_primary};
      }
    `}
`;

export const MainToolsPanel = ({
  id,
  showLayerOptions = true,
  showComparisonSettings = true,
  onChange = () => ({}),
}: MainToolsPanelProps) => {
  const layout = useAppLayout();
  const [activeButton, setActiveButton] = useState<ActiveButton>(
    ActiveButton.none
  );

  const handleButtonClick = (newActiveButton: ActiveButton) => {
    if (newActiveButton === activeButton) {
      setActiveButton(ActiveButton.none);
    } else {
      setActiveButton(newActiveButton);
    }
    onChange(newActiveButton);
  };

  return (
    <Container id={id}>
      {showLayerOptions && (
        <Button
          layout={layout}
          active={activeButton === ActiveButton.options}
          darkImage={GearIconGrey}
          lightImage={GearIconWhite}
          onClick={() => handleButtonClick(ActiveButton.options)}
        />
      )}
      {showComparisonSettings && (
        <Button
          layout={layout}
          active={activeButton === ActiveButton.settings}
          darkImage={SettingsIconGrey}
          lightImage={SettingsIconWhite}
          onClick={() => handleButtonClick(ActiveButton.settings)}
        />
      )}
      <Button
        layout={layout}
        active={activeButton === ActiveButton.memory}
        darkImage={MemoryIconGrey}
        lightImage={MemoryIconWhite}
        onClick={() => handleButtonClick(ActiveButton.memory)}
      />
    </Container>
  );
};
