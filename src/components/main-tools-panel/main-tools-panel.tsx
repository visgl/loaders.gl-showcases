import { useState } from "react";
import styled, { css } from "styled-components";

import { darkViolet, primaryViolet } from "../../constants/colors";

import GearIconWhite from "../../../public/icons/gear-white.svg";
import SettingsIconWhite from "../../../public/icons/settings-white.svg";
import MemoryIconWhite from "../../../public/icons/memory-white.svg";

import GearIconGrey from "../../../public/icons/gear-grey.svg";
import SettingsIconGrey from "../../../public/icons/settings-grey.svg";
import MemoryIconGrey from "../../../public/icons/memory-grey.svg";

import { ActiveButton, Layout, Theme } from "../../utils/enums";
import { useAppLayout } from "../../utils/layout";

type ButtonProps = {
  active: boolean;
  lightImage: string;
  darkImage: string;
  layout: Layout;
};

type MainToolsPanelProps = {
  id: string;
  active: ActiveButton;
  showOptions?: boolean;
  showSettings?: boolean;
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
    props.active ? primaryViolet : "transparent"};
  background-position: center;
  outline: 0;
  border: none;

  ${({ layout, lightImage }) =>
    layout === Layout.Default &&
    css`
      &:hover {
        background: url(${lightImage}) no-repeat;
        background-position: center;
        background-color: ${darkViolet};
      }
    `}
`;

export const MainToolsPanel = ({
  id,
  active,
  showOptions = true,
  showSettings = true,
  onChange = () => ({}),
}: MainToolsPanelProps) => {
  const layout = useAppLayout();

  return (
    <Container id={id}>
      {showOptions && (
        <Button
          layout={layout}
          active={active === ActiveButton.options}
          darkImage={GearIconGrey}
          lightImage={GearIconWhite}
          onClick={() => onChange(ActiveButton.options)}
        />
      )}
      {showSettings && (
        <Button
          layout={layout}
          active={active === ActiveButton.settings}
          darkImage={SettingsIconGrey}
          lightImage={SettingsIconWhite}
          onClick={() => onChange(ActiveButton.settings)}
        />
      )}
      <Button
        layout={layout}
        active={active === ActiveButton.memory}
        darkImage={MemoryIconGrey}
        lightImage={MemoryIconWhite}
        onClick={() => onChange(ActiveButton.memory)}
      />
    </Container>
  );
};
