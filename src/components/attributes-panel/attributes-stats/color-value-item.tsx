import styled, { useTheme } from "styled-components";
import { ArrowDirection } from "../../../types";

import ChevronIcon from "../../../../public/icons/chevron.svg";
import FilledArrowUp from "../../../../public/icons/filled-arrow.svg";

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

const ValueItemArrow = styled.div<{ arrowDirection: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 4px;
  width: 5px;
  height: 16px;
  fill: ${({ theme }) => theme.colors.fontColor};
  transform: ${({ arrowDirection }) =>
    arrowDirection === ArrowDirection.left ? "none" : "rotate(-180deg)"};
`;

type ColorValueItemProps = {
  arrowDirection?: ArrowDirection;
  colorValue?: number;
  arrowVisibility: boolean;
};

export const ColorValueItem = ({
  arrowDirection,
  colorValue,
  arrowVisibility,
}: ColorValueItemProps) => {
  const theme = useTheme();

  return (
    <ValueItemContainer>
      <FilledUpIconContainer>
        <FilledArrowUp fill={theme.colors.fontColor} />
      </FilledUpIconContainer>
      <ValueItemText>
        {arrowVisibility && arrowDirection && (
          <ValueItemArrow arrowDirection={arrowDirection}>
            <ChevronIcon />
          </ValueItemArrow>
        )}
        {colorValue}
      </ValueItemText>
    </ValueItemContainer>
  );
};
