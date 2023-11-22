import { useState } from "react";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { Header, HelpPanel } from "./components";
import {
  color_brand_primary,
  color_brand_quaternary,
  color_canvas_primary,
  color_canvas_secondary,
  dim_canvas_primary,
  dim_canvas_secondary,
  hilite_canvas_primary,
  hilite_canvas_secondary,
  color_brand_secondary,
  color_canvas_primary_inverted,
  color_canvas_secondary_inverted,
  color_accent_secondary,
  color_brand_quinary,
  color_brand_secondary_dark,
  color_accent_primary,
  color_accent_tertiary,
} from "./constants/colors";
import * as Pages from "./pages";
import { AppThemes, ComparisonMode, Theme } from "./types";

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
      fontColor: color_canvas_primary_inverted,
      secondaryFontColor: color_brand_quaternary,
      mainCanvasColor: color_canvas_primary,
      mainHiglightColor: hilite_canvas_primary,
      mainHiglightColorInverted: hilite_canvas_secondary,
      mainDimColor: dim_canvas_primary,
      mainDimColorInverted: dim_canvas_secondary,
      accentColor: color_brand_secondary,
      iconInactiveColor: hilite_canvas_secondary,
      buttonIconColor: color_canvas_primary_inverted,
      buttonDimIconColor: color_canvas_primary_inverted,
      buttonDimColor: hilite_canvas_primary,
      mapControlPanelColor: color_canvas_primary,
      mapControlExpanderColor: color_canvas_primary_inverted,
      mapControlExpanderDimColor: color_canvas_primary_inverted,
      mainToolsPanelIconColor: color_canvas_primary_inverted,
      mainToolsPanelDimIconColor: hilite_canvas_secondary,
      mainHelpPanelColor: color_brand_primary,
      mainAttibuteItemColor: color_brand_primary,
      mainAttributeHighlightColor: hilite_canvas_primary,
      mainHistogramColor: color_brand_secondary,
      bookmarkFileInteracrions: dim_canvas_primary,
      validateTileOk: color_brand_secondary_dark,
      validateTileWarning: color_accent_tertiary,
      filtrationImage: color_brand_quaternary,
    },
    name: Theme.Dark,
  },
  [Theme.Light]: {
    colors: {
      mainColor: color_canvas_primary_inverted,
      fontColor: color_brand_primary,
      secondaryFontColor: dim_canvas_primary,
      mainCanvasColor: color_canvas_secondary,
      mainHiglightColor: hilite_canvas_secondary,
      mainHiglightColorInverted: hilite_canvas_primary,
      mainDimColor: dim_canvas_secondary,
      mainDimColorInverted: dim_canvas_primary,
      accentColor: color_accent_secondary,
      iconInactiveColor: dim_canvas_primary,
      buttonIconColor: hilite_canvas_primary,
      buttonDimIconColor: color_canvas_primary,
      buttonDimColor: color_canvas_secondary,
      mapControlPanelColor: hilite_canvas_secondary,
      mapControlExpanderColor: color_brand_primary,
      mapControlExpanderDimColor: dim_canvas_primary,
      mainToolsPanelIconColor: color_canvas_secondary_inverted,
      mainToolsPanelDimIconColor: dim_canvas_secondary,
      mainHelpPanelColor: color_canvas_secondary,
      mainAttibuteItemColor: hilite_canvas_secondary,
      mainAttributeHighlightColor: dim_canvas_secondary,
      mainHistogramColor: color_brand_quinary,
      bookmarkFileInteracrions: color_canvas_secondary_inverted,
      validateTileOk: color_brand_secondary,
      validateTileWarning: color_accent_primary,
      filtrationImage: color_canvas_secondary,
    },
    name: Theme.Light,
  },
};

/**
 * TODO: Add types to component
 */
export const App = () => {
  const [theme, setTheme] = useState<Theme>(Theme.Dark);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const handleHelpClick = () => {
    setShowHelp((prevValue) => !prevValue);
  };

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={THEMES[theme]}>
        <BrowserRouter>
          <Header
            setTheme={setTheme}
            theme={theme}
            onHelpClick={handleHelpClick}
            showHelp={showHelp}
          />
          <ContentWrapper>
            <Routes>
              <Route
                path={"/"}
                element={<Navigate to="dashboard" replace={true} />}
              />
              <Route path={"dashboard"} element={<Pages.Dashboard />} />
              <Route path={"viewer"} element={<Pages.ViewerApp />} />
              <Route path={"debug"} element={<Pages.DebugApp />} />
              <Route path={"auth"} element={<Pages.AuthApp />} />
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
          {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};
