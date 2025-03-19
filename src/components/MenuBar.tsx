import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deslogin } from "../store/loginSlice";
import { showNotification } from "../store/notifiSlice";

const MenuBar = ({
  userid,
  setMenuOpen,
}: {
  userid: string | null;
  setMenuOpen: (value: boolean) => void;
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="top-full right-0 z-50 absolute bg-neutral-dark shadow-lg mt-2 p-2 rounded-lg w-[10rem] text-base">
      <Link
        to={`/user/${userid}`}
        onClick={() => setMenuOpen(false)}
        className="block hover:bg-neutral-light px-4 py-2 rounded-md text-primary"
      >
        Profile
      </Link>
      <Link
        to={`/user/${userid}/dashboards`}
        onClick={() => setMenuOpen(false)}
        className="block hover:bg-neutral-light px-4 py-2 rounded-md text-primary"
      >
        Dashboards
      </Link>
      <Link
        to="/settings"
        onClick={() => setMenuOpen(false)}
        className="block hover:bg-neutral-light px-4 py-2 rounded-md text-primary"
      >
        Settings
      </Link>
      <button
        className="hover:bg-neutral-light px-4 py-2 rounded-md w-full text-red-400 text-left"
        onClick={() => {
          dispatch(deslogin());
          dispatch(
            showNotification({
              message: "User Logout",
              type: "info",
            })
          );
          navigate("/");
          setMenuOpen(false);
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default MenuBar;
