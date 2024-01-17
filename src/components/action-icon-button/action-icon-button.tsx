import React from "react";
import styled, {
  StyledComponent,
  DefaultTheme,
  useTheme,
} from "styled-components";
import { ButtonSize } from "../../types";

import { color_brand_tertiary } from "../../constants/colors";

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
      color: ${({ theme, grayed }) =>
        grayed
          ? theme.colors.actionIconButtonTextDisabledColorHover
          : color_brand_tertiary};
    }
  }
`;

const ButtonText = styled.div<{ grayed?: boolean }>`
  margin-left: 16px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme, grayed }) =>
    grayed
      ? theme.colors.actionIconButtonTextDisabledColor
      : color_brand_tertiary};
`;

const IconContainer = styled.div<{ buttonSize: number; grayed?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  width: ${(props) => (props.buttonSize === ButtonSize.Big ? "40px" : "24px")};
  height: ${(props) => (props.buttonSize === ButtonSize.Big ? "40px" : "24px")};

  background: ${({ theme, grayed }) =>
    grayed
      ? theme.colors.actionIconButtonDisabledBG
      : `${color_brand_tertiary}66`};
`;

type ActionIconButtonProps = {
  children?: React.ReactNode;
  Icon: StyledComponent<any, DefaultTheme, object, string | number | symbol>;
  size: ButtonSize;
  style?: "active" | "disabled";
  onClick?: () => void;
};

export const ActionIconButton = ({
  Icon,
  style,
  size,
  children,
  onClick,
}: ActionIconButtonProps) => {
  const grayed = style === "disabled";
  const theme = useTheme();

  return (
    <Button
      onClick={onClick}
      grayed={grayed}
      data-testid={"action-icon-button"}
    >
      <IconContainer buttonSize={size} grayed={grayed}>
        <Icon
          fill={
            grayed
              ? theme.colors.actionIconButtonDisabledColor
              : color_brand_tertiary
          }
        />
      </IconContainer>
      <ButtonText grayed={grayed}>{children}</ButtonText>
    </Button>
  );
};
