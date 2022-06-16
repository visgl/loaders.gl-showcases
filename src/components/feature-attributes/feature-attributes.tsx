import styled from "styled-components";

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

const NO_DATA = "No Data";

type AttributesPanelProps = {
  attributesObject: any;
}
export const FeatureAttributes = ({ attributesObject }: AttributesPanelProps) => {
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

  return <>{attributesObject && prepareTable()}</>;
};
