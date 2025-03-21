import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { Dashboard, Notestype } from "../../../types/dashboard";
import Modal from "../../../components/Modal";
import MembersNote from "./MembersNote";
import CircleList from "../../../components/CircleList";
import Confirm from "../../../components/Confirm";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/superbaseClient";
import { capitalize } from "../../../Helps/capitalize";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

interface Userinterface {
  id: string;
  nickname: string;
}

// 🔹 Función para obtener los miembros de una nota específica
const fetchNoteMembers = async (noteId: string): Promise<Userinterface[]> => {
  if (!noteId) return [];

  const { data, error } = await supabase
    .from("note_users")
    .select("users!inner(id, nickname)")
    .eq("note_id", noteId);

  if (error) throw new Error(error.message);

  // 🔹 Extraer los usuarios y aplanar el array
  return data?.map(({ users }) => users).flat() || [];
};

const Notes = ({
  notes,
  dashboard,
}: {
  notes: Notestype[];
  dashboard: Dashboard | undefined;
}) => {
  const [idNote, setIdnote] = useState<string | null>(null);
  const [currentNote, setCurrentnote] = useState<Notestype | null>(null);
  const [showModal, setShowmodal] = useState(false);
  const [confirm, setConfirm] = useState(false);

  // 🔹 Mutación para eliminar una nota
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", noteId);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      await queryClient.invalidateQueries({
        queryKey: ["taskLists", dashboard?.id].filter(Boolean),
      });
      await queryClient.invalidateQueries({
        queryKey: ["noteMembers", currentNote?.id],
      });

      setCurrentnote(null);
    },
  });

  // 🔹 Obtener miembros de todas las notas de una sola vez
  const membersQueries = useQueries({
    queries: notes.map((note) => ({
      queryKey: ["noteMembers", note.id],
      queryFn: () => fetchNoteMembers(note.id),
      enabled: !!note.id,
    })),
  });

  // 🔹 Crear un objeto para acceder a los miembros por noteId
  const membersMap = notes.reduce((acc, note, index) => {
    acc[note.id] = membersQueries[index].data || [];
    return acc;
  }, {} as Record<string, Userinterface[]>);

  const updateNoteStateMutation = useMutation({
    mutationFn: async ({ id, newState }: { id: string; newState: 1 | 2 }) => {
      const { error } = await supabase
        .from("notes")
        .update({ state: newState })
        .eq("id", id);

      if (error) throw new Error(error.message);
    },
    onMutate: async ({ id, newState }) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      // Guardar el estado previo por si hay un error
      const previousNotes = queryClient.getQueryData<Notestype[]>(["notes"]);

      // 🔹 Actualizar la UI antes de recibir respuesta del servidor (Optimistic Update)
      queryClient.setQueryData<Notestype[]>(
        ["notes"],
        (oldNotes = []) =>
          oldNotes
            .map((note) =>
              note.id === id ? { ...note, state: newState } : note
            )
            .sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            ) // Ordenar por fecha de creación
      );

      return { previousNotes };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: async () => {
      // 🔹 Forzar actualización para obtener los datos más recientes
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      await queryClient.invalidateQueries({ queryKey: ["taskLists"] }); // Opcional si depende de otras listas
    },
  });

  return (
    <ul className="flex flex-col gap-2">
      {notes.map((element) => (
        <li
          key={element.id}
          className="relative bg-black bg-opacity-60 p-1 rounded-md w-full h-full"
          onMouseOver={() => setIdnote(element.id)}
          onMouseLeave={() => setIdnote(null)}
          onClick={() => {
            setCurrentnote(element);
          }}
        >
          {/* Contenedor para abrir el modal al hacer clic en la nota */}
          <div
            className={
              element.state === 1
                ? "p-2 w-full text-xs break-words cursor-pointer "
                : "p-2 w-full text-xs break-words cursor-pointer line-through text-neutral-dark"
            }
          >
            {capitalize(element.description)}
          </div>

          {/* 🔹 Mostrar los miembros de la nota */}
          <CircleList type="small" members={membersMap[element.id]} />

          {/* Botones de acción (editar/eliminar) */}
          {idNote === element.id && (
            <ul className="top-0 right-0 z-10 absolute flex gap-1 p-[2px] text-sm">
              <FaRegEdit
                className="bg-neutral-dark hover:bg-primary-dark p-1 rounded-md w-[20px] h-[20px]"
                onClick={() => {
                  setCurrentnote(element);
                  setShowmodal(true);
                }}
              />
              <RiDeleteBinLine
                className="bg-neutral-dark hover:bg-primary-dark p-1 rounded-md w-[20px] h-[20px]"
                onClick={() => {
                  setCurrentnote(element);
                  setConfirm(true);
                }}
              />
            </ul>
          )}
          <div className="right-[1px] bottom-[1px] absolute rounded-full w-5 h-5 overflow-hidden text-xl">
            <IoCheckmarkDoneCircle
              className={
                element.state === 1
                  ? `bg-neutral-dark hover:bg-neutral-light text-black`
                  : `bg-primary-light hover:bg-neutral-dark text-black`
              }
              onClick={() => {
                updateNoteStateMutation.mutate({
                  id: element?.id,
                  newState: element.state === 1 ? 2 : 1,
                });
              }}
            />
          </div>
        </li>
      ))}

      {/* Modal de edición */}
      {showModal && (
        <Modal>
          <MembersNote
            currentNote={currentNote}
            close={() => setShowmodal(false)}
            members={membersMap[currentNote?.id || ""] || []}
          />
        </Modal>
      )}

      {/* Modal de confirmación */}
      {confirm && (
        <Modal>
          <Confirm
            onClose={() => setConfirm(false)}
            onConfirm={() => {
              if (!currentNote) {
                console.error("Error: No note selected!");
                return;
              }

              deleteNoteMutation.mutate(currentNote.id, {
                onSuccess: () => {
                  setConfirm(false);
                  console.log("Note deleted successfully!");
                },
              });
            }}
            message="Are you sure you want to delete this note?"
          />
        </Modal>
      )}
    </ul>
  );
};

export default Notes;
