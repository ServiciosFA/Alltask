import { Link, useNavigate } from "react-router-dom";
import signup from "../../assets/signup.jfif";
import { SubmitHandler, useForm } from "react-hook-form";
import { supabase } from "../../lib/superbaseClient";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/notifiSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  type FormData = {
    user: string;
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const signUpUser = async (email: string, password: string, user: string) => {
    // Registrar usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname: user },
      },
    });

    if (error) {
      console.error("Error al registrar:", error.message);
      dispatch(
        showNotification({
          message: `Error al registrar: ${error.message}`,
          type: "error",
        })
      );
      return { error };
    }

    // Insertar manualmente en la tabla public.users
    const { error: userError } = await supabase.from("users").insert([
      {
        id: data.user?.id,
        email: email,
        nickname: user,
      },
    ]);

    if (userError) {
      console.error("Error al insertar en public.users:", userError.message);
      dispatch(
        showNotification({
          message: `Error al insertar en public.users: ${userError.message}`,
          type: "error",
        })
      );
      return { error: userError };
    }

    console.log("Usuario registrado e insertado en public.users:", data);
    dispatch(
      showNotification({
        message: "Usuario registrado con éxito",
        type: "success",
      })
    );
    navigate("/login");
    return { data };
  };

  const onSubmit: SubmitHandler<FormData> = async (dataForm) => {
    await signUpUser(dataForm.email, dataForm.password, dataForm.user);
  };

  return (
    <div className="flex flex-row-reverse bg-gradient-to-br from-primary-dark to-primary h-screen">
      {/* Imagen del lado derecho */}
      <div className="relative bg-neutral-dark w-1/2">
        <img src={signup} className="w-full h-full" alt="Signup" />
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50"></div>
      </div>

      {/* Formulario de registro */}
      <div className="flex flex-col justify-center items-center gap-10 bg-gradient-to-r from-primary-light to-primary-dark w-1/2 h-full">
        <div className="flex flex-col justify-center items-center bg-neutral-dark mt-10 p-6 rounded-md w-[28rem] h-[24rem]">
          <h1 className="py-6 text-primary text-2xl">Create an account!</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full"
          >
            <div className="flex flex-col items-center gap-4">
              <input
                {...register("user", { required: "User is required" })}
                placeholder={errors.user ? errors.user?.message : "User"}
                className={
                  errors.user
                    ? "p-2 rounded-md w-3/4 placeholder-red-500"
                    : "p-2 rounded-md w-3/4 text-neutral-dark "
                }
                type="text"
              />

              <input
                {...register("email", { required: "Email is required" })}
                placeholder={errors.email ? errors.email.message : "Email"}
                className={
                  errors.email
                    ? "p-2 rounded-md w-3/4 placeholder-red-500"
                    : "p-2 rounded-md w-3/4 text-neutral-dark "
                }
                type="email"
              />

              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: 6,
                })}
                placeholder={
                  errors.password ? errors?.password?.message : "Password"
                }
                className={
                  errors.password
                    ? "p-2 rounded-md w-3/4 placeholder-red-500"
                    : "p-2 rounded-md w-3/4 text-neutral-dark "
                }
                type="password"
              />
            </div>

            <button className="self-center bg-neutral mt-4 py-2 rounded-lg w-[6rem] text-primary text-lg">
              Signup
            </button>
          </form>

          <Link
            className="py-4 pl-1 text-primary-light text-sm cursor-pointer"
            to="/login"
          >
            Do you have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
