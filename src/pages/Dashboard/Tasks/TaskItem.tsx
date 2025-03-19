import { BsThreeDots } from "react-icons/bs";
import Notes from "../Notes/Notes";
import { RxCross1 } from "react-icons/rx";
import { CiImageOn } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import { Dashboard, TaskList } from "../../../types/dashboard";
import { FaPlus } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/superbaseClient";

const TaskItem = ({
  element,
  setListtask,
  dashboard,
}: {
  element: TaskList;
  setListtask: React.Dispatch<React.SetStateAction<TaskList[]>>;
  dashboard: Dashboard | undefined;
}) => {
  const [showAdd, setShowAdd] = useState<string | null>(null);
  const [notesContent, setNotesContent] = useState<{ [key: string]: string }>(
    {}
  );
  const listRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  const queryClient = useQueryClient();

  const handleNoteChange = (id: string, value: string) => {
    setNotesContent((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

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
        .insert([{ description, task_list_id: taskId }])
        .select()
        .single();

      if (noteError) throw new Error(noteError.message);

      return noteData;
    },
    onSuccess: (newNote) => {
      // Actualizar la lista de tareas para incluir la nueva nota
      setListtask((prev) =>
        prev.map((task) =>
          task.id === newNote.task_id
            ? { ...task, notes: [...(task.notes || []), newNote] }
            : task
        )
      );

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
  const handleAddNote = (taskId: string) => {
    if (!notesContent[taskId]?.trim()) return;
    addNoteMutation.mutate({ taskId, description: notesContent[taskId] });
  };

  useEffect(() => {
    if (dashboard?.taskLists) {
      setListtask(dashboard.taskLists);
    }

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
  }, [dashboard?.taskLists, setListtask, showAdd]);

  return (
    <li
      className="relative flex flex-col justify-between gap-2 bg-neutral-dark bg-opacity-60 p-2 rounded-lg w-[15rem] h-fit max-h-[20rem] cursor-pointer"
      key={element.id}
      ref={(el) => (listRefs.current[element.id] = el)}
    >
      <div className="flex justify-between items-center">
        <p>{element.name}</p>
        <BsThreeDots className="flex items-center hover:bg-slate-500 p-1 rounded-md text-xl cursor-pointer" />
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
        <div className="flex items-center hover:bg-slate-500 p-2 rounded-md h-fit cursor-pointer">
          <CiImageOn />
        </div>
      </div>
    </li>
  );
};

export default TaskItem;
