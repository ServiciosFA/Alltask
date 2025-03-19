import { useEffect, useState } from "react";
import { Dashboard } from "../../types/dashboard";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/superbaseClient";
import { useQuery } from "@tanstack/react-query";
import { capitalize } from "../../Helps/capitalize";

const fetchUserDashboards = async (): Promise<Dashboard[]> => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("dashboard_users")
    .select("dashboard_id, dashboards (id, name)")
    .eq("user_id", userId);

  console.log("🔍 Datos obtenidos de Supabase:", data); // Agregar esto para ver qué devuelve
  if (error) throw new Error(error.message);

  return data.map((item) => {
    const dashboard = (
      Array.isArray(item.dashboards) ? item.dashboards[0] : item.dashboards
    ) as { id: string; name: string };

    return {
      id: dashboard.id,
      name: dashboard.name,
      users: [],
      taskLists: [],
    };
  });
};

const SidebarDash = ({
  setDash,
}: {
  setDash: (dashboard: Dashboard | null) => void;
}) => {
  const [idDashboard, setidDashboard] = useState("");
  const {
    data: dashboards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userDashboards"],
    queryFn: fetchUserDashboards,
  });

  //Verifica si el dashboard actual aún existe en la lista
  useEffect(() => {
    if (idDashboard && !dashboards?.some((d) => d.id === idDashboard)) {
      setidDashboard("");
      setDash(null);
    }
  }, [dashboards, idDashboard, setDash]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul className="flex flex-col gap-2 custom-scrollbar w-[12rem] h-3/4 overflow-y-scroll text-primary">
      {dashboards?.map((element) => (
        <Link
          to={`${element.id}`}
          state={element}
          onClick={() => {
            setidDashboard(element?.id);
            setDash(element);
          }}
          className={
            idDashboard === element.id
              ? `flex gap-2 pl-2 cursor-pointer  mx-1  bg-opacity-30 bg-neutral py-1 rounded-md items-center`
              : `flex gap-2 pl-2 cursor-pointer py-1  mx-1 items-center`
          }
          key={element.id}
        >
          <div className="bg-neutral rounded-full w-[1.5rem] h-[1.5rem] font-semibold text-primary-dark text-center">
            <p>{element?.name?.charAt(0).toUpperCase()}</p>
          </div>
          <p className="hover:text-primary-light">
            {capitalize(element?.name)}
          </p>
        </Link>
      ))}
    </ul>
  );
};

export default SidebarDash;
