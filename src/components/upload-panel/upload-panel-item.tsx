import styled from "styled-components";
import { ActionButton } from "../action-button/action-button";
import { ActionButtonVariant, type LayoutProps } from "../../types";
import { useAppLayout } from "../../utils/hooks/layout";

const Container = styled.div<LayoutProps & { noPadding?: boolean }>`
  width: 295px;
  padding: ${({ noPadding }) => noPadding ? "0px" : "16px"};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.mainColor};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: space-between;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 44px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const ButtonsContainer = styled.div<{ justify: string }>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.justify};
  margin-top: 44px;
`;

interface UploadPanelItemProps {
  title?: string;
  children: React.ReactNode;
  noPadding?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export const UploadPanelItem = ({
  title,
  children,
  noPadding,
  onCancel,
  onConfirm,
}: UploadPanelItemProps) => {
  const layout = useAppLayout();

  return (
    <Container $layout={layout} noPadding={noPadding}>
      <Content>
        {title && <Title>{title}</Title>}
        {children}
        {(onConfirm ?? onCancel) && <ButtonsContainer justify={onConfirm ? "space-between" : "center"}>
          {onCancel && <ActionButton
            variant={ActionButtonVariant.secondary}
            onClick={onCancel}
          >
            Cancel
          </ActionButton>}
          {onConfirm && <ActionButton onClick={onConfirm}>Next</ActionButton>}
        </ButtonsContainer>}
      </Content>
    </Container>
  );
};
