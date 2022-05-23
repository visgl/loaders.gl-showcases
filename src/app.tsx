import { useState } from "react";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { Header } from "./components";
import * as Pages from "./pages";
import { Theme } from "./utils/enums";

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
const THEMES = {
  [Theme.Dark]: {
    mainColor: "#232430",
    fontColor: "#FFFFFF",
    buttonBorderColor: "#9EA2AE",
    buttonBackgroundColor: "#393A45",
  },
  [Theme.Light]: {
    mainColor: "#FFFFFF",
    fontColor: "#0E111A",
    buttonBorderColor: "#9EA2AE",
    buttonBackgroundColor: "#DCDEE3",
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
              <Route path={"comparison"} element={<Pages.Comparison />} />
              <Route path={"comparison"} element={<Pages.Comparison />} />
              <Route
                path={"comparison/across-layers"}
                element={<Pages.ConstructionInfo />}
              />
              <Route
                path={"comparison/within-layer"}
                element={<Pages.ConstructionInfo />}
              />
            </Routes>
          </ContentWrapper>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};
