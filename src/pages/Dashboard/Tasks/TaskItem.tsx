import { BsThreeDots } from "react-icons/bs";
import Notes from "../Notes/Notes";
import { RxCross1 } from "react-icons/rx";
import { useEffect, useRef, useState } from "react";
import { Dashboard, TaskList } from "../../../types/dashboard";
import { FaPlus } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/superbaseClient";
import { capitalize } from "../../../Helps/capitalize";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../store/notifiSlice";
import Modal from "../../../components/Modal";
import Confirm from "../../../components/Confirm";

const TaskItem = ({
  element,

  dashboard,
}: {
  element: TaskList;

  dashboard: Dashboard | undefined;
}) => {
  const [showAdd, setShowAdd] = useState<string | null>(null);
  const [showMenu, setShowmenu] = useState(false);
  const [notesContent, setNotesContent] = useState<{ [key: string]: string }>(
    {}
  );
  const [editedName, setEditedName] = useState(element.name || "");
  const [editName, setEdit] = useState(false);
  const [selectedNoteid, setSelectNoteid] = useState("");
  const [showPriority, setShowpriority] = useState(false);
  const listRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [confirm, setConfirm] = useState(false);

  //Manejador de texto de nueva note
  const handleNoteChange = (id: string, value: string) => {
    setNotesContent((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  //Mutacion agregar note
  const addNoteMutation = useMutation({
    mutationFn: async ({
      taskId,
      description,
    }: {
      taskId: string;
      description: string;
    }) => {
      // Insertar la nota en la tabla 'notes' con el task_id correspondiente
      const { data: noteData, error: noteError } = await supabase
        .from("notes")
        .insert([{ description, task_list_id: taskId, state: 1 }]) // Agregar status por defecto
        .select()
        .single();

      if (noteError) throw new Error(noteError.message);

      return noteData;
    },
    onSuccess: (newNote) => {
      // Limpiar el contenido del textarea
      setNotesContent((prev) => ({ ...prev, [newNote.task_id]: "" }));
      // Cerrar el formulario de agregar nota
      setShowAdd(null);
      // Invalidar la consulta para refrescar los datos
      queryClient.invalidateQueries({
        queryKey: ["taskLists", dashboard?.id].filter(Boolean),
      });
    },
  });
  //Agregar note usando la mutacion
  const handleAddNote = (taskId: string) => {
    if (!notesContent[taskId]?.trim()) return;
    addNoteMutation.mutate({ taskId, description: notesContent[taskId] });
  };
  //Agregar evento a una nota del tasklist
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showAdd &&
        listRefs.current[showAdd] &&
        !listRefs.current[showAdd]?.contains(event.target as Node)
      ) {
        setShowAdd(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dashboard?.taskLists, showAdd]);
  //Agregar evento al menu determinada tasklist para cerrar el menu del tasklist cuando se clickea otra cosa que no sea el menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSelectNoteid(""); // Cierra el menú
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //Editar Task
  //Eliminar Task
  //Cambiar estado Task
  const updateTaskMutation = useMutation({
    mutationFn: async ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: { priority?: number; name?: string };
    }) => {
      const { data, error } = await supabase
        .from("task_lists")
        .update(updates) // Ahora actualiza cualquier campo dentro de 'updates'
        .eq("id", taskId)
        .select()
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
    onSuccess: () => {
      // Invalidar la caché para recargar los datos actualizados
      queryClient.invalidateQueries({
        queryKey: ["taskLists", dashboard?.id].filter(Boolean),
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async ({
      taskId,
      dashboardId,
    }: {
      taskId: string;
      dashboardId: string;
    }) => {
      const { error } = await supabase
        .from("task_lists")
        .delete()
        .eq("id", taskId)
        .eq("dashboard_id", dashboardId);
      if (error) throw new Error(error.message);
    },
    onMutate: async ({ taskId }) => {
      // Cancelar cualquier solicitud en curso
      await queryClient.cancelQueries({
        queryKey: ["taskLists", dashboard?.id],
      });

      // Guardar estado previo en caso de rollback
      const previousTasks = queryClient.getQueryData([
        "taskLists",
        dashboard?.id,
      ]);

      // Actualizar la UI eliminando la tarea antes de la respuesta del servidor
      queryClient.setQueryData(
        ["taskLists", dashboard?.id],
        (oldTasks: TaskList[] | undefined) => {
          return oldTasks ? oldTasks.filter((task) => task.id !== taskId) : [];
        }
      );

      return { previousTasks };
    },
    onError: (_, __, context) => {
      // Si hay un error, restaurar el estado anterior
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["taskLists", dashboard?.id],
          context.previousTasks
        );
      }
    },
    onSettled: (_, __, { dashboardId }) => {
      // Invalidar la caché para asegurarse de que los datos sean correctos
      queryClient.invalidateQueries({ queryKey: ["taskLists", dashboardId] });
    },
  });

  const priorityColors = {
    1: "text-red-400 ",
    2: "text-amber-400",
    3: "text-green-500 ",
  };

  console.log(element.notes);

  return (
    <li
      className={`bg-black bg-opacity-50 relative  flex flex-col justify-between gap-2 p-2 rounded-lg min-w-[13rem] h-fit max-h-[20rem] cursor-pointer shadow-sm `}
      key={element.id}
      ref={(el) => (listRefs.current[element.id] = el)}
    >
      <div className="flex justify-between">
        {!editName ? (
          <p className={`${priorityColors[element?.priority ?? 3]}`}>
            {capitalize(element.name)}
          </p>
        ) : (
          <textarea
            className="bg-neutral-700 px-1 rounded-md outline-none h-fit max-h-[2.5rem] text-primary-light text-sm resize-none"
            placeholder="Task name..."
            value={editedName ? capitalize(editedName) : ""}
            onChange={(event) => setEditedName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && editedName.trim() !== "") {
                updateTaskMutation.mutate({
                  taskId: element.id,
                  updates: { name: editedName.trim() },
                });
                setEdit(false);
              }
            }}
          ></textarea>
        )}
        <div ref={menuRef} className="relative h-fit">
          <BsThreeDots
            onClick={() => {
              if (selectedNoteid === "") setSelectNoteid(element.id);
              else {
                setSelectNoteid("");
                setShowmenu(false);
              }
            }}
            className="flex items-center hover:bg-slate-500 p-1 rounded-md min-w-[1.5rem] min-h-[1.5rem] text-xl cursor-pointer"
          />
          {!showMenu && element.id === selectedNoteid && (
            //Menu de task
            <div className="top-full right-0 z-50 absolute flex flex-col gap-1 bg-secondary-dark shadow-lg p-2 rounded-md w-[6rem] text-xs">
              <p
                onClick={() => {
                  setEdit(true);
                  setShowmenu(false);
                  setSelectNoteid("");
                  setEditedName(element?.name);
                }}
                className="hover:bg-neutral hover:bg-opacity-15 px-1 cursor-pointer"
              >
                Edit name
              </p>
              <div
                onMouseEnter={() => setShowpriority(true)}
                onMouseLeave={() => setShowpriority(false)}
                className="relative hover:bg-neutral hover:bg-opacity-15 px-1 cursor-pointer"
              >
                <p> {`Priority >`}</p>
                {showPriority && (
                  <ul className="top-0 right-0 absolute flex flex-col bg-secondary p-1 rounded-sm translate-x-full">
                    <li
                      onClick={() => {
                        updateTaskMutation.mutate({
                          taskId: element?.id,
                          updates: { priority: 3 },
                        });
                        setSelectNoteid("");
                        setShowpriority(false);
                      }}
                      className="hover:bg-neutral-dark p-[1px] rounded-sm text-green-500"
                    >
                      Low
                    </li>
                    <li
                      onClick={() => {
                        updateTaskMutation.mutate({
                          taskId: element?.id,
                          updates: { priority: 2 },
                        });
                        setSelectNoteid("");
                        setShowpriority(false);
                      }}
                      className="hover:bg-neutral-dark p-[1px] rounded-sm text-amber-400"
                    >
                      Medium
                    </li>
                    <li
                      onClick={() => {
                        updateTaskMutation.mutate({
                          taskId: element?.id,
                          updates: { priority: 1 },
                        });
                        setSelectNoteid("");
                        setShowpriority(false);
                      }}
                      className="hover:bg-neutral-dark p-[1px] rounded-sm text-red-400"
                    >
                      High
                    </li>
                  </ul>
                )}
              </div>
              <p
                onClick={() => setConfirm(true)}
                className="hover:bg-neutral hover:bg-opacity-15 px-1 text-red-400 cursor-pointer"
              >
                Delete
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Mostrar notas */}

      {element.notes && element.notes.length > 0 && (
        <Notes notes={element.notes} dashboard={dashboard} />
      )}
      <div className="flex justify-between pt-2 text-neutral-300 text-sm">
        {showAdd !== element.id ? (
          <div
            onClick={() => setShowAdd(element.id)}
            className="flex items-center gap-2 hover:bg-slate-500 p-1 rounded-md cursor-pointer"
          >
            <FaPlus />
            <p>Add Note</p>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-2 p-1">
            <textarea
              placeholder="Introduce your text..."
              className="bg-neutral-dark p-2 rounded-md w-[10rem] h-[4rem] text-start break-words text-wrap resize-none"
              value={notesContent[element.id] || ""}
              onChange={(event) =>
                handleNoteChange(element.id, event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  notesContent[element.id].trim() !== ""
                ) {
                  handleAddNote(element.id);
                  setNotesContent((prev) => ({ ...prev, [element.id]: "" }));
                }
              }}
            ></textarea>
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={() => {
                  handleAddNote(element.id);
                  setNotesContent((prev) => ({ ...prev, [element.id]: "" }));
                }}
                className="bg-neutral-dark hover:bg-secondary p-1 rounded-md"
              >
                Add Note
              </button>
              <RxCross1
                onClick={() => {
                  setShowAdd(null);
                  setNotesContent((prev) => ({ ...prev, [element.id]: "" }));
                }}
                className="hover:bg-neutral-dark p-1 rounded-md w-[1.5rem] h-[1.5rem]"
              />
            </div>
          </div>
        )}
      </div>
      {confirm && (
        <Modal>
          <Confirm
            onClose={() => setConfirm(false)}
            onConfirm={() => {
              if (!element.id) {
                console.error("Error: No note selected!");
                return;
              }
              if (dashboard && dashboard.id) {
                dispatch(
                  showNotification({
                    message: "Task Deleted",
                    type: "info",
                  })
                );
                deleteTaskMutation.mutate({
                  taskId: element.id,
                  dashboardId: dashboard.id,
                });
              }
            }}
            message="Are you sure you want to delete this note?"
          />
        </Modal>
      )}
    </li>
  );
};

export default TaskItem;
