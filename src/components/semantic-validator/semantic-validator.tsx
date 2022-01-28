import PropTypes from "prop-types";
import styled from "styled-components";

const SemanticValidatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  left: 25%;
  right: 25%;
  bottom: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  background: #0e111a;
  z-index: 17;
  line-height: 135%;
  border-radius: 8px;
  min-height: 38px;
  max-height: 135px;
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
`;

const TableHeader = styled.th`
  position: sticky;
  top: 0;
  text-align: left;
  background: #0e111a;
  padding: 8px;
  height: 22px;
`;

const NoIssuesItem = styled.h4`
  margin: auto;
  color: white;
  font-weight: normal;
`;

const TableButton = styled.button`
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  width: 90px;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 4px 16px;
  margin: 0 10px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500px;
  border-radius: 4px;
  margin: 8px;
  cursor: pointer;
`;

const Row = styled.tr`
  color: "rgba(255, 255, 255, .3)";
  margin: "8px 0";
`;

const NO_ISSUES = "No Issues";

const WARNING_TYPES = {
  lod: "LOD metric",
  parentLod: "LOD metric",
  boundingVolume: "Bounding Volume",
  geometryVsTextures: "Geometry vs Textures",
};

const WARNING_TYPE = "Type";
const WARNING = "Warning";
const COLUMN_NUMBER = "№";

const propTypes = {
  warnings: PropTypes.arrayOf(PropTypes.object),
};

const defaultProps = {
  warnings: [],
};

export const SemanticValidator = ({ warnings, clearWarnings }) => {
  const renderColumns = (warnings) =>
    warnings.map((warning, index) => (
      <tr key={`${warning.title}-${index}`}>
        <td style={{ padding: "0 8px 0 8px", textAlign: "center" }}>
          {index + 1}
        </td>
        <td style={{ padding: "0 8px 0 8px" }}>
          {WARNING_TYPES[warning.type]}
        </td>
        <td style={{ color: "rgba(249, 80, 80, .6)", padding: "0 8px 0 8px" }}>
          {warning.title}
        </td>
      </tr>
    ));

  const renderWarnings = (warnings) => {
    const columns = renderColumns(warnings);

    return (
      <Table>
        <thead>
          <Row>
            <TableHeader>{COLUMN_NUMBER}</TableHeader>
            <TableHeader>{WARNING_TYPE}</TableHeader>
            <TableHeader>
              {WARNING}
              <TableButton onClick={clearWarnings}>Clear All</TableButton>
            </TableHeader>
          </Row>
        </thead>
        <tbody>{columns}</tbody>
      </Table>
    );
  };

  return (
    <SemanticValidatorContainer>
      {warnings && Boolean(warnings.length) ? (
        renderWarnings(warnings)
      ) : (
        <NoIssuesItem>{NO_ISSUES}</NoIssuesItem>
      )}
    </SemanticValidatorContainer>
  );
};

SemanticValidator.propTypes = propTypes;
SemanticValidator.defaultProps = defaultProps;
