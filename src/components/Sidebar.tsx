import { useState } from "react";
import { Dashboard } from "../types/dashboard";
import { Link } from "react-router-dom";

const Sidebar = ({ setDash }: { setDash: (dashboard: Dashboard) => void }) => {
  const [idDashboard, setidDashboard] = useState("");
  const dashboards = [
    { id: "1", name: "Agilestrat" },
    { id: "2", name: "Trabajo Listo" },
    { id: "3", name: "Media Player" },
    { id: "4", name: "Chatapp" },
    { id: "5", name: "Facebook" },
    { id: "6", name: "Instagram" },
    { id: "7", name: "Twitter" },
    { id: "8", name: "Udemy" },
    { id: "9", name: "Youtube" },
    { id: "10", name: "Restaurant" },
  ];
  const members = [
    { id: "1", name: "Fernando" },
    { id: "2", name: "Lucia" },
    { id: "3", name: "Yutumaru" },
  ];
  return (
    <div className="flex flex-col gap-1 bg-gradient-to-b from-secondary to-secondary-light p-4 border-r-[1px] w-1/5 max-h-full">
      <h1 className="mb-2 text-xl">DashBoards</h1>
      <ul className="flex flex-col gap-2 custom-scrollbar w-[12rem] h-3/2 overflow-y-auto text-primary">
        {dashboards.map((element: Dashboard) => (
          <Link
            to={`${element.id}`}
            state={element}
            onClick={() => {
              setidDashboard(element?.id);
              setDash(element);
            }}
            className={
              idDashboard === element.id
                ? `flex gap-2 pl-2 cursor-pointer  mx-1  bg-opacity-30 bg-neutral py-1 rounded-md`
                : `flex gap-2 pl-2 cursor-pointer py-1  mx-1`
            }
            key={element.id}
          >
            <div
              className={`bg-neutral rounded-full w-[1.5rem] h-[1.5rem] text-center text-primary-dark font-semibold`}
            >
              <p>{element.name.charAt(0).toUpperCase()}</p>
            </div>
            <p className="hover:text-primary-light">{element.name}</p>
          </Link>
        ))}
      </ul>
      <hr></hr>
      <h1 className="text-lg">Members</h1>
      <ul className="flex flex-col gap-1 p-2 w-[12rem] h-1/4 overflow-y-auto">
        {members.map((element: Dashboard) => (
          <li className="flex items-center gap-2 text-sm" key={element.id}>
            <div className="flex justify-center items-center bg-neutral-light rounded-full w-[1.5rem] h-[1.5rem] font-semibold text-secondary">
              <p>{element.name.charAt(0).toUpperCase()}</p>
            </div>
            <p className="text-neutral">{element.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
