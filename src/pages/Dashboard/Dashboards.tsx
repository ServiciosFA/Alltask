import Sidebar from "../../components/Sidebar";
import { Outlet, useParams } from "react-router-dom";

const Dashboards = () => {
  const { did, mid } = useParams(); // Obtener el ID del dashboard desde la URL

  return (
    <div className="flex bg-neutral-dark w-full h-full">
      <Sidebar />
      <div className="flex flex-1 justify-center items-center bg-gradient-to-tr from-primary-dark to-secondary w-full h-full overflow-auto">
        {did || mid ? (
          <Outlet />
        ) : (
          <p className="text-neutral-light text-xl">
            No dashboard selected. Please select one.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboards;
