import { Link, useNavigate } from "react-router-dom";
import fotoLogin from "../../assets/login.jpeg";
import { useDispatch } from "react-redux";
import { login } from "../../store/loginSlice";
import { useForm, SubmitHandler } from "react-hook-form";
import { supabase } from "../../lib/superbaseClient";
import { showNotification } from "../../store/notifiSlice";

type FormData = {
  user: string;
  email: string;
  password: string;
};

type UserResponse = {
  user: {
    id: string;
  } | null;
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const logUser = async (dataForm: FormData): Promise<UserResponse | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dataForm.email,
      password: dataForm.password,
    });

    if (error) {
      dispatch(
        showNotification({
          message: "Error logging in",
          type: "error",
        })
      );
      return null;
    }

    // 🔹 Se mantiene la consulta a la tabla users sin modificaciones
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError.message);
    }

    dispatch(login(userData));

    dispatch(
      showNotification({
        message: "User logged in",
        type: "success",
      })
    );

    navigate(`/user/${data.user.id}/dashboards`);
    return { user: userData || data.user };
  };

  const onSubmit: SubmitHandler<FormData> = async (dataForm) => {
    const response = await logUser(dataForm);

    if (response?.user?.id) {
      dispatch(login(response.user));
      navigate(`/user/${response.user.id}/dashboards`);
    } else {
      console.error("Login failed: No user ID received.");
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-primary-dark to-primary h-screen">
      <div className="relative bg-neutral-dark w-1/2">
        <img src={fotoLogin} className="w-full h-full" alt="Login" />
        <div className="z-1 absolute inset-0 bg-gray-800 bg-opacity-50"></div>
      </div>
      <div className="flex flex-col items-center gap-10 bg-gradient-to-r from-primary-dark to-primary-light w-1/2 h-full">
        <h1 className="self-start pt-10 pl-6 text-4xl">Welcome back!</h1>
        <div className="flex flex-col justify-center items-center bg-neutral-dark mt-10 p-6 rounded-md w-[28rem] h-[20rem]">
          <h1 className="pb-6 text-primary text-2xl">Login your account!</h1>
          <form
            className="flex flex-col w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col items-center gap-4">
              <input
                placeholder={errors.email ? errors.email?.message : "Email"}
                className={`p-2 rounded-md w-3/4 ${
                  errors.email ? "placeholder-red-500" : "text-neutral-dark"
                }`}
                type="text"
                {...register("email")}
              />

              <input
                placeholder={
                  errors.password ? errors.password?.message : "Password"
                }
                className={`p-2 rounded-md w-3/4 ${
                  errors.password ? "placeholder-red-500" : "text-neutral-dark"
                }`}
                type="password"
                {...register("password")}
              />
            </div>
            <p className="self-center mt-2 py-2 text-primary-light text-sm cursor-pointer">
              Forgot your password?
            </p>
            <div className="self-center">
              <button className="bg-neutral mt-4 py-1 rounded-lg w-[6rem] text-primary text-lg">
                Login
              </button>
            </div>
          </form>
          <p className="py-4 text-sm">
            Don't have an account?{" "}
            <span className="pl-1 text-primary-light cursor-pointer">
              <Link to="/signup"> Sign up for free</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
