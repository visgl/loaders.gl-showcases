import { ReactEventHandler, ReactNode } from "react";
import styled, { DefaultTheme, useTheme } from "styled-components";
import { color_accent_primary } from "../../constants/colors";

const Container = styled.div<{ theme: DefaultTheme }>`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  height: 44px;
  padding: 0 16px;
  display: flex;
  color: ${({ theme }) => theme.colors.fontColor};
  background-color: ${({ theme }) => theme.colors.mainColor};
  justify-content: space-between;
  align-items: center;
`;
const ConfirmationButtons = styled.div`
  display: flex;
  gap: 16px;
`;

const ConfirmationButton = styled.div<{ color?: string }>`
  color: ${({ color }) => color || "inherit"};
  cursor: pointer;
`;

export const DeleteConfirmation = ({
  onKeepHandler,
  onDeleteHandler,
  children,
}: {
  onKeepHandler: ReactEventHandler;
  onDeleteHandler: ReactEventHandler;
  children: ReactNode;
}) => {
  const theme = useTheme();
  return (
    <Container theme={theme}>
      {children}
      <ConfirmationButtons>
        <ConfirmationButton onClick={onKeepHandler}>
          No, keep
        </ConfirmationButton>
        <ConfirmationButton
          onClick={onDeleteHandler}
          color={color_accent_primary}
        >
          Yes, delete
        </ConfirmationButton>
      </ConfirmationButtons>
    </Container>
  );
};
