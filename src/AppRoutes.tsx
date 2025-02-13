import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./pages/Login/Login";
import HomePage from "./pages/Home/HomePage";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Dashboards from "./pages/Dashboard/Dashboards";
import DashboardItem from "./pages/Dashboard/DashboardItem";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboards" element={<Dashboards />}>
            <Route path="/dashboards/:id" element={<DashboardItem />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
