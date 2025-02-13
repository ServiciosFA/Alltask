import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

import { FaUserCircle } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
const Navbar = () => {
  const isLogin = useSelector((state: RootState) => state.login.isLogin);
  return (
    <div className="flex justify-between items-center gap-4 bg-secondary-light p-2 px-4 border-neutral border-y-[1px] w-full h-[3rem] font-roboto text-primary-light text-xl">
      <NavLink to="/" className="flex items-center gap-1">
        <img src={logo} className="w-[2rem] h-[2rem]"></img>
        <h1 className="text-3xl">ALLTASK</h1>
      </NavLink>
      <div className="flex justify-around items-center gap-4">
        {!isLogin ? (
          <NavLink to="/login" className="flex items-center gap-2">
            <p className="text-2xl">Login</p>
            <CiLogin className="text-3xl" />
          </NavLink>
        ) : (
          <div className="flex items-center gap-2 cursor-pointer">
            <p className="text-neutral-light">Fernando</p>
            <FaUserCircle className="text-3xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
