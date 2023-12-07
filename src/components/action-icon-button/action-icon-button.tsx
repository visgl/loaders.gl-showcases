import React, { useMemo } from "react";
import styled from "styled-components";
import { ButtonSize } from "../../types";
import { StyledComponent, DefaultTheme } from "styled-components";

import {
  color_brand_tertiary,
} from "../../constants/colors";

const Button = styled.div<{ grayed?: boolean }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  cursor: pointer;

  &:hover {
    > :first-child {
      background: ${color_brand_tertiary}33;

      > * {
        fill: ${color_brand_tertiary};
      }
    }

    > :nth-child(2) {
      color: ${({ theme, grayed }) => (
        grayed
          ? theme.colors.actionIconButtonTextDisabledColorHover
          : color_brand_tertiary
      )};
    }
  }
`;

const ButtonText = styled.div<{ grayed?: boolean }>`
  position: relative;
  margin-left: 16px;
  color: ${({ theme, grayed }) => (
    grayed
      ? theme.colors.actionIconButtonTextDisabledColor
      : color_brand_tertiary
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
      : `${color_brand_tertiary}66`
  )};

  border-radius: 4px;
  align-items: center;
  justify-content: center;
  `;

type ActionIconButtonProps = {
  children?: React.ReactNode;
  Icon: StyledComponent<any, DefaultTheme, object, string | number | symbol>;
  size: ButtonSize;
  style?: "active" | "disabled";
  onClick?: () => void;
};

export const ActionIconButton = ({ Icon, style, size, children, onClick }: ActionIconButtonProps) => {

  const grayed = useMemo(() => style === "disabled", [style]);

  const StyledIcon = styled(Icon) <{ grayed?: boolean }>`
    position: absolute;
    fill: ${({ theme, grayed }) => (
      grayed
        ? theme.colors.actionIconButtonDisabledColor
        : color_brand_tertiary
    )};
    `;

  return (
    <Button onClick={onClick} grayed={grayed}>
      <IconContainer buttonSize={size} grayed={grayed}>
        <StyledIcon grayed={grayed} />
      </IconContainer>
      <ButtonText grayed={grayed}>{children}</ButtonText>
    </Button>
  );
};

