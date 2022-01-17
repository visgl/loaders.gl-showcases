import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import * as Pages from "./pages";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={"/"}
          element={<Navigate to="dashboard" replace={true} />}
        />
        <Route path={"dashboard"} element={<Pages.Dashboard />} />
        <Route path={"i3s-app"} element={<Pages.I3SApp />} />
        <Route path={"i3s-debug-app"} element={<Pages.I3SDebugApp />} />
      </Routes>
    </BrowserRouter>
  );
};
