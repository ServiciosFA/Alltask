import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Dashboard } from "../../types/dashboard";
import { Outlet } from "react-router-dom";

const Dashboards = () => {
  const [currentDash, setDash] = useState<Dashboard | null>(null);
  return (
    <div className="flex w-full h-full">
      <Sidebar setDash={setDash} />
      <Outlet context={currentDash ? currentDash : null} />
    </div>
  );
};

export default Dashboards;
