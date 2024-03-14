import styled from "styled-components";
import { Theme } from "../../utils/enums";

export type MenuProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  pathname: string;
  githubIcon: string;
  showHelp?: boolean;
  onHelpClick: () => void;
};

export type CompareButtonProps = {
  $open: boolean;
  $active: boolean;
};

export type ActiveProps = {
  active: number;
};

export const GithubImage = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 5px;
  border: 1px solid ${(props) => props.theme.colors.mainColor};
  border-radius: 12px;
`;
