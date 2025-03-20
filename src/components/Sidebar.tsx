import { Dashboard } from "../types/dashboard";

import SidebarDash from "../pages/Dashboard/SidebarDash";
import SiderbarMembers from "../pages/Members/SiderbarMembers";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/superbaseClient";

const Sidebar = () => {
  const [currentDash, setDash] = useState<Dashboard | null>(null);
  const [addDashboard, setAdddash] = useState(false);
  const [dashName, setDashname] = useState("");
  const queryClient = useQueryClient();

  const createDashboard = async (name: string) => {
    const { data: userData, error: authError } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      console.error("User not authenticated:", authError);
      throw new Error("User not authenticated");
    }

    // Insert dashboard
    const { data: dashboardData, error: dashboardError } = await supabase
      .from("dashboards")
      .insert([{ name }])
      .select()
      .single();

    if (dashboardError) {
      console.error("Dashboard insert error:", dashboardError);
      throw new Error(dashboardError.message);
    }

    // Associate user with dashboard
    const { error: userDashboardError } = await supabase
      .from("dashboard_users")
      .insert([
        { user_id: userId, dashboard_id: dashboardData.id, role: "admin" },
      ]);

    if (userDashboardError) {
      console.error("Dashboard user association error:", userDashboardError);
      throw new Error(userDashboardError.message);
    }

    return dashboardData;
  };

  const mutation = useMutation({
    mutationFn: createDashboard,
    onSuccess: (newDashboard) => {
      queryClient.invalidateQueries({ queryKey: ["userDashboards"] });
      setDash(newDashboard); // Asegurar que el dashboard actual se actualiza
      setDashname(""); // Limpiar el input después de crear
    },
    onError: (error) => {
      console.error("Error creating dashboard:", error);
    },
  });

  return (
    <div className="flex flex-col justify-between gap-1 bg-gradient-to-b from-secondary to-secondary-light p-4 border-r-[1px] w-[15rem] h-min-full">
      <h1 className="text-xl">DashBoards</h1>
      <div className="flex justify-center items-center bg-gradient-to-r from-neutral-dark to-primary bg-opacity-80 mt-4 mb-1 p-1 rounded-xl w-[12rem]">
        {!addDashboard ? (
          <button
            onClick={() => setAdddash((prestate) => !prestate)}
            className="flex items-center gap-2 text-neutral hover:text-neutral-light"
          >
            Create <MdOutlineDashboardCustomize className="text-xl" />
          </button>
        ) : (
          <div className="relative w-full h-fit">
            <input
              placeholder="Dashboard name"
              type="text"
              className="p-1 rounded-xl outline-none w-full text-neutral-dark"
              onChange={(event) => setDashname(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && dashName.trim() !== "") {
                  mutation.mutate(dashName);
                  setAdddash(false);
                  setDashname("");
                }
              }}
            ></input>
            <RxCross1
              onClick={() => {
                setAdddash((prestate) => !prestate);
                setDashname("");
              }}
              className="top-1.5 right-2 absolute hover:bg-neutral bg-opacity-50 p-1 rounded-full text-neutral-dark hover:text-primary-dark text-xl cursor-pointer"
            />
          </div>
        )}

        {dashName !== "" && addDashboard && (
          <button
            onClick={() => {
              mutation.mutate(dashName);
              setAdddash((prestate) => !prestate);
              setDashname("");
            }}
            className="bg-primary-dark rounded-full text-neutral-light text-3xl"
          >
            <CiCirclePlus />
          </button>
        )}
      </div>
      <SidebarDash setDash={setDash} />
      {currentDash && (
        <>
          <hr></hr>
          <SiderbarMembers dashboardId={currentDash?.id || null} />
        </>
      )}
    </div>
  );
};

export default Sidebar;
