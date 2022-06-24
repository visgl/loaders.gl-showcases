import styled, { DefaultTheme } from "styled-components";
import { color_brand_quaternary } from "../../constants/colors";

import DarkModeIcon from "../../../public/icons/dark-mode.svg?svgr";
import LightModeIcon from "../../../public/icons/light-mode.svg?svgr";

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

    & .inactive {
      fill: ${({ theme }) => theme.colors.fontColor};
    }
  }
`;

const Button = styled.div<{ theme: DefaultTheme; active: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background-color: ${({ theme, active }) =>
    active ? theme.colors.mainColor : "transparent"};
  cursor: pointer;
`;

type ActiveProps = { active: boolean };
const IconWrapper = styled.div.attrs<ActiveProps>((props) => ({
  className: !props.active ? "inactive" : "",
}))<ActiveProps>`
  height: 16px;
  fill: ${({ theme, active }) =>
    active ? theme.colors.fontColor : theme.colors.iconInactiveColor};
  }
  dispaly: flex;
  justify-content: center;
  align-items: center;
`;

export const ThemeToggler = ({
  theme,
  setTheme,
}: {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}) => {
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
      <Button active={theme === Theme.Dark} id="toggle-dark-default">
        <IconWrapper active={theme === Theme.Dark}>
          <DarkModeIcon />
        </IconWrapper>
      </Button>
      <Button active={theme === Theme.Light} id="toggle-light-default">
        <IconWrapper active={theme === Theme.Light}>
          <LightModeIcon />
        </IconWrapper>
      </Button>
    </ThemeToggleWrapper>
  );
};
