import { Link } from "react-router-dom";
import fotoLogin from "../../assets/login.jpeg";
import { useDispatch } from "react-redux";
import { login } from "../../store/loginSlice";
import { useForm, SubmitHandler } from "react-hook-form";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    console.log(data);
    dispatch(login());
  };

  return (
    <div className="flex bg-gradient-to-br from-primary-dark to-primary h-screen">
      <div className="relative bg-neutral-dark w-1/2">
        <img src={fotoLogin} className="w-full h-full"></img>
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
                placeholder="Email"
                className="p-1 rounded-md w-3/4 text-neutral-dark"
                type="text"
                {...register("email")}
              ></input>
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
              <input
                placeholder="Password"
                className="p-1 rounded-md w-3/4 text-neutral-dark"
                type="password"
                {...register("password")}
              ></input>
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
            <p className="self-center mt-2 py-2 text-primary-light text-sm cursor-pointer">
              Forgot your password?
            </p>
            <Link
              onClick={() => dispatch(login())}
              className="self-center"
              to="/dashboards"
            >
              <button className="bg-neutral mt-4 py-1 rounded-lg w-[6rem] text-primary text-lg">
                Login
              </button>
            </Link>
          </form>
          <p className="py-4 text-sm">
            Don't have an account?{" "}
            <span className="pl-1 text-primary-light cursor-pointer">
              <Link to="/signup"> Sing up from free</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
