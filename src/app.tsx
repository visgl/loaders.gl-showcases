import { useState } from "react";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { Header } from "./components";
import {
  color_brand_primary,
  color_canvas_primary,
  color_canvas_secondary,
  color_brand_quaternary,
  color_brand_tertiary,
  color_canvas_inverted,
  color_brand_senary,
  color_brand_quinary,
} from "./constants/colors";
import * as Pages from "./pages";
import { AppThemes, Theme, ComparisonMode } from "./types";

const ContentWrapper = styled.div`
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Uber Move", "Segoe UI",
      "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
  }
`;

/**
 * @todo Add colors and styles for each theme.
 */
const THEMES: AppThemes = {
  [Theme.Dark]: {
    colors: {
      mainColor: color_canvas_primary,
      fontColor: color_canvas_inverted,
      buttonBackgroundColor: color_brand_quaternary,
      panelBgColor: color_brand_primary,
      tabHover: color_brand_tertiary,
      listItemActive: color_brand_quaternary,
      listItemHover: color_brand_senary,
    },
    name: Theme.Dark,
  },
  [Theme.Light]: {
    colors: {
      mainColor: color_canvas_inverted,
      fontColor: color_brand_primary,
      buttonBackgroundColor: color_brand_tertiary,
      panelBgColor: color_canvas_secondary,
      tabHover: color_brand_senary,
      listItemActive: color_brand_tertiary,
      listItemHover: color_brand_quinary,
    },
    name: Theme.Light,
  },
};

/**
 * TODO: Add types to component
 */
export const App = () => {
  const [theme, setTheme] = useState<Theme>(Theme.Dark);

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={THEMES[theme]}>
        <BrowserRouter>
          <Header setTheme={setTheme} theme={theme} />
          <ContentWrapper>
            <Routes>
              <Route
                path={"/"}
                element={<Navigate to="dashboard" replace={true} />}
              />
              <Route path={"dashboard"} element={<Pages.Dashboard />} />
              <Route path={"viewer"} element={<Pages.ViewerApp />} />
              <Route path={"debug"} element={<Pages.DebugApp />} />
              <Route
                path={"compare-across-layers"}
                element={
                  <Pages.Comparison mode={ComparisonMode.acrossLayers} />
                }
              />
              <Route
                path={"compare-within-layer"}
                element={<Pages.Comparison mode={ComparisonMode.withinLayer} />}
              />
            </Routes>
          </ContentWrapper>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};
