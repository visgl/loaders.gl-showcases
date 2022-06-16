import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 70px;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-items: center;
  color: #ffffff;
  background: #0e111a;
  flex-flow: column;
  width: 320px;
  height: auto;
  max-height: 75%;
  z-index: 16;
  word-break: break-word;
  border-radius: 8px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: ${(props) => (props.title ? "space-between" : "flex-end")};
  align-items: center;
  min-height: 40px;
  width: 100%;
`;

const Title = styled.h3`
  margin-left: 15px;
  color: white;
`;

const CloseButton = styled.button`
  height: 30px;
  border: none;
  cursor: pointer;
  background: transparent;
  color: white;
  outline: none;
  font-size: 19px;
  margin-right: 5px;
`;

const ContentWrapper = styled.div`
  overflow-y: auto;
  padding: 0 15px;
  margin-bottom: 15px;
  width: 90%;
`;

type TileDetailsPanelProps = {
  title: string;
  handleClosePanel: () => void;
  children?: any;
};

export const TileDetailsPanel = ({
  title,
  handleClosePanel,
  children,
}: TileDetailsPanelProps) => {
  return (
    <Container>
      <HeaderWrapper title={title}>
        {title && <Title>{title}</Title>}
        <CloseButton onClick={handleClosePanel}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
      </HeaderWrapper>
      <ContentWrapper>{children}</ContentWrapper>
    </Container>
  );
};
