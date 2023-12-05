import React from "react";
import styled from "styled-components";
import { ButtonSize } from "../../types";
import { StyledComponent, DefaultTheme } from "styled-components";

type ActionIconButtonProps = {
  children?: React.ReactNode;
  icon: StyledComponent<any, DefaultTheme, object, string | number | symbol>;
  buttonSize: ButtonSize;
  style?: "active" | "disabled";
  onClick?: () => void;
};

/*
  https://developer.mozilla.org/en-US/docs/Web/CSS/opacity

  opacity applies to the element as a whole, including its contents, even though the value is not inherited by child elements.
  Thus, the element and its children all have the same opacity relative to the element's background,
  even if they have different opacities relative to one another.

  To change the opacity of a background only, use the background property with a color value that allows for an alpha channel. F
*/

const Button = styled.div<{ grayed?: boolean }>`
  display: flex;
  cursor: pointer;
  justify-content: flex-start;
  align-items: center;
  margin-right: 16px;

  &:hover {
    > * {
      &:first-child {
        background: ${({ theme, grayed }) => (
    grayed
      ? theme.colors.actionIconButtonDisabledBGHover
      : theme.colors.actionIconButtonActiveBGHover
  )};
      }
    }
  }
`;

const ButtonText = styled.div<{ grayed?: boolean }>`
  color: ${({ theme, grayed }) => (
    grayed
      ? theme.colors.actionIconButtonTextDisabledColor
      : theme.colors.actionIconButtonTextActiveColor
  )};
  `;

const IconContainer = styled.div<{ buttonSize: number, grayed?: boolean }>`
  display: flex;
  position: relative;
  width: ${(props) => (props.buttonSize === ButtonSize.Big ? "40px" : "24px")};
  height: ${(props) => (props.buttonSize === ButtonSize.Big ? "40px" : "24px")};
  
  background: ${({ theme, grayed }) => (
    grayed
      ? theme.colors.actionIconButtonDisabledBG
      : theme.colors.actionIconButtonActiveBG
  )};

  border-radius: 4px;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  `;

export const ActionIconButton = (props: ActionIconButtonProps) => {

  const grayed = props.style === "disabled";
  const StyledIcon = styled(props.icon) <{ grayed?: boolean }>`
    position: absolute;
    fill: ${({ theme, grayed }) => (
      grayed
        ? theme.colors.actionIconButtonDisabledColor
        : theme.colors.actionIconButtonActiveColor
    )};
    `;

  return (
    <Button onClick={props.onClick} grayed={grayed}>
      <IconContainer buttonSize={props.buttonSize} grayed={grayed}>
        <props.icon />
        <StyledIcon grayed={grayed} />
      </IconContainer>
      <ButtonText grayed={grayed}>{props.children}</ButtonText>
    </Button>
  );
};

