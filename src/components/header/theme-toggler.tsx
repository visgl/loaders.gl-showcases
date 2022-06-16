import styled from "styled-components";
import { color_brand_quaternary } from "../../constants/colors";
import { ActiveProps } from "./common";

import DarkModeLightIcon from "../../../public/icons/dark-mode-light.svg";
import DarkModeDarkIcon from "../../../public/icons/dark-mode-dark.svg";

import LightModeLightIcon from "../../../public/icons/light-mode-light.svg";
import LightModeDarkIcon from "../../../public/icons/light-mode-dark.svg";
import { Theme } from "../../utils/enums";

const ThemeToggleWrapper = styled.div`
  border: 1px solid ${color_brand_quaternary};
  border-radius: 12px;

  background: ${(props) => props.theme.colors.mainHiglightColor};
  margin-left: 24px;
  padding: 1px;

  display: flex;
  justify-content: space-between;

  &:hover {
    background: ${({ theme }) => theme.colors.mainDimColor};
  }
`;

const ThemeToggleImage = styled.img<ActiveProps>`
  display: block;
  width: 13px;
  height: 14px;

  padding: 9px;
  border-radius: 12px;

  cursor: pointer;
  background: ${(props) =>
    props.active ? props.theme.colors.mainColor : "transparent"};

  &:hover {
    background: #60c2a4;
  }
`;

export const ThemeToggler = ({theme, setTheme}: {theme: Theme; setTheme: (theme: Theme) => void}) => {
  const darkIcon = theme === Theme.Dark ? DarkModeDarkIcon : LightModeDarkIcon;
  const lightIcon =
    theme === Theme.Light ? LightModeLightIcon : DarkModeLightIcon;

  const toggleTheme = () => {
    if (theme === Theme.Dark) {
      return setTheme(Theme.Light);
    }
    return setTheme(Theme.Dark);
  };

  return (
    <ThemeToggleWrapper
      id="toggle-button-default"
      onClick={() => toggleTheme()}
    >
      <ThemeToggleImage
        id="toggle-dark-default"
        active={theme === Theme.Dark ? 1 : 0}
        src={darkIcon}
      />
      <ThemeToggleImage
        id="toggle-light-default"
        active={theme === Theme.Light ? 1 : 0}
        src={lightIcon}
      />
    </ThemeToggleWrapper>
  );
};
