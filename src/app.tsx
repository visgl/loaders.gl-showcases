import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { Header } from "./components";
import * as Pages from "./pages";

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
 * TODO: Add types to component
 */
export const App = () => {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Header />
        <ContentWrapper>
          <Routes>
            <Route
              path={"/"}
              element={<Navigate to="dashboard" replace={true} />}
            />
            <Route path={"dashboard"} element={<Pages.Dashboard />} />
            <Route path={"viewer"} element={<Pages.ViewerApp />} />
            <Route path={"debug"} element={<Pages.DebugApp />} />
          </Routes>
        </ContentWrapper>
      </BrowserRouter>
    </>
  );
};
