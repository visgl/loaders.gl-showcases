import PropTypes from "prop-types";
import styled from "styled-components";
import { LayoutProps } from "../../types";
import {
  color_brand_primary, color_canvas_primary_inverted,
} from "../../constants/colors";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/hooks/layout";
import { PanelContainer, PanelContent, PanelHeader, PanelHorizontalLine, Panels, Title } from "../common";
import { CloseButton } from "../close-button/close-button";

const SemanticValidatorContainer = styled.div<LayoutProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  left: 25%;
  right: 25%;
  bottom: ${getCurrentLayoutProperty({
    desktop: "10px",
    tablet: "10px",
    mobile: "76px",
  })};
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  background: ${color_brand_primary};
  z-index: 17;
  line-height: 135%;
  border-radius: 8px;
  min-height: 38px;
  max-height: 135px;
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  color: #ffffff;
  font-size: 16px;
`;

const TableHeader = styled.th`
  position: sticky;
  top: 0;
  text-align: left;
  font-size: 16px;
  padding: 8px;
  height: 44px;
`;

const NoIssuesItem = styled.h4`
  margin: auto;
  color: ${color_canvas_primary_inverted};
  font-weight: normal;
`;

const TableButton = styled.button`
  display: flex;
  position: absolute;
  top: 6px;
  right: 0;
  height: 44px;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 4px 16px;
  color: #ffffff;
  font-weight: 500px;
  border-radius: 12px;
  border: 1px solid #ffffff;
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

/**
 * TODO: Add types to component
 */
export const SemanticValidator = ({ warnings, clearWarnings, onClose }) => {
  const layout = useAppLayout();

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
              <TableButton onClick={clearWarnings}>Clear</TableButton>
            </TableHeader>
          </Row>
        </thead>
        <tbody>{columns}</tbody>
      </Table>
    );
  };

  return (
    <PanelContainer id="semantic-validator" layout={layout}>
      <PanelHeader panel={Panels.MemoryUsage}>
        <Title left={16}>Validator</Title>
        <CloseButton id="memory-usage-panel-close-button" onClick={onClose} />
      </PanelHeader>
      <PanelHorizontalLine top={10} />
      <PanelContent>
        {warnings && Boolean(warnings.length) ? (
          renderWarnings(warnings)
        ) : (
          <NoIssuesItem>{NO_ISSUES}</NoIssuesItem>
        )}
      </PanelContent>
    </PanelContainer>
  );
};

SemanticValidator.propTypes = propTypes;
SemanticValidator.defaultProps = defaultProps;
