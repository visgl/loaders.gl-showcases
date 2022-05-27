import { useState } from "react";
import styled, { css } from "styled-components";

import { darkViolet, primaryViolet } from "../../constants/colors";

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

interface ButtonProps {
  active: boolean;
  lightImage: string;
  darkImage: string;
  layout: Layout;
}

interface MainToolsPanelProps {
  showOptions?: boolean;
  showSettings?: boolean;
  onChange?: (active: ActiveButton) => void;
}

const Container = styled.div`
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
  background-color: ${(props) =>
    props.active ? primaryViolet : "transparent"} !important;
  background: url(${(props) =>
      props.active
        ? props.lightImage
        : props.theme.name === Theme.Light
        ? props.darkImage
        : props.lightImage})
    no-repeat;
  background-position: center;
  outline: 0;
  border: none;

  button:focus {
    outline: 0;
  }

  ${({ layout, lightImage }) =>
    layout === Layout.Default &&
    css`
      &:hover {
        background: url(${lightImage}) no-repeat;
        background-position: center;
        background-color: ${darkViolet} !important;
      }
    `}
`;

export const MainToolsPanel = ({
  showOptions = true,
  showSettings = true,
  onChange = () => ({}),
}: MainToolsPanelProps) => {
  const layout = useAppLayout();
  const [active, setActive] = useState<ActiveButton>(ActiveButton.none);

  const handleButtonClick = (activeButton: ActiveButton) => {
    if (active === activeButton) {
      setActive(ActiveButton.none);
    } else {
      setActive(activeButton);
    }
    onChange(activeButton);
  };

  return (
    <Container>
      {showOptions && (
        <Button
          layout={layout}
          active={active === ActiveButton.options}
          darkImage={GearIconGrey}
          lightImage={GearIconWhite}
          onClick={() => handleButtonClick(ActiveButton.options)}
        />
      )}
      {showSettings && (
        <Button
          layout={layout}
          active={active === ActiveButton.settings}
          darkImage={SettingsIconGrey}
          lightImage={SettingsIconWhite}
          onClick={() => handleButtonClick(ActiveButton.settings)}
        />
      )}
      <Button
        layout={layout}
        active={active === ActiveButton.memory}
        darkImage={MemoryIconGrey}
        lightImage={MemoryIconWhite}
        onClick={() => handleButtonClick(ActiveButton.memory)}
      />
    </Container>
  );
};
