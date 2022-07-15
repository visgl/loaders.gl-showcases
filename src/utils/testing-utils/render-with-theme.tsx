import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";


const theme = {
  colors: {
    mainColor: '#000000',
    fontColor: '#000001',
    secondaryFontColor: '#000002',
    mainCanvasColor: '#000003',
    mainHiglightColor: '#000004',
    mainHiglightColorInverted: '#000005',
    mainDimColor: '#000006',
    mainDimColorInverted: '#000007',
    accentColor: '#000008',
    iconInactiveColor: '#000009',
    buttonIconColor: '#000010',
    buttonDimIconColor: '#000011',
    buttonDimColor: '#000002',
    mapControlPanelColor: '#000012',
    mapControlExpanderColor: '#000013',
    mapControlExpanderDimColor: '#000014',
  },
};

/**
 * Workaround function to wrap testing component into theme provider to avoid errors with missing theme colors.
 * @param children
 */
export const renderWithTheme = (children: React.ReactNode, renderFunc = render) => {
  return renderFunc(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
};
