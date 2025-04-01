import { RxCross1 } from "react-icons/rx";
import CircleList from "../../../components/CircleList";
import { Comment, Notestype } from "../../../types/dashboard";
import CircleUser from "../../../components/CircleUser";
import { useState } from "react";
import { capitalize } from "../../../Helps/capitalize";
import { FiEdit3 } from "react-icons/fi";
import { supabase } from "../../../lib/superbaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Modal from "../../../components/Modal";
import MemberNoteModal from "./MemberNoteModal";
import Comments from "../Comments/Comments";
import { useParams } from "react-router-dom";
interface Userinterface {
  id: string;
  nickname: string;
}

const MembersNote = ({
  currentNote,
  close,
  members,
}: {
  currentNote: Notestype | null;
  close: () => void;
  members: Userinterface[];
}) => {
  const queryClient = useQueryClient();
  const [editNote, setEditNote] = useState(false);
  const [description, setDescription] = useState(
    currentNote?.description || ""
  );
  const [showAddMember, setShowAddMember] = useState(false);
  const [currentComment, setCurrentCommnet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { id: userId } = useParams();

  const updateNoteMutation = useMutation({
    mutationFn: async ({
      noteId,
      description,
    }: {
      noteId: string;
      description: string;
    }) => {
      const { error } = await supabase
        .from("notes")
        .update({ description })
        .eq("id", noteId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({
        queryKey: ["noteMembers", currentNote?.id],
      });

      setEditNote(false);
      if (currentNote) {
        currentNote.description = description;
      }
    },
  });

  const fetchComments = async (idNote: string): Promise<Comment[]> => {
    const { data, error } = await supabase
      .from("comments")
      .select(
        "id, text, created_at, user_id, note_id, users!inner(id, nickname)"
      )
      .eq("note_id", idNote)
      .order("created_at", { ascending: true })
      .returns<Comment[]>();

    if (error) throw new Error(error.message);
    return data;
  };

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", currentNote ? currentNote.id : ""],
    queryFn: () => fetchComments(currentNote ? currentNote.id : ""),
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({
      text,
      userId,
      noteId,
    }: {
      text: string;
      userId: string;
      noteId: string;
    }) => {
      setIsLoading(true); // Activa el estado de carga
      const { error } = await supabase.from("comments").insert([
        {
          text,
          user_id: userId,
          note_id: noteId,
        },
      ]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", currentNote?.id],
      });
      setCurrentCommnet("");
    },
    onSettled: () => {
      setIsLoading(false); // Desactiva el estado de carga
    },
  });

  return (
    <div className="relative bg-neutral-dark p-3 rounded-lg w-[30rem] h-[35rem]">
      <RxCross1
        onClick={close}
        className="top-3 right-3 absolute hover:bg-secondary-light p-1 rounded-full w-[1.5rem] h-[1.5rem] cursor-pointer"
      />
      <div className="flex flex-col gap-2 h-full">
        <div className="flex items-center gap-1 w-3/4">
          {editNote ? (
            <div className="w-full">
              <textarea
                className="bg-primary-dark p-2 rounded-lg outline-none w-3/4 h-[4rem] text-neutral text-xs resize-none"
                value={capitalize(description)}
                onChange={(event) => setDescription(event.target.value)}
              />
              <div className="flex gap-1 text-sm">
                <button
                  onClick={() =>
                    updateNoteMutation.mutate({
                      noteId: currentNote?.id || "",
                      description,
                    })
                  }
                  disabled={updateNoteMutation.isPending}
                  className="bg-primary-dark px-1 border-2 border-primary-dark hover:border-neutral rounded-lg text-neutral"
                >
                  {updateNoteMutation.isPending ? "Updating..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditNote(false);
                    setDescription(currentNote?.description || "");
                  }}
                  className="bg-neutral-light px-1 border-2 hover:border-secondary rounded-lg text-neutral-dark"
                >
                  Cancel
                </button>
              </div>
              {updateNoteMutation.isError && (
                <p className="text-red-500 text-xs">Error updating note.</p>
              )}
            </div>
          ) : (
            <p className="max-w-[22rem] text-primary-light text-base break-words cursor-default line-clamp">
              {capitalize(currentNote?.description || "")}
            </p>
          )}
          {!editNote && (
            <div
              onClick={() => setEditNote(true)}
              className="bg-secondary-light hover:bg-secondary m-1 p-1 rounded-full h-fit text-primary-light text-xl cursor-pointer"
            >
              <FiEdit3 className="text-sm" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-2 h-full">
          <div className="flex flex-col bg-secondary-light p-1 rounded-md w-full">
            <p className="text-primary text-base">Assigned members</p>
            <div className="flex p-2">
              <CircleList type="normal" members={members} />
              <div
                onClick={() => setShowAddMember(true)}
                className="flex items-center gap-1 hover:bg-primary-light p-[1px] rounded-full text-primary-dark hover:text-primary-light text-xs cursor-pointer"
              >
                <CircleUser word="+" type="normal" />
              </div>
            </div>
          </div>

          <h2 className="text-xl">Comments</h2>
          <div className="flex flex-col items-start gap-1">
            <textarea
              placeholder="Add a comment..."
              className="bg-primary-dark p-2 rounded-lg outline-none w-full h-[3rem] text-neutral text-xs resize-none"
              onChange={(event) => setCurrentCommnet(event.target.value)}
            />
            <button
              onClick={() => {
                if (currentNote?.id && userId && currentComment.trim()) {
                  addCommentMutation.mutate({
                    text: currentComment,
                    userId: userId,
                    noteId: currentNote.id,
                  });
                }
              }}
              className={`bg-neutral px-2 py-1 rounded-lg text-primary-dark text-sm ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Comment"}
            </button>
          </div>

          {comments.length === 0 ? (
            <div className="flex justify-center items-center bg-neutral bg-opacity-15 rounded-lg h-full text-primary">
              <p>There are no comments yet.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1 bg-neutral bg-opacity-15 p-2 rounded-lg h-[15rem] overflow-y-auto">
              {comments.map((comment: Comment) => (
                <Comments key={comment.id} comment={comment} />
              ))}
            </ul>
          )}
        </div>
      </div>
      {showAddMember && (
        <Modal>
          <MemberNoteModal
            currentNote={currentNote}
            onClose={() => setShowAddMember(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default MembersNote;
