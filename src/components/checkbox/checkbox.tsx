import styled from "styled-components";

const CheckboxContainer = styled.div<{ disabled?: boolean }>`
  display: inline-block;
  vertical-align: middle;
  cursor: ${(props) => (props.disabled ? "auto" : "pointer")}};
  position: relative;
`;
const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;
const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;
const StyledCheckbox = styled.div<{ checked: boolean; disabled: boolean }>`
  display: inline-block;
  width: 22px;
  height: 22px;
  background: ${(props) => (props.checked ? "#4F52CC" : "#0E111A")};
  border: ${(props) =>
    props.disabled ? "1px solid rgba(255,255,255, .6)" : "1px solid #4F52CC"};
  border-radius: 4px;
  transition: all 150ms;

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 2px #4f52cc;
  }

  ${Icon} {
    visibility: ${(props) => (props.checked ? "visible" : "hidden")};
  }
`;

/**
 * TODO: Add types to component
 */
export const Checkbox = ({ id, checked, disabled = false, onChange }) => (
  <CheckboxContainer disabled={disabled}>
    <HiddenCheckbox checked={checked} onChange={onChange} />
    <StyledCheckbox disabled={disabled} checked={checked}>
      <Icon id={`${id}-icon`} viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </Icon>
    </StyledCheckbox>
  </CheckboxContainer>
);
