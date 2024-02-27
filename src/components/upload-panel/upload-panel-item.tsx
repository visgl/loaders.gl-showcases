import styled from "styled-components";
import { ActionButton } from "../action-button/action-button";
import { ActionButtonVariant, LayoutProps } from "../../types";
import WarningIcon from "../../../public/icons/warning.svg";
import { useAppLayout } from "../../utils/hooks/layout";

const Container = styled.div<LayoutProps>`
  width: 335px;
  height: 329px;
  padding: 16px;
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
  color: ${({ theme }) => theme.colors.fontColor};
`;

const ButtonsContainer = styled.div<{ justify: string }>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.justify};
`;

type UploadPanelItemProps = {
  title?: string;
  children: React.ReactNode;
  onCancel: () => void;
  onConfirm?: () => void;
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
        <ButtonsContainer justify={onConfirm ? "space-between" : "center"}>
          <ActionButton
            variant={ActionButtonVariant.secondary}
            onClick={onCancel}
          >
            Cancel
          </ActionButton>
          {onConfirm && <ActionButton onClick={onConfirm}>Next</ActionButton>}
        </ButtonsContainer>
      </Content>
    </Container>
  );
};
