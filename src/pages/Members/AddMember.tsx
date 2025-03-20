import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/superbaseClient";
import { User } from "../../types/dashboard";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/notifiSlice";

const fetchMembers = async (name: string) => {
  if (!name.trim()) return [];
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .like("nickname", `%${name}%`);

  if (error) throw new Error(error.message);
  return data || [];
};

const AddMember = ({
  onClose,
  userRol,
}: {
  onClose: () => void;
  userRol: string;
}) => {
  const dispatch = useDispatch();
  const [currentName, setCurrentName] = useState("");
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const { did: dashboardId } = useParams(); // Obtiene el ID del dashboard desde la URL

  // Hook para la búsqueda de usuarios
  const { data: searchMembers = [], refetch } = useQuery({
    queryKey: ["searchMembersDashboard", currentName],
    queryFn: () => fetchMembers(currentName),
    enabled: false, // Solo ejecuta cuando se llame manualmente con `refetch`
  });

  // Hook para agregar usuario al dashboard
  const addMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!dashboardId) throw new Error("Dashboard ID not found!");
      if (userRol !== "admin") throw new Error("You are not admin");
      const { data: existingMember, error: checkError } = await supabase
        .from("dashboard_users")
        .select("*")
        .eq("user_id", userId)
        .eq("dashboard_id", dashboardId)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        throw new Error(checkError.message);
      }
      if (existingMember) {
        throw new Error("This user is already in the dashboard!");
      }

      const { error: insertError } = await supabase
        .from("dashboard_users")
        .insert([
          {
            user_id: userId,
            dashboard_id: dashboardId,
            role: "member",
          },
        ]);

      if (insertError) {
        throw new Error(insertError.message);
        dispatch(
          showNotification({ message: "insertError.message", type: "error" })
        );
      }
    },
    onSuccess: () => {
      if (dashboardId) {
        queryClient.invalidateQueries({
          queryKey: ["dashboard_users", String(dashboardId)],
        });
        queryClient.invalidateQueries({
          queryKey: ["members", String(dashboardId)],
        });
      }
      dispatch(showNotification({ message: "Member Added", type: "success" }));
      onClose();
    },
  });

  return (
    <div className="relative flex flex-col items-center gap-1 bg-neutral-dark p-2 rounded-lg w-[18rem] h-[12rem]">
      <h1 className="mt-5 text-white">Add member</h1>
      <input
        type="text"
        placeholder="Search user"
        className="p-1 rounded-md outline-none w-3/4 text-neutral-dark"
        value={currentName}
        onChange={(event) => {
          setCurrentName(event.target.value);
          if (event.target.value !== "") {
            refetch(); // Ejecuta la búsqueda manualmente
          }
        }}
      />
      {searchMembers.length > 0 && (
        <ul className="z-10 bg-secondary rounded-md w-3/4 max-h-[5rem] overflow-auto text-primary">
          {searchMembers?.map((elem) => (
            <li
              key={elem?.id}
              className="hover:bg-primary-dark hover:bg-opacity-30 px-1 cursor-pointer"
              onClick={() => {
                setSelectedMember(elem);
                setCurrentName(elem?.nickname);
              }}
            >
              {elem?.nickname}
            </li>
          ))}
        </ul>
      )}
      <div className="top-1 right-1 absolute hover:bg-white hover:bg-opacity-15 rounded-full text-xl cursor-pointer">
        <RxCross2 onClick={onClose} />
      </div>
      <div className="right-2 bottom-0 absolute flex gap-2 py-2">
        <button
          disabled={!selectedMember || addMemberMutation.isPending}
          onClick={() =>
            selectedMember && addMemberMutation.mutate(selectedMember.id)
          }
          className={`px-2 rounded-lg text-neutral ${
            selectedMember
              ? "bg-primary-dark hover:bg-primary-light"
              : "bg-neutral-dark border-2 border-white"
          }`}
        >
          {addMemberMutation.isPending ? "Adding..." : "Add"}
        </button>
        <button
          onClick={onClose}
          className="bg-neutral-light px-2 rounded-lg text-neutral-dark"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddMember;
