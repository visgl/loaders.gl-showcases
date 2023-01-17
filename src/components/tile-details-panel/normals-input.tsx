import styled from "styled-components";
import { Title } from "../common";

const InputSectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 24px 0;
`;

const NormalsLabel = styled(Title)`
  width: 160px;
`;

const NormalsInput = styled.input`
  border: none;
  width: 88px;
  height: 44px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.mainAttibuteItemColor};
  color: ${({ theme }) => theme.colors.fontColor};
  margin-right: 16px;
  text-align: center;
`;

type NormalsProps = {
  id: string;
  title: string;
  value: number;
  maxValue?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const NormalsInputItem = ({
  id,
  value,
  maxValue,
  title,
  onChange,
}: NormalsProps) => {
  return (
    <InputSectionWrapper>
      <NormalsLabel as={"label"} htmlFor={id} left={16}>
        {title}
      </NormalsLabel>
      <NormalsInput
        id={id}
        type="number"
        min="1"
        max={maxValue}
        value={value}
        onChange={onChange}
      />
    </InputSectionWrapper>
  );
};
