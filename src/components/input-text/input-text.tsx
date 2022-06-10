import { ChangeEvent, useState } from "react";
import styled from "styled-components";

type InputProps = {
  id?: string;
  label?: string;
  value?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

type LabelProps = {
  htmlFor: string;
};

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Input = styled.input.attrs({ type: "text" })`
  // Width is calculated as 100% - horizontal padding.
  width: calc(100% - 28px);
  padding: 13px 12px 13px 16px;
  border-radius: 8px;
  outline: none;
  color: ${({ theme }) => theme.colors.secondaryFontColor};
  background: ${({ theme }) => theme.colors.mainHiglightColor};
  border: 1px solid ${({ theme }) => theme.colors.mainHiglightColor};

  &:hover {
    background: ${({ theme }) => theme.colors.mainDimColor};
    border: 1px solid ${({ theme }) => theme.colors.mainDimColor};
  }

  &:focus {
    color: ${({ theme }) => theme.colors.fontColor};
  }
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

export const InputText = ({
  id = "input-text",
  label,
  value: inputValue = "",
  onChange,
  ...rest
}: InputProps) => {
  const [value, setValue] = useState(inputValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue(value);
    onChange(event);
  };

  return (
    <InputWrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input id={id} value={value} onChange={handleInputChange} {...rest} />
    </InputWrapper>
  );
};
