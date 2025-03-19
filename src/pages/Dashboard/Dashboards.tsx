import Sidebar from "../../components/Sidebar";

import { Outlet } from "react-router-dom";

const Dashboards = () => {
  return (
    <div className="flex bg-neutral-dark w-full h-full">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Dashboards;
