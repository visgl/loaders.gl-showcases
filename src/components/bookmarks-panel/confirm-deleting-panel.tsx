import styled from "styled-components";
import { ActionButton } from "../action-button/action-button";
import { LayoutProps } from "../comparison/common";
import { ActionButtonVariant } from "../../types";
import { useAppLayout } from "../../utils/hooks/layout";

const Container = styled.div<LayoutProps>`
  position: absolute;
  bottom: 100px;
  right: calc(50% - 159px);
  width: 318px;
  height: 176px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.mainColor};
`;

const Content = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
  text-align: center;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 28px;
`;

type UploadPanelItemProps = {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ConfirmDeletingPanel = ({
  title,
  onCancel,
  onConfirm,
}: UploadPanelItemProps) => {
  const layout = useAppLayout();

  return (
    <Container layout={layout}>
      <Content>
        <Title>{title}</Title>
        <ButtonsContainer>
          <ActionButton
            variant={ActionButtonVariant.secondary}
            onClick={onCancel}
          >
            No, Keep
          </ActionButton>
          <ActionButton onClick={onConfirm}>Yes, Delete</ActionButton>
        </ButtonsContainer>
      </Content>
    </Container>
  );
};
