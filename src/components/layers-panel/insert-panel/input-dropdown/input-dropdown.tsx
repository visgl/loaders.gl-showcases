import { ChangeEvent, useMemo } from "react";
import styled from "styled-components";
import { color_accent_primary } from "../../../../constants/colors";
import ChevronIcon from "../../../../../public/icons/chevron.png";

type InputProps = {
  id?: string;
  name?: string;
  label?: string;
  value: string[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

type LabelProps = {
  htmlFor: string;
};

type InputErrorProps = {
  error?: string;
};

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SelectDiv = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 46px;
  border-radius: 8px;
  outline: none;
  background: ${({ theme }) => theme.colors.mainHiglightColor};
  &:hover {
    background: ${({ theme }) => theme.colors.mainDimColor};
  }
  magrin: 0;
`;

const Input = styled.select<{ arrowUrl: string }>`
  // Width is calculated as 100% - horizontal padding.
  position: absolute;
  width: 100%;
  padding: 13px 12px 13px 16px;
  border-radius: 8px;
  outline: none;
  color: ${({ theme }) => theme.colors.secondaryFontColor};
  border: 1px solid ${({ theme }) => theme.colors.mainHiglightColor};

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.mainDimColor};
  }
  &:focus {
    color: ${({ theme }) => theme.colors.fontColor};

    // border-color: gray;
    // outline:none;
  }
  appearance: none !important;
  background: transparent !important;
  background-image: url(${(props) => props.arrowUrl}) !important;
  background-repeat: no-repeat !important;
  background-position-x: calc(100% - 12px) !important;
  background-position-y: center !important;
  magrin: 0;
`;

const SelectOption = styled.option`
  height: 20px;
  background: ${({ theme }) => theme.colors.mainHiglightColor};
  &:hover {
    background-color: ${({ theme }) => theme.colors.mainDimColor} !important;
    box-shadow: 0 0 10px 100px green inset;
  }
  &:checked {
    background-color: ${({ theme }) => theme.colors.mainDimColor} !important;
    box-shadow: 0 0 10px 100px green inset;
  }
  box-shadow: 0 0 10px 100px green inset;
`;

const Label = styled.label<LabelProps>`
  display: block;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

export const InputDropdown = ({
  id,
  label,
  value,
  onChange,
  name,
  ...rest
}: InputProps) => {
  const inputId = useMemo(() => id || name || "select-option", [id, name]);
  return (
    <InputWrapper>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <SelectDiv>
        <Input
          disabled={value.length <= 1}
          id={inputId}
          arrowUrl={ChevronIcon}
          name={name}
          onChange={onChange}
          {...rest}
        >
          {value.map((item) => (
            <SelectOption value={item}>{item}</SelectOption>
          ))}
        </Input>
      </SelectDiv>
    </InputWrapper>
  );
};
