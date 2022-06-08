import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

const STUB_COLOR = "white";

const theme = {
  colors: {
    mainColor: STUB_COLOR,
    fontColor: STUB_COLOR,
    secondaryFontColor: STUB_COLOR,
    mainCanvasColor: STUB_COLOR,
    mainHiglightColor: STUB_COLOR,
    mainHiglightColorInverted: STUB_COLOR,
    mainDimColor: STUB_COLOR,
    mainDimColorInverted: STUB_COLOR,
  },
};

/**
 * Workaround function to wrap testing component into theme provider to avoid errors with missing theme colors.
 * @param children
 */
export const renderWithTheme = (children: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
};
