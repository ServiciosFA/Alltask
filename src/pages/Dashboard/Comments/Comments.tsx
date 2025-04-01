import { RiDeleteBinLine } from "react-icons/ri";
import CircleUser from "../../../components/CircleUser";
import { Comment } from "../../../types/dashboard";
import { FaRegEdit } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Confirm from "../../../components/Confirm";
import Modal from "../../../components/Modal";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/superbaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Comments = ({ comment }: { comment: Comment }) => {
  const { id: suerId } = useParams();
  const [deleteAction, setDeleteAction] = useState(false);
  const [currentComment, setCurrentcomment] = useState<Comment>();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const deleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);
    if (error) throw new Error(error.message);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] }); // Recargar lista de comentarios
      setDeleteAction(false);
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
    },
  });

  const updateComment = async (commentId: string, newText: string) => {
    const { error } = await supabase
      .from("comments")
      .update({ text: newText })
      .eq("id", commentId);
    if (error) throw new Error(error.message);
  };

  const updateMutation = useMutation({
    mutationFn: ({
      commentId,
      newText,
    }: {
      commentId: string;
      newText: string;
    }) => updateComment(commentId, newText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setIsEditing(false);
    },
    onError: (error) => console.error("Error updating comment:", error),
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      updateMutation.mutate({ commentId: comment.id, newText: editText });
    }
  };
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [isEditing, editText]);

  return (
    <li
      key={comment.id}
      className="relative flex flex-col gap-1 bg-primary bg-opacity-35 p-1 rounded-md w-full overflow-hidden"
    >
      <div className="flex justify-center gap-2 w-5/6">
        <CircleUser type="normal" word={comment?.users?.nickname} />
        <p className="max-w-[18rem] text-sm break-words whitespace-normal">
          {comment?.text}
        </p>
      </div>
      {isEditing && (
        <div>
          <textarea
            defaultValue={currentComment?.text}
            className="bg-neutral-dark bg-opacity-60 p-1 rounded-sm outline-none w-full h-[2rem] overflow-y-auto text-xs resize-none"
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown} // ⬅️ Guarda al presionar Enter
            autoFocus
            ref={textareaRef}
          ></textarea>
        </div>
      )}

      {suerId === comment.user_id && (
        <ul className="top-0 right-0 z-10 absolute flex gap-1 p-[2px] text-sm">
          <FaRegEdit
            className="bg-neutral-dark hover:bg-primary-dark bg-opacity-45 p-1 rounded-md w-[20px] h-[20px] cursor-pointer"
            onClick={() => {
              setCurrentcomment(comment);
              setIsEditing((prev) => !prev);
            }}
          />
          <RiDeleteBinLine
            className="bg-neutral-dark hover:bg-primary-dark bg-opacity-45 p-1 rounded-md w-[20px] h-[20px] cursor-pointer"
            onClick={() => {
              setCurrentcomment(comment);
              setDeleteAction(true);
            }}
          />
        </ul>
      )}
      {deleteAction && (
        <Modal>
          <Confirm
            message={"Are you sure you want to delete this comment?"}
            onClose={() => {
              setDeleteAction(false);
            }}
            onConfirm={() => {
              deleteMutation.mutate(comment.id);
              setDeleteAction(false);
            }}
          ></Confirm>
        </Modal>
      )}
    </li>
  );
};

export default Comments;
