import styled from "styled-components";
import { CloseButton } from "../close-button/close-button";
import StatisticsIcon from "../../../public/icons/statistics.svg";
import { color_brand_tertiary } from "../../constants/colors";

type TileDetailsPanelProps = {
  title: string;
  handleClosePanel: () => void;
  attributes: any;
};

type RowProps = {
  selectable: boolean;
};

const Container = styled.div`
  position: absolute;
  top: 70px;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-items: center;
  background: ${({ theme }) => theme.colors.mainCanvasColor};
  flex-flow: column;
  width: 360px;
  height: auto;
  max-height: 75%;
  z-index: 16;
  word-break: break-word;
  border-radius: 8px;
  box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: ${(props) => (props.title ? "space-between" : "flex-end")};
  align-items: center;
  width: 100%;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.fontColor};
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  margin: 20px 0px 21px 16px;
`;

const ContentWrapper = styled.div`
  overflow-y: auto;
  padding: 0 16px;
  margin-bottom: 24px;
  width: calc(100% - 32px);

  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  ::-webkit-scrollbar {
    display: none;
  }
`;

const Row = styled.div<RowProps>`
  display: grid;
  grid-template-columns: 1fr 1fr 24px;
  align-items: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.mainAttibuteItemColor};
  padding: 10px 13px;
  margin-bottom: 4px;
  cursor: ${({ selectable }) => (selectable ? "pointer" : "auto")};

  svg {
    fill: ${({ theme }) => theme.colors.mainToolsPanelIconColor};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.mainAttributeHighlightColor};
  }

  &:hover svg {
    fill: ${color_brand_tertiary};
    opacity: 1;
  }
`;

const RowItem = styled.div`
  display: flex;
  max-width: 80%;
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};

  :nth-child(1) {
    font-weight: 500;
  }

  :nth-child(2n) {
    opacity: 0.8;
  }
`;

const SplitLine = styled.div`
  margin: 0px 15px 21px 15px;
  width: calc(100% - 30px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.mainHiglightColor};
`;

const NO_DATA = "No Data";

export const AttributesPanel = ({
  title,
  handleClosePanel,
  attributes,
}: TileDetailsPanelProps) => {
  const prepareRows = () => {
    const rows: JSX.Element[] = [];

    for (const attributeName in attributes) {
      const attributeValue = formatValue(attributes[attributeName]);
      const row = createItemRow(attributeName, attributeValue);
      rows.push(row);
    }

    return rows;
  };

  // TODO handle real statistics
  const createItemRow = (key, value, hasStatistics = true) => {
    return (
      <Row key={key} selectable={hasStatistics}>
        <RowItem>{key}</RowItem>
        <RowItem>{value}</RowItem>
        {hasStatistics && <StatisticsIcon />}
      </Row>
    );
  };

  const formatValue = (value) => {
    return (
      String(value)
        .replace(/[{}']+/g, "")
        .trim() || NO_DATA
    );
  };

  return (
    <Container>
      <HeaderWrapper title={title}>
        {title && <Title>{title}</Title>}
        <CloseButton
          id="comparison-parms-panel-close-button"
          onClick={handleClosePanel}
        />
      </HeaderWrapper>
      <SplitLine />
      <ContentWrapper>{prepareRows()}</ContentWrapper>
    </Container>
  );
};
