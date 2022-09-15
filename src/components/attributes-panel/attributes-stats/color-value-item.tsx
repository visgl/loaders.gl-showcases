import styled, { useTheme } from "styled-components";

import DropdownUp from "../../../../public/icons/dropdown-up.svg";
import FilledArrowUp from "../../../../public/icons/filled-arrow-up.svg";

const FilledUpIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

const ValueItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ValueItemText = styled.div`
  display: flex;
  align-items: stretch;
  height: 100%;
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
`;

const ValueItemArrow = styled(DropdownUp)<{ deg: number; visible: boolean }>`
  width: 15px;
  height: 17px;
  fill: ${({ theme }) => theme.colors.fontColor};
  transform: ${({ deg }) => `rotate(${deg}deg)`};
`;

type ColorValueItemProps = {
  deg?: number;
  yearCount?: number;
  arrowVisibility: boolean;
};

export const ColorValueItem = ({
  deg,
  yearCount,
  arrowVisibility,
}: ColorValueItemProps) => {
  const theme = useTheme();

  return (
    <ValueItemContainer>
      <FilledUpIconContainer>
        <FilledArrowUp fill={theme.colors.fontColor} />
      </FilledUpIconContainer>
      <ValueItemText>
        {arrowVisibility && <ValueItemArrow deg={deg} />}
        {yearCount}
      </ValueItemText>
    </ValueItemContainer>
  );
};
