import styled from "styled-components";
import PropTypes from "prop-types";

const OptionGroup = styled.div`
  background: #0e111a;
  color: white;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: left;
  marign-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

export const DebugOptionGroup = ({ children }) => {
  return <OptionGroup>{children}</OptionGroup>;
};

DebugOptionGroup.propTypes = propTypes;
DebugOptionGroup.defaultProps = defaultProps;
