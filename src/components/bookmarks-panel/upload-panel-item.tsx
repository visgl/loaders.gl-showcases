import styled from "styled-components";
import { useAppLayout } from "../../utils/layout";
import { ActionButton } from "../action-button/action-button";
import { LayoutProps } from "../comparison/common";
import { ActionButtonVariant } from "../../types";
import WarningIcon from "../../../public/icons/warning.svg";

const Container = styled.div<LayoutProps>`
  width: 335px;
  height: 329px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.mainColor};
  box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
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
  color: ${({ theme }) => theme.colors.fontColor};
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

type UploadPanelItemProps = {
  title?: string;
  children: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
};

export const UploadPanelItem = ({
  title,
  children,
  onCancel,
  onConfirm,
}: UploadPanelItemProps) => {
  const layout = useAppLayout();

  return (
    <Container layout={layout}>
      <Content>
        <Title>{title ? title : <WarningIcon />}</Title>
        {children}
        <ButtonsContainer>
          <ActionButton
            variant={ActionButtonVariant.secondary}
            onClick={onCancel}
          >
            Cancel
          </ActionButton>
          <ActionButton onClick={onConfirm}>Upload</ActionButton>
        </ButtonsContainer>
      </Content>
    </Container>
  );
};
