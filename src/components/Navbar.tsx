import { NavLink, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import logo from "../assets/logo.png";
import { FaUserCircle } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import MenuBar from "./MenuBar";
import { capitalize } from "../Helps/capitalize";

interface RootState {
  login: {
    isLogin: boolean;
    nickname: string;
    id: string;
  };
}

const Navbar = () => {
  const isLogin = useSelector((state: RootState) => state.login);
  const { id: userid } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex justify-between items-center gap-4 bg-secondary-light p-2 px-4 border-neutral border-y-[1px] w-full h-[3rem] font-roboto text-primary-light text-xl">
      {/* Logo */}
      <div className="flex justify-between items-center gap-1 w-1/2">
        <NavLink to="/" className="flex items-center gap-1">
          <img src={logo} className="w-[2rem] h-[2rem]" />
          <h1 className="text-3xl">ALLTASK</h1>
        </NavLink>
        {isLogin.isLogin && (
          <NavLink
            className="text-neutral-light hover:text-primary"
            to={`/user/${userid}/dashboards`}
          >
            Dashboards
          </NavLink>
        )}
      </div>

      {/* Menú de usuario */}
      <div className="relative flex justify-around items-center gap-4">
        {!isLogin.isLogin ? (
          <NavLink to="/login" className="flex items-center gap-2">
            <p className="text-2xl">Login</p>
            <CiLogin className="text-3xl" />
          </NavLink>
        ) : (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 focus:outline-none cursor-pointer"
            >
              <p className="text-neutral-light">
                {capitalize(isLogin?.nickname)}
              </p>
              <FaUserCircle className="text-3xl" />
            </button>

            {/* Menú desplegable */}
            {menuOpen && (
              <MenuBar userid={isLogin.id} setMenuOpen={setMenuOpen} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
