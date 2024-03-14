// Skip types till this issue in recharts lib will be resolved -
// Issue - https://github.com/recharts/recharts/issues/2796

// import type { TooltipProps } from "recharts";
// import type {
//   ValueType,
//   NameType,
// } from "recharts/src/component/DefaultTooltipContent";

import styled from "styled-components";

// type HistogramTooltipProps = TooltipProps<ValueType, NameType> & {
//   attributeName: string;
// };

const Container = styled.div`
  display: flex;
  padding: 5px;
  border-radius: 8px;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.mainColor};
`;

const TooltipItem = styled.div`
  color: ${({ theme }) => theme.colors.fontColor};
`;

export const HistogramTooltip = ({
  active,
  payload,
  label,
  attributeName,
}: any) => {
  if (active && payload?.length) {
    return (
      <Container>
        <TooltipItem>{`Count: ${payload[0].value}`}</TooltipItem>
        <TooltipItem>{`${attributeName}: ${label}`}</TooltipItem>
      </Container>
    );
  }

  return null;
};
