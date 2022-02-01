import { Route, Routes, Navigate, HashRouter } from "react-router-dom";
import styled from "styled-components";
import { Header } from "./components";
import * as Pages from "./pages";

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 60px;
`;

export const App = () => {
  return (
    <HashRouter>
      <Header />
      <ContentWrapper>
        <Routes>
          <Route
            path={"/"}
            element={<Navigate to="dashboard" replace={true} />}
          />
          <Route path={"dashboard"} element={<Pages.Dashboard />} />
          <Route path={"viewer"} element={<Pages.I3SApp />} />
          <Route path={"debug"} element={<Pages.I3SDebugApp />} />
        </Routes>
      </ContentWrapper>
    </HashRouter>
  );
};
