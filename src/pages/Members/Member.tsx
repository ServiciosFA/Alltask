import { useLocation } from "react-router-dom";
import { User } from "../../types/dashboard";

const Member = () => {
  const location = useLocation();
  const member: User = location.state;
  return (
    <div className="flex flex-col gap-2 bg-gradient-to-tr from-primary-dark to-secondary p-4 w-full h-full">
      <p className="text-4xl">{member.nickname}</p>
      <p className="mt-6 text-2xl">Assigned Notes</p>
      <ul className="flex flex-col gap-3 p-4">
        {/*member.assignedNotes.map((note, i) => (
          <li
            className="flex-col flex- bg-neutral bg-opacity-30 p-2 rounded-lg w-1/3 text-base"
            key={i}
          >
            <p className="text-lg">{note}</p>
            <p className="pl-4 text-sm">Descripcion</p>
          </li>
        ))*/}
      </ul>
    </div>
  );
};

export default Member;
