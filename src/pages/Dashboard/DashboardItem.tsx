import { useLocation } from "react-router-dom";
import NavbarDash from "../../components/NavbarDash";
import { Dashboard, TaskList } from "../../types/dashboard";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { CiImageOn } from "react-icons/ci";
import Notes from "./Notes";
import { BsThreeDots } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";

const DashboardItem = () => {
  const location = useLocation();
  const dashboard: Dashboard | undefined = location.state;
  const [listTask, setListtask] = useState<TaskList[]>([]);
  const [showAdd, setShowAdd] = useState("");
  const textareaRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    setListtask([
      {
        id: "1",
        name: "Lista de tareas",
        notes: [
          { id: "1", name: "banner", description: "Realizar banner" },
          { id: "2", name: "navbar", description: "Realizar navbar" },
          { id: "3", name: "navbar", description: "Responsive navbar" },
        ],
      },
      {
        id: "2",
        name: "En proceso",
        notes: [
          { id: "4", name: "Homepage", description: "Realizar Home page" },
          {
            id: "5",
            name: "Homepage",
            description:
              "Responsive Home page mobile,tablet, notebook & desktop",
          },
          { id: "6", name: "Footer", description: "Realizar footer" },
        ],
      },
      {
        id: "31",
        name: "Hecho",
        notes: [
          { id: "7", name: "Login", description: "Realizar diseño login" },
          { id: "8", name: "Signin", description: "Realizar diseño signing" },
          {
            id: "9",
            name: "controles formularios",
            description: "Realizar controles en formularios",
          },
        ],
      },
    ]);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowAdd("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-gradient-to-tr from-primary-dark to-primary w-full h-full overflow-auto">
      <NavbarDash currentDash={dashboard ? dashboard : null} />
      <ul className="flex gap-6 p-4">
        {listTask.map((element) => (
          <li
            className="flex flex-col bg-neutral-dark bg-opacity-60 p-2 rounded-lg w-[15rem] h-full cursor-pointer"
            key={element.id}
            ref={textareaRef}
          >
            <div className="flex justify-between items-center">
              <p>{element.name}</p>
              <BsThreeDots className="flex items-center hover:bg-slate-500 p-1 rounded-md text-xl cursor-pointer" />
            </div>
            <Notes notes={element.notes} />
            <div className="flex justify-between pt-2 text-neutral-300 text-sm">
              {showAdd !== element.id ? (
                <div
                  onClick={() => setShowAdd(element.id)}
                  className="flex items-center gap-2 hover:bg-slate-500 p-1 rounded-md cursor-pointer"
                >
                  <FaPlus />
                  <p>Add Card</p>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-2 p-1">
                  <textarea
                    placeholder="Introduce your text..."
                    className="bg-neutral-dark p-2 rounded-md w-[10rem] h-[4rem] text-start break-words text-wrap resize-none"
                  ></textarea>
                  <div className="flex items-center gap-2 w-full">
                    <button className="bg-neutral-dark hover:bg-secondary p-1 rounded-md">
                      Add Card
                    </button>
                    <RxCross1 className="hover:bg-neutral-dark p-1 rounded-md w-[1.5rem] h-[1.5rem]" />
                  </div>
                </div>
              )}
              <div className="flex items-center hover:bg-slate-500 p-2 rounded-md h-fit cursor-pointer">
                <CiImageOn />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardItem;
