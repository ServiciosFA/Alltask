import { Link } from "react-router-dom";
import signup from "../../assets/signup.jfif";

const Signup = () => {
  return (
    <div className="flex flex-row-reverse bg-gradient-to-br from-primary-dark to-primary h-screen">
      <div className="relative bg-neutral-dark w-1/2">
        <img src={signup} className="w-full h-full"></img>
        <div className="z-1 absolute inset-0 bg-gray-800 bg-opacity-50"></div>
      </div>
      <div className="flex flex-col justify-center items-center gap-10 bg-gradient-to-r from-primary-light to-primary-dark w-1/2 h-full">
        <div className="flex flex-col justify-center items-center bg-neutral-dark mt-10 p-6 rounded-md w-[28rem] h-[22rem]">
          <h1 className="py-6 text-2xl text-primary">Create an account!</h1>
          <form className="flex flex-col w-full">
            <div className="flex flex-col items-center gap-4">
              <input
                placeholder="User"
                className="p-1 rounded-md w-3/4 text-neutral-dark"
                type="text"
              ></input>
              <input
                placeholder="Email"
                className="p-1 rounded-md w-3/4 text-neutral-dark"
                type="email"
              ></input>
              <input
                placeholder="Password"
                className="p-1 rounded-md w-3/4 text-neutral-dark"
                type="text"
              ></input>
            </div>

            <button className="bg-neutral mt-4 py-1 rounded-lg w-[6rem] text-lg text-primary self-center">
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
