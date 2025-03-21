import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { supabase } from "../../../lib/superbaseClient";
import { Notestype } from "../../../types/dashboard";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { capitalize } from "../../../Helps/capitalize";

interface Userinterface {
  id: string;
  nickname: string;
}

const fetchMembers = async (
  dashboardId: string,
  name: string
): Promise<Userinterface[]> => {
  if (!name.trim()) return [];

  const { data, error } = await supabase
    .from("dashboard_users")
    .select("user_id, users(id, nickname)")
    .eq("dashboard_id", dashboardId)
    .ilike("users.nickname", `%${name}%`);

  if (error) throw new Error(error.message);

  return data?.flatMap(({ users }) => users) || [];
};

const MemberNoteModal = ({
  onClose,
  currentNote,
}: {
  onClose: () => void;
  currentNote: Notestype | null;
}) => {
  const { did: dashboardId } = useParams();
  const [currentName, setCurrentname] = useState("");
  const [selectedUser, setSelectedUser] = useState<Userinterface | null>(null);
  const [searchedMemberss, setSearcherMemberss] = useState(false);

  const queryClient = useQueryClient();

  const addMemberMutation = useMutation({
    mutationFn: async () => {
      if (!currentNote?.id || !selectedUser) throw new Error("Invalid data");

      const { error } = await supabase
        .from("note_users")
        .insert({ note_id: currentNote.id, user_id: selectedUser.id });

      if (error) {
        if (error.code === "23505") {
          throw new Error("This user is already added to the note.");
        }
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["noteMembers", currentNote?.id],
      });
      setCurrentname("");
      setSelectedUser(null);
      onClose();
    },
  });

  // Query para buscar miembros
  const { data: searchMembers = [], refetch } = useQuery({
    queryKey: ["searchMembersNote", currentName],
    queryFn: () => fetchMembers(dashboardId || "", currentName),
    enabled: false,
  });

  return (
    <div className="relative flex flex-col items-center gap-1 bg-neutral-dark p-2 rounded-lg w-[18rem] h-[14rem]">
      <h1 className="mt-5 text-white">Add member</h1>
      <input
        type="text"
        placeholder="Search user"
        className="p-1 rounded-md outline-none w-3/4 text-neutral-dark"
        value={currentName}
        onChange={(event) => {
          setCurrentname(event.target.value);
          setSearcherMemberss(true);
          refetch();
        }}
      />
      {searchMembers.length > 0 && searchedMemberss && (
        <ul className="bg-secondary rounded-md w-3/4 max-h-[5rem] overflow-auto text-primary">
          {searchMembers?.map((elem: Userinterface, i) => (
            <li
              key={elem?.id + i}
              className="hover:bg-primary-dark hover:bg-opacity-30 px-1 cursor-pointer"
              onClick={() => {
                setSelectedUser(elem);
                setCurrentname(capitalize(elem?.nickname));
                setSearcherMemberss(false);
              }}
            >
              {elem?.nickname}
            </li>
          ))}
        </ul>
      )}
      {addMemberMutation.isError && (
        <p className="text-red-500 text-xs">
          {addMemberMutation.error.message}
        </p>
      )}
      <div
        onClick={onClose}
        className="top-1 right-1 absolute hover:bg-white hover:bg-opacity-15 rounded-full text-xl cursor-pointer"
      >
        <RxCross2 />
      </div>
      <div className="right-2 bottom-0 absolute flex gap-2 py-2">
        <button
          className={`px-2 rounded-lg text-neutral ${
            selectedUser
              ? "bg-primary-dark hover:bg-primary-light"
              : "bg-neutral-dark border-2 border-white cursor-not-allowed opacity-50"
          }`}
          disabled={!selectedUser || addMemberMutation.isPending}
          onClick={() => addMemberMutation.mutate()}
        >
          {addMemberMutation.isPending ? "Adding..." : "Add"}
        </button>
        <button
          className="bg-neutral-light px-2 rounded-lg text-neutral-dark"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MemberNoteModal;
