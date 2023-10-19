// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import Button from "@mui/material/Button";
// import { styled as muiStyled } from "@mui/material/styles";
import styled from "styled-components";

export const StyledMapContainer = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

// export const StyledGridContainer = styled(Grid)`
//  visibility: hidden;
// `;

// export const StyledGridItem = styled(Grid)`
//  visibility: visible;
//  padding-right: 0.5em;
// `;

// export const StyledTopPanelsContainer = muiStyled(Box)`
//  top: 0;
//  left: 0;
//  width: 99%;
//  visibility: hidden;
//  position: absolute;
//  z-index: 1;
// `;

// export const StyledMainPaper = muiStyled(Paper)<{ bgcolor?: string }>`
//  padding: ${({ theme }) => theme.spacing(1)};
//  textalign: 'center';
//  background-color: ${({ theme, bgcolor }) =>
//    bgcolor || theme.palette.background.paper};
//  color:  ${({ theme, color }) => color || theme.palette.text.primary};
// `;

// export const StyledOpenPanelButton = muiStyled(Button)(({ theme }) => ({
//  "&.MuiButton-contained": {
//    visibility: "visible",
//    minWidth: "initial",
//    padding: theme.spacing(1),
//  },
// }));
