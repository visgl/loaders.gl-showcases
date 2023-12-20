import styled, { useTheme } from "styled-components";
import { ActionButton } from "../action-button/action-button";
import { ActionButtonVariant } from "../../types";
import CloseIcon from "../../../public/icons/close.svg";
import { color_brand_primary } from "../../constants/colors";

const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${color_brand_primary}80;
  z-index: 103;
`;

const WrapperContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  visibility: hidden;
  z-index: 104;
`;

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.mainHelpPanelColor};
  visibility: visible;
  z-index: 105;
`;

const IconContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  top: 13px;
  right: 14px;
  width: 44px;
  height: 44px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  height: 100%;
  width: 100%;
  margin: 32px 32px 0 32px;
  row-gap: 16px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 45px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 32px;
  column-gap: 18px;
   {
    > * {
      width: 180px;
    }
  }
`;

type LogoutPanelProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
  okButtonText?: string;
  cancelButtonText?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const CloseCrossButton = styled(CloseIcon)`
  cursor: pointer;
  &:hover {
    fill: ${({ theme }) => theme.colors.mainDimColorInverted};
  }
`;

export const ModalDialog = ({
  title,
  children,
  cancelButtonText = "Cancel",
  okButtonText = "Ok",
  onCancel,
  onConfirm,
}: LogoutPanelProps) => {
  const theme = useTheme();

  return (
    <>
      <Overlay />
      <WrapperContainer>
        <Container data-testid="modal-dialog-content">
          <IconContainer>
            <CloseCrossButton
              fill={theme.colors.fontColor}
              onClick={onCancel}
            />
          </IconContainer>
          <ContentContainer>
            <Title>{title}</Title>
            {children}
          </ContentContainer>
          <ButtonsContainer>
            <ActionButton
              variant={ActionButtonVariant.secondary}
              onClick={onCancel}
            >
              {cancelButtonText}
            </ActionButton>
            <ActionButton onClick={onConfirm}>{okButtonText}</ActionButton>
          </ButtonsContainer>
        </Container>
      </WrapperContainer>
    </>
  );
};
