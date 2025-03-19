import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import HomePage from "./pages/Home/HomePage";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Dashboards from "./pages/Dashboard/Dashboards";
import DashboardItem from "./pages/Dashboard/DashboardItem";
import User from "./pages/Users/User";
import Member from "./pages/Members/Member";
import "react-toastify/dist/ReactToastify.css";
import Notification from "./components/Notification";
import { ToastContainer } from "react-toastify";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          {/* Rutas de usuario */}
          <Route path="user/:id" element={<User />} />
          <Route path="user/:id/dashboards" element={<Dashboards />}>
            <Route path=":did" element={<DashboardItem />} />
            <Route path="member/:mid" element={<Member />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
      <Notification />
    </BrowserRouter>
  );
}

export default AppRoutes;
