import React, { type MouseEventHandler, useMemo } from "react";
import styled from "styled-components";
import {
  color_brand_tertiary,
  color_canvas_primary_inverted,
  dim_brand_tertinary,
} from "../../constants/colors";
import { ActionButtonVariant } from "../../types";

interface ActionButtonProps {
  variant?: ActionButtonVariant;
  onClick?: (event: MouseEventHandler<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  type?: string;
}

interface ButtonProps {
  variant: ActionButtonVariant;
  onClick: (event: MouseEventHandler<HTMLButtonElement>) => void;
}

const Button = styled.button<ButtonProps>`
  padding: 13px 30px;
  outline: none;
  border-radius: 8px;
  cursor: pointer;
  border-width: 1px;
  border-style: solid;
  width: fit-content;
`;

const PrimaryButton = styled(Button)`
  background-color: ${color_brand_tertiary};
  border-color: ${color_brand_tertiary};
  color: ${color_canvas_primary_inverted};

  &:hover {
    background-color: ${dim_brand_tertinary};
    border-color: ${dim_brand_tertinary};
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  border-color: ${({ theme }) => theme.colors.fontColor};
  color: ${({ theme }) => theme.colors.fontColor};

  &:hover {
    color: ${({ theme }) => theme.colors.mainDimColorInverted};
    border-color: ${({ theme }) => theme.colors.mainDimColorInverted};
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border-color: transparent;
  color: ${({ theme }) => theme.colors.fontColor};

  &:hover {
    color: ${({ theme }) => theme.colors.mainDimColorInverted};
  }
`;

export const ActionButton = ({
  variant = ActionButtonVariant.primary,
  onClick,
  children,
  type = "button",
}: ActionButtonProps) => {
  const getButtonComponent = (): any => {
    switch (variant) {
      case ActionButtonVariant.primary:
        return PrimaryButton;
      case ActionButtonVariant.secondary:
        return SecondaryButton;
      case ActionButtonVariant.cancel:
        return CancelButton;
      default:
        return null;
    }
  };

  const ButtonComponent = useMemo(() => getButtonComponent(), [variant]);

  return ButtonComponent ? <ButtonComponent type={type} onClick={onClick}>{children}</ButtonComponent> : null;
};
