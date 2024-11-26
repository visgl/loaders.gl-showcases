import styled from "styled-components";
import { type Theme } from "../../utils/enums";

export interface MenuProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  pathname: string;
  githubIcon: string;
  showHelp?: boolean;
  onHelpClick: () => void;
}

export interface CompareButtonProps {
  $open: boolean;
  $active: boolean;
}

export interface ActiveProps {
  active: number;
}

export const GithubImage = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 5px;
  border: 1px solid ${(props) => props.theme.colors.mainColor};
  border-radius: 12px;
`;
