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
            setShowmodal(true);
          }}
        >
          {/* Contenedor para abrir el modal al hacer clic en la nota */}
          <div className="p-2 w-full text-xs break-words cursor-pointer">
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
