import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { StyledMapContainer } from "../common-styled";

const StyledUnsupportedContainer = styled(StyledMapContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
}));

/* eslint-disable-next-line */
export interface UnsupportedProps {}

export function Unsupported(props: UnsupportedProps) {
  return (
    <StyledUnsupportedContainer>
      <StyledPaper elevation={3}>
        Overlaid mode is not supported for ArcGIS
      </StyledPaper>
    </StyledUnsupportedContainer>
  );
}

export default Unsupported;
