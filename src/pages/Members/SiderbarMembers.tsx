import { useState } from "react";
import { User } from "../../types/dashboard";
import { Link, useParams } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import Modal from "../../components/Modal";
import SearchUser from "./AddMember";
import { supabase } from "../../lib/superbaseClient";
import { useQuery } from "@tanstack/react-query";
import { capitalize } from "../../Helps/capitalize";

interface SidebarMembersProps {
  dashboardId: string | null; // Dashboard seleccionado
}

// Función para obtener los miembros del dashboard
const fetchMembers = async (dashboardId: string | null): Promise<User[]> => {
  if (!dashboardId) return []; // Si no hay dashboard, devuelve un array vacío

  // Obtener los user_id desde dashboard_users filtrando por dashboard_id
  const { data: dashboardUsers, error: errorDashboard } = await supabase
    .from("dashboard_users")
    .select("user_id")
    .eq("dashboard_id", dashboardId);

  if (errorDashboard) throw new Error(errorDashboard.message);
  if (!dashboardUsers || dashboardUsers.length === 0) return [];

  const userIds = dashboardUsers.map((entry) => entry.user_id);

  // Obtener los datos de los usuarios en users
  const { data: users, error: errorUsers } = await supabase
    .from("users")
    .select("*")
    .in("id", userIds);

  if (errorUsers) throw new Error(errorUsers.message);

  return users || [];
};

const SidebarMembers = ({ dashboardId }: SidebarMembersProps) => {
  const [idMember, setIdMember] = useState("");
  const [showModalMember, setShowModalMember] = useState(false);
  const { id: idLoguser } = useParams();

  // Obtener rol del usuario
  const { data: userRole } = useQuery({
    queryKey: ["userRole", idLoguser, dashboardId],
    queryFn: async () => {
      if (!idLoguser || !dashboardId) return null;
      const { data, error } = await supabase
        .from("dashboard_users")
        .select("role")
        .eq("user_id", idLoguser)
        .eq("dashboard_id", dashboardId)
        .single();

      if (error) return null;
      return data?.role;
    },
    enabled: !!idLoguser && !!dashboardId,
  });

  // React Query para obtener los miembros
  const {
    data: members = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["members", dashboardId], // Se invalida cuando cambia el dashboard
    queryFn: () => fetchMembers(dashboardId),
    enabled: !!dashboardId, // Solo ejecuta la consulta si hay un dashboard seleccionado
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });

  if (isLoading) return <p>Loading members...</p>;
  if (error) return <p>Error loading members: {error.message}</p>;

  return (
    <>
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-lg">Members</h1>
        {userRole === "admin" && (
          <CiCirclePlus
            onClick={() => setShowModalMember(true)}
            className="hover:text-primary-light text-2xl cursor-pointer"
          />
        )}
      </div>
      <ul className="flex flex-col gap-1 p-2 w-[12rem] h-1/4 overflow-y-auto">
        {members.map((element: User) => (
          <Link
            key={element.id}
            to={`member/${element.id}`}
            state={{ element, dashboardId: dashboardId }}
            className={`flex items-center gap-2 text-sm cursor-pointer p-1 ${
              idMember === element.id ? "bg-neutral-dark rounded-lg" : ""
            }`}
            onMouseOver={() => {
              setIdMember(element.id);
            }}
            onMouseLeave={() => setIdMember("")}
          >
            <div className="flex justify-center items-center bg-neutral-light rounded-full w-[1.5rem] h-[1.5rem] font-semibold text-secondary">
              <p>{element.nickname.charAt(0).toUpperCase()}</p>
            </div>
            <p className="max-w-[7rem] text-neutral truncate">
              {capitalize(element.nickname)}
            </p>
          </Link>
        ))}
      </ul>
      {showModalMember && (
        <Modal>
          <SearchUser
            userRol={userRole}
            onClose={() => setShowModalMember(false)}
          />
        </Modal>
      )}
    </>
  );
};

export default SidebarMembers;
