import { useLocation } from "react-router-dom";
import { User } from "../../types/dashboard";
import { supabase } from "../../lib/superbaseClient";
import { useQuery } from "@tanstack/react-query";
import { capitalize } from "../../Helps/capitalize";

const getUserRole = async ({
  userId,
  dashboardId,
}: {
  userId: string;
  dashboardId: string;
}) => {
  const { data, error } = await supabase
    .from("dashboard_users")
    .select("role")
    .eq("user_id", userId)
    .eq("dashboard_id", dashboardId)
    .single();

  if (error) throw new Error(error.message);
  return data?.role;
};

type TaskListWithNotes = {
  name: string;
  notes: {
    id: string;
    description: string;
    state: number;
  }[];
};

const fetchNotesGroupedByTaskList = async ({
  userId,
  dashboardId,
}: {
  userId: string;
  dashboardId: string;
}): Promise<TaskListWithNotes[]> => {
  const { data, error } = await supabase
    .from("task_lists")
    .select(
      `
      name,
      notes:notes!inner(
        id,
        description,
        state,
        note_users:note_users!inner(
          user_id
        )
      )
      `
    )
    .eq("dashboard_id", dashboardId)
    .eq("notes.note_users.user_id", userId);

  if (error) throw new Error(error.message);

  return (
    data?.map((taskList) => ({
      name: taskList.name,
      notes: taskList.notes.map((note) => ({
        id: note.id,
        description: note.description,
        state: note.state,
      })),
    })) || []
  );
};

const Member = () => {
  const location = useLocation();
  const member: User = location.state.element;
  const dashboardId = location.state.dashboardId;

  const {
    data: role,
    isLoading: isLoadingRoles,
    isError,
  } = useQuery({
    queryKey: ["userRole", member?.id, dashboardId],
    queryFn: () =>
      getUserRole({ userId: member.id, dashboardId: dashboardId! }),
    enabled: !!member?.id && !!dashboardId,
  });

  const {
    data: groupedNotes,
    isPending: isPendingNotes,
    isError: isErrorNotes,
  } = useQuery<TaskListWithNotes[]>({
    queryKey: ["groupedUserNotes", member?.id, dashboardId],
    queryFn: () =>
      fetchNotesGroupedByTaskList({
        userId: member?.id,
        dashboardId: dashboardId,
      }),
    enabled: !!member?.id && !!dashboardId,
  });

  const colorRole: Record<string, string> = {
    admin: "text-amber-400",
    member: "text-primary",
  };

  const roleColorClass = role
    ? colorRole[role] || "text-neutral"
    : "text-neutral";

  return (
    <div className="flex flex-col bg-gradient-to-tr from-primary-dark to-secondary w-full h-full">
      <div className="flex justify-between bg-secondary p-4">
        <div className="flex flex-col">
          <p className="text-4xl">{capitalize(member.nickname)}</p>
          <p className="text-neutral-300 text-sm">{member.email}</p>
        </div>

        <p>{member.aboutme}</p>

        {role && (
          <div className="flex items-center gap-2">
            <p className={`${roleColorClass} text-lg`}>
              {capitalize(role || "Desconocido")}
            </p>
          </div>
        )}
      </div>
      <h1 className="bg-secondary-dark bg-opacity-35 p-4 text-3xl">
        Assigned Task
      </h1>
      {groupedNotes && groupedNotes.length > 0 ? (
        <div className="flex gap-2 bg-secondary-dark bg-opacity-35 p-4 h-full cursor-default">
          {groupedNotes.map((taskList) => (
            <div
              key={taskList.name}
              className="bg-secondary-dark bg-opacity-70 mt-2 p-2 rounded-lg w-[15rem] h-fit max-h-[18rem] overflow-y-auto"
            >
              <h3 className="mb-3 font-semibold text-primary-light text-xl">
                {capitalize(taskList.name)}
              </h3>
              <ul
                className={`space-y-2 rounded-sm max-h-[15rem] overflow-auto mt-2`}
              >
                {taskList.notes.map((note) => (
                  <li
                    key={note.id}
                    className={
                      note.state !== 1
                        ? `bg-neutral-dark p-2 rounded-sm line-through  `
                        : `bg-blue-700 p-2 rounded-sm  `
                    }
                  >
                    <p>{capitalize(note.description)}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        !isPendingNotes && (
          <div className="flex justify-center items-center bg-secondary-dark bg-opacity-35 h-full">
            <p className="font-semibold text-neutral-400 text-2xl">
              No hay notas disponibles
            </p>
          </div>
        )
      )}

      {isLoadingRoles && isPendingNotes && <p>Cargando información...</p>}
      {isError && isErrorNotes && <p>Error al cargar los datos</p>}
    </div>
  );
};

export default Member;
