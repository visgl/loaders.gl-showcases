import { useState } from "react";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { Header } from "./components";
import {
  color_brand_primary,
  color_brand_quaternary,
  color_canvas_inverted,
  color_canvas_primary,
  color_canvas_secondary,
  dim_canvas_primary,
  dim_canvas_secondary,
  hilite_canvas_primary,
  hilite_canvas_secondary,
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
      mainColor: color_brand_primary,
      fontColor: color_canvas_inverted,
      secondaryFontColor: color_brand_quaternary,
      mainCanvasColor: color_canvas_primary,
      mainHiglightColor: hilite_canvas_primary,
      mainHiglightColorInverted: hilite_canvas_secondary,
      mainDimColor: dim_canvas_primary,
      mainDimColorInverted: dim_canvas_secondary,
    },
    name: Theme.Dark,
  },
  [Theme.Light]: {
    colors: {
      mainColor: color_canvas_inverted,
      fontColor: color_brand_primary,
      secondaryFontColor: dim_canvas_primary,
      mainCanvasColor: color_canvas_secondary,
      mainHiglightColor: hilite_canvas_secondary,
      mainHiglightColorInverted: hilite_canvas_primary,
      mainDimColor: dim_canvas_secondary,
      mainDimColorInverted: dim_canvas_primary,
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
