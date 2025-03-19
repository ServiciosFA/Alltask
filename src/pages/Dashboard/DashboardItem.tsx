import { useLocation } from "react-router-dom";
import NavbarDash from "../../components/NavbarDash";
import { Dashboard } from "../../types/dashboard";
import { useState } from "react";
import TaskItem from "./Tasks/TaskItem";
import { FaPlus } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { supabase } from "../../lib/superbaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Función para obtener la lista de tareas y sus notas
const fetchTaskLists = async (dashboardId: string) => {
  if (!dashboardId) return [];

  const { data, error } = await supabase
    .from("task_lists")
    .select(
      `
      *,
      notes (
        id,
        description,
        created_at
      )
    `
    )
    .eq("dashboard_id", dashboardId);

  if (error) {
    console.error("Error en la consulta:", error.message);
    return [];
  }

  return data;
};

const DashboardItem = () => {
  const location = useLocation();
  const dashboard: Dashboard | undefined = location.state;
  const [addtask, setAddtask] = useState(false);
  const [nameTask, setNametask] = useState("");
  const queryClient = useQueryClient();

  // 🔹 Obtener la lista de tareas con React Query
  const {
    data: listTask = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["taskLists", dashboard?.id],
    queryFn: () => fetchTaskLists(dashboard?.id || ""),
    enabled: !!dashboard?.id, // Solo ejecuta si hay un dashboard
  });

  // 🔹 Mutación para agregar una nueva tarea
  const createTaskListMutation = useMutation({
    mutationFn: async (nameTask: string) => {
      const { data, error } = await supabase
        .from("task_lists")
        .insert([{ name: nameTask, dashboard_id: dashboard?.id }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists", dashboard?.id] }); // Recargar lista
      setNametask("");
      setAddtask(false);
    },
  });

  const handleCreateTaskList = () => {
    if (!nameTask.trim() || !dashboard) return;
    createTaskListMutation.mutate(nameTask);
  };

  return (
    <div className="bg-gradient-to-tr from-primary-dark to-secondary w-full h-full overflow-auto">
      <NavbarDash currentDash={dashboard ? dashboard : null} />
      <ul className="flex gap-4 p-4 h-full">
        {/* 🔹 Mensaje de carga */}
        {isLoading && <p>Loading tasks...</p>}
        {isError && <p>Error loading tasks</p>}

        {/* 🔹 Mostrar las tareas */}
        {listTask.map((element) => (
          <TaskItem
            key={element.id}
            element={element}
            setListtask={() => {}} // Ya no necesitamos actualizar manualmente
            dashboard={dashboard}
          />
        ))}

        {/* 🔹 Botón para agregar nueva tarea */}
        <li className="relative flex flex-col gap-2 bg-secondary-light hover:bg-secondary-dark bg-opacity-80 p-2 rounded-lg w-[15rem] h-fit cursor-pointer">
          {!addtask ? (
            <div
              onClick={() => setAddtask(true)}
              className="flex justify-between items-center"
            >
              <p className="items-self-center">Add new task</p>
              <FaPlus />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <input
                  className="p-1 rounded-sm outline-none text-secondary"
                  placeholder="Name task..."
                  onChange={(e) => setNametask(e.target.value)}
                  value={nameTask}
                />
              </div>
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={handleCreateTaskList}
                  className="bg-neutral-dark hover:bg-secondary p-1 rounded-md"
                >
                  Add Task
                </button>
                <RxCross1
                  onClick={() => setAddtask(false)}
                  className="hover:bg-neutral-dark p-1 rounded-md w-[1.5rem] h-[1.5rem]"
                />
              </div>
            </>
          )}
        </li>
      </ul>
    </div>
  );
};

export default DashboardItem;
