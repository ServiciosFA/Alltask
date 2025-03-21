import { useEffect, useRef, useState } from "react";
import { capitalize } from "../Helps/capitalize";
import { Dashboard } from "../types/dashboard";
import CircleList from "./CircleList";
import { ImMenu3 } from "react-icons/im";
import Confirm from "./Confirm";
import Modal from "./Modal";
import { supabase } from "../lib/superbaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const NavbarDash = ({ currentDash }: { currentDash: Dashboard | null }) => {
  const [showMenu, setShowmenu] = useState(false);
  const [showModaldelete, setshowModaldelete] = useState(false);
  const [showModaledit, setshowModaledit] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  // Obtener rol del usuario
  const { data: userRole } = useQuery({
    queryKey: ["userRole", id, currentDash?.id],
    queryFn: async () => {
      if (!id || !currentDash?.id) return null;
      const { data, error } = await supabase
        .from("dashboard_users")
        .select("role")
        .eq("user_id", id)
        .eq("dashboard_id", currentDash.id)
        .single();

      if (error) return null;
      return data?.role;
    },
    enabled: !!id && !!currentDash?.id,
  });

  const deleteDashboard = async (dashboardId: string) => {
    try {
      if (userRole !== "admin") {
        console.error("No tienes permisos para eliminar este dashboard.");
        return;
      }

      console.log(`Intentando eliminar dashboard con ID: ${dashboardId}`);

      // 🔥 Eliminar todas las listas de tareas y sus notas
      const { data: taskLists, error: taskListError } = await supabase
        .from("task_lists")
        .select("id")
        .eq("dashboard_id", dashboardId);

      if (taskListError) throw taskListError;

      const taskListIds = taskLists.map((task) => task.id);
      if (taskListIds.length > 0) {
        const { error: notesError } = await supabase
          .from("notes")
          .delete()
          .in("task_list_id", taskListIds);
        if (notesError) throw notesError;
      }
      // 🔥 Eliminar el dashboard
      const { error: dashboardDeleteError } = await supabase
        .from("dashboards")
        .delete()
        .eq("id", dashboardId);

      if (dashboardDeleteError) {
        console.error("Error al eliminar el dashboard:", dashboardDeleteError);
        return;
      }

      console.log("Dashboard eliminado correctamente.");
      navigate(`/user/${id}/dashboards`);
      queryClient.invalidateQueries({ queryKey: ["userDashboards"] });
    } catch (error) {
      console.error("Error eliminando el dashboard:", error);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowmenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="top-0 right-0 left-0 z-20 sticky flex justify-between items-center bg-neutral-dark bg-opacity-60 p-2 w-full">
      <div className="relative flex items-center gap-3 h-full">
        <h1>{capitalize(currentDash?.name)}</h1>
        <div className="relative">
          {userRole === "admin" && (
            <ImMenu3
              onClick={() => setShowmenu((prev) => !prev)}
              className="hover:text-primary-light text-2xl cursor-pointer"
            />
          )}
          {showMenu && (
            <div
              ref={menuRef}
              className="top-full right-0 z-50 absolute flex flex-col gap-1 bg-neutral-dark shadow-lg mt-2 p-2 rounded-md w-[6rem] text-xs translate-x-2/3"
            >
              <p
                onClick={() => setshowModaledit(true)}
                className="hover:bg-neutral hover:bg-opacity-15 px-1 cursor-pointer"
              >
                Edit name
              </p>
              <p
                onClick={() => setshowModaldelete(true)}
                className="hover:bg-neutral hover:bg-opacity-15 px-1 text-red-400 cursor-pointer"
              >
                Delete
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-5">
        <p>Filters</p>
        <CircleList type="normal" members={currentDash?.users} />
      </div>
      {showModaldelete && (
        <Modal>
          <Confirm
            message="Are you sure you want to delete the dashboard?"
            onClose={() => {
              setshowModaldelete(false);
            }}
            onConfirm={() => {
              setShowmenu(false);
              if (currentDash?.id) {
                deleteDashboard(currentDash.id);
              }
              setshowModaldelete(false);
            }}
          ></Confirm>
        </Modal>
      )}
      {showModaledit && (
        <Modal>
          <div className="relative bg-neutral-dark p-2 rounded-lg h-[8rem]">
            <div className="flex flex-col gap-2">
              <label className="">New name</label>
              <input
                className="px-1 rounded-lg outline-none text-neutral-dark"
                type="text"
                defaultValue={currentDash?.name}
              ></input>
            </div>
            <div className="right-2 bottom-0 absolute flex gap-2 py-2">
              <button
                onClick={() => setshowModaledit(false)}
                className="bg-primary-dark px-2 rounded-lg text-neutral"
              >
                Delete
              </button>
              <button
                onClick={() => setshowModaledit(false)}
                className="bg-neutral-light px-2 rounded-lg text-neutral-dark"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default NavbarDash;
