import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  color_brand_primary,
  color_canvas_inverted,
} from "../../constants/colors";

const Container = styled.div`
  position: absolute;
  top: 70px;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  background: ${color_brand_primary};
  flex-flow: column;
  width: 320px;
  height: auto;
  max-height: 75%;
  z-index: 16;
  word-break: break-word;
  border-radius: 8px;
`;

const ContentWrapper = styled.div`
  overflow-y: auto;
  padding: 0 15px;
  margin-bottom: 15px;
  width: 90%;
`;

const AttributesTable = styled.table`
  width: 100%;
`;

const ColumnHeader = styled.th`
  width: 40%;
  text-align: left;
  font-weight: 500;
  font-size: 14px;
  border-right: 3px solid rgba(0, 0, 0, 0.05);
  padding: 5px 0;
`;

const DataCell = styled.td`
  width: 60%;
  font-weight: 400;
  font-size: 14px;
  padding: 5px 0;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: ${(props) => (props.title ? "space-between" : "flex-end")};
  align-items: center;
  min-height: 40px;
  width: 100%;
`;

const CloseButton = styled.button`
  height: 30px;
  border: none;
  cursor: pointer;
  background: transparent;
  color: ${color_canvas_inverted};
  outline: none;
  font-size: 19px;
  margin-right: 5px;
`;

const Title = styled.h3`
  margin-left: 15px;
  color: ${color_canvas_inverted};
`;

const NO_DATA = "No Data";

type AttributesPanelProps = {
  title: string;
  attributesObject: any;
  handleClosePanel: () => void;
  children?: any;
};

/**
 * TODO: Add types to component
 */
export const AttributesPanel = ({
  title,
  attributesObject,
  handleClosePanel,
  children = null,
}: AttributesPanelProps) => {
  const prepareTable = () => {
    const tableColumns: JSX.Element[] = [];

    for (const key in attributesObject) {
      const value = formatValue(attributesObject[key]);
      const column = createTableColumn(key, value);
      tableColumns.push(column);
    }

    return (
      <AttributesTable>
        <tbody>{tableColumns}</tbody>
      </AttributesTable>
    );
  };

  const createTableColumn = (key, value) => {
    return (
      <tr key={key}>
        <ColumnHeader>{key}</ColumnHeader>
        <DataCell>{value}</DataCell>
      </tr>
    );
  };

  const formatValue = (value) => {
    return (
      String(value)
        .replace(/[{}']+/g, "")
        .trim() || NO_DATA
    );
  };

  const renderHeader = () => {
    return (
      <HeaderWrapper title={title}>
        {title && <Title>{title}</Title>}
        <CloseButton onClick={handleClosePanel}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
      </HeaderWrapper>
    );
  };

  return (
    <Container>
      {renderHeader()}
      <ContentWrapper>
        {attributesObject && prepareTable()}
        {children}
      </ContentWrapper>
    </Container>
  );
};
