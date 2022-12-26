import styled from "styled-components";
import { CloseButton } from "../close-button/close-button";
import { Title } from "../common";

const Container = styled.div`
  position: absolute;
  top: 24px;
  left: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.colors.fontColor};
  background: ${({ theme }) => theme.colors.mainCanvasColor};
  width: 359px;
  max-height: 75%;
  z-index: 16;
  border-radius: 8px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: ${(props) => (props.title ? "space-between" : "flex-end")};
  align-items: center;
  width: 100%;
`;

const ContentWrapper = styled.section`
  overflow-y: auto;
  width: 100%;
`;

type TileDetailsPanelProps = {
  title: string;
  handleClosePanel: () => void;
  children?: React.ReactNode;
};

export const TileDetailsPanel = ({
  title,
  handleClosePanel,
  children,
}: TileDetailsPanelProps) => {
  return (
    <Container>
      <HeaderWrapper title={title}>
        {title && (
          <Title left={16} top={12} bottom={12}>
            {title}
          </Title>
        )}
        <CloseButton onClick={handleClosePanel} />
      </HeaderWrapper>
      <ContentWrapper>{children}</ContentWrapper>
    </Container>
  );
};
