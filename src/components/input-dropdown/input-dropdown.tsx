import { type ChangeEvent, type FC, useId } from "react";
import styled, { useTheme } from "styled-components";
import { ExpandIcon } from "../expand-icon/expand-icon";
import { CollapseDirection, ExpandState } from "../../types";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SelectDiv = styled.div`
  position: relative;
  width: 100%;
  height: 46px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.mainHiglightColor};
  &:hover {
    background: ${({ theme }) => theme.colors.mainDimColor};
  }
  magrin: 0;
`;

const Input = styled.select`
  width: 100%;
  padding: 13px 30px 13px 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.secondaryFontColor};
  border: 1px solid ${({ theme }) => theme.colors.mainHiglightColor};

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.mainDimColor};
    cursor: pointer;
  }
  &:focus {
    color: ${({ theme }) => theme.colors.fontColor};
    outline: none;
  }
  appearance: none;
  background: transparent;
  magrin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SelectOption = styled.option`
  height: 20px;
  background: ${({ theme }) => theme.colors.mainHiglightColor};
  &:hover {
    background-color: ${({ theme }) => theme.colors.mainDimColor};
    box-shadow: 0 0 10px 100px green inset;
  }
  &:checked {
    background-color: ${({ theme }) => theme.colors.mainDimColor};
    box-shadow: 0 0 10px 100px green inset;
  }
  box-shadow: 0 0 10px 100px green inset;
`;

const ExpandIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  right: 12px;
`;

const Label = styled.label`
  display: block;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

interface InputDropdownProps {
  label?: string;
  options: string[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export const InputDropdown: FC<InputDropdownProps> = ({
  label,
  options,
  onChange,
  ...rest
}) => {
  const inputId = useId();
  const theme = useTheme();
  return (
    <InputWrapper>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <SelectDiv>
        <ExpandIconWrapper>
          <ExpandIcon
            expandState={ExpandState.expanded}
            collapseDirection={CollapseDirection.bottom}
            fillExpanded={theme.colors.dropdownArrow}
            onClick={() => {}}
          />
        </ExpandIconWrapper>
        <Input
          disabled={options.length <= 1}
          id={inputId}
          onChange={onChange}
          {...rest}
        >
          {options.map((item) => (
            <SelectOption value={item} key={item}>
              {item}
            </SelectOption>
          ))}
        </Input>
      </SelectDiv>
    </InputWrapper>
  );
};
