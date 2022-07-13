import { ChangeEvent } from "react";
import styled from "styled-components";
import { color_accent_primary } from "../../constants/colors";

type InputProps = {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  error?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
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

const Input = styled.input<InputErrorProps>`
  // Width is calculated as 100% - horizontal padding.
  width: calc(100% - 28px);
  padding: 13px 12px 13px 16px;
  border-radius: 8px;
  outline: none;
  color: ${({ theme }) => theme.colors.secondaryFontColor};
  background: ${({ theme }) => theme.colors.mainHiglightColor};
  border: 1px solid
    ${({ theme, error }) =>
      error ? color_accent_primary : theme.colors.mainHiglightColor};

  &:hover {
    background: ${({ theme }) => theme.colors.mainDimColor};
    border: 1px solid
      ${({ theme, error }) =>
        error ? color_accent_primary : theme.colors.mainDimColor};
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

const ErrorMessage = styled.span`
  display: block;
  margin-top: 8px;
  color: ${color_accent_primary};
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
`;

export const InputText = ({
  id = "input-text",
  label,
  value,
  error = "",
  onChange,
  ...rest
}: InputProps) => {
  return (
    <InputWrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        value={value}
        onChange={onChange}
        error={error}
        type="text"
        {...rest}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
};
