import styled, { useTheme } from "styled-components";
import { ActionButton } from "../action-button/action-button";
import { ActionButtonVariant, LayoutProps } from "../../types";
import CloseIcon from "../../../public/icons/close.svg";
import { Popover } from "react-tiny-popover";

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 103;
  background: #00000099;
  `;

const Container = styled.div<{ width: number, height: number }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.mainColor};
  width: ${({ width }) => (`${width}px`)};
  height: ${({ height }) => (`${height}px`)};
  left: calc(50% - ${({ width }) => (`${width * 0.5}px`)} );
  top: calc(50% - ${({ height }) => (`${height * 0.5}px`)} );
  z-index: 104;
  `;

const IconContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  width: 44px;
  height: 44px;
  top: 13px;
  right: 14px;
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
  justify-content: center; //space-between;
  margin: 32px;
  column-gap: 18px;
  { > *
    {
      width: 180px;
    }
  }
`;

type LogoutPanelProps = {
  title: string;
  content: (() => JSX.Element) | JSX.Element;
  width: number,
  height: number,
  onCancel: () => void;
  onConfirm: () => void;
};

const CloseCrossButton = styled(CloseIcon)`
  &:hover {
    fill: ${({ theme }) => theme.colors.mainDimColorInverted};
  }
  `;

export const ModalDialog = ({
  title,
  content,
  width,
  height,
  onCancel,
  onConfirm,
}: LogoutPanelProps) => {
  const theme = useTheme();

  const renderPopoverContent = (): JSX.Element => {
    return (
      <>
        <Overlay />
        <Container width={width} height={height}>
          <IconContainer>
            <CloseCrossButton fill={theme.colors.fontColor} onClick={onCancel} />
          </IconContainer>
          <ContentContainer>
            <Title>{title}</Title>
            {typeof content === 'function' ? content() : content}
          </ContentContainer>
          <ButtonsContainer>
            <ActionButton
              variant={ActionButtonVariant.secondary}
              onClick={onCancel}
            >
              Cancel
            </ActionButton>
            <ActionButton onClick={onConfirm}>Log out</ActionButton>
          </ButtonsContainer>
        </Container>
      </>
    );
  }

  const getPopoverStyle = () => {
    return {
      zIndex: "104",
      width: "100%",
      height: "100%"
    };
  };

  return (
    <Popover
      isOpen={true}
      reposition={false}
      content={renderPopoverContent}
      containerStyle={getPopoverStyle()}
    >
      <></>
    </Popover>
  );
};
