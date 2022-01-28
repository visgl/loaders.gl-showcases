import PropTypes from "prop-types";
import styled from "styled-components";

const NO_DATA = "No Data";

const propTypes = {
  data: PropTypes.object,
};

const defaultProps = {
  data: {},
};

const Tooltip = styled.div`
  background: "#0E111A",
  margin: "-10px",
  color: "rgba(255,255,255,.6)",
  font-size: "14px",
  padding: "10px",
`;

const TableHeader = styled.th`
  text-align: 'left',
  font-size: '14px',
  color: 'white',
  font-weight: '400'
`;

export const AttributesTooltip = ({ data }) => {
  const prepareRows = () => {
    const rows: JSX.Element[] = [];

    for (const key in data) {
      const row = (
        <tr key={key}>
          <TableHeader>{key}</TableHeader>
          <td>{formatTooltipValue(data[key])}</td>
        </tr>
      );

      rows.push(row);
    }
    return rows;
  };

  const formatTooltipValue = (value: string): string => {
    return (
      value
        .toString()
        .replace(/[{}']+/g, "")
        .trim() || NO_DATA
    );
  };

  const rows = prepareRows();

  return rows.length ? (
    <Tooltip>
      <table>
        <tbody>{rows}</tbody>
      </table>
    </Tooltip>
  ) : null;
};

AttributesTooltip.propTypes = propTypes;
AttributesTooltip.defaultProps = defaultProps;
