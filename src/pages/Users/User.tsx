import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { supabase } from "../../lib/superbaseClient";
import { RootState } from "../../store/store";
import { capitalize } from "../../Helps/capitalize";

// Función para obtener el perfil del usuario desde Supabase
const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, nickname, email, aboutme") // Seleccionamos solo los campos necesarios
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error en Supabase:", error.message);
    throw new Error("Error al obtener el perfil");
  }
  return data;
};

// Función para actualizar el perfil del usuario en Supabase
const updateUserProfile = async (
  userId: string,
  updates: { nickname: string; email: string; aboutme: string }
) => {
  console.log("Actualizando usuario:", userId, updates);
  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId);

  if (error) {
    console.error("Error al actualizar:", error.message);
    throw new Error("Error al actualizar el perfil");
  }
};

// Componente principal
const User = () => {
  const userId = useSelector((state: RootState) => state.login.id || "");
  const queryClient = useQueryClient();

  // Obtener usuario
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
  });

  // Mutación para actualizar usuario
  const mutation = useMutation({
    mutationFn: (updatedData: {
      nickname: string;
      email: string;
      aboutme: string;
    }) => updateUserProfile(userId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] }); // Refrescar datos después de actualizar
    },
  });

  // useForm de React Hook Form
  const {
    register,
    handleSubmit,

    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      nickname: user?.nickname || "",
      email: user?.email || "",
      aboutme: user?.aboutme || "",
    },
  });

  // Manejo del submit
  const onSubmit = async (formData: {
    nickname: string;
    email: string;
    aboutme: string;
  }) => {
    await mutation.mutateAsync(formData);
  };

  if (isLoading) return <p>Cargando perfil...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-4 h-full">
      <div className="flex gap-2">
        <div className="flex items-center gap-2 w-1/4">
          <div className="flex justify-center items-center bg-neutral p-2 rounded-full w-[3rem] h-[3rem] text-primary-dark text-2xl">
            <p>
              {user
                ? (
                    user?.nickname.charAt(0) + user?.nickname.charAt(1)
                  ).toUpperCase()
                : ""}
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <p>{capitalize(user?.nickname)}</p>
            <p className="text-neutral-400 text-xs">
              {user ? user?.email : ""}
            </p>
          </div>
        </div>
        {user?.aboutme && (
          <div className="flex flex-col gap-1 w-full text-xl">
            <h1 className="text-primary">About me</h1>
            <p className="text-xs">{capitalize(user.aboutme)}</p>
          </div>
        )}
      </div>
      <hr className="my-4" />
      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2 w-[25rem]">
          <div className="flex flex-col">
            <label className="text-primary" htmlFor="nickname">
              Nickname
            </label>
            <input
              id="nickname"
              className="p-1 rounded-md outline-none text-neutral-dark"
              {...register("nickname")}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-primary" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="p-1 rounded-md outline-none text-neutral-dark"
              {...register("email")}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-primary" htmlFor="about">
              About me
            </label>
            <textarea
              id="about"
              className="p-2 rounded-md outline-none text-neutral-dark resize-none"
              {...register("aboutme")}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-neutral-light hover:bg-primary-light mt-2 px-2 py-1 rounded-lg w-full text-neutral-dark"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default User;
