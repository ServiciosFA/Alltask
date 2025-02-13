import { Notestype } from "../../types/dashboard";

const Notes = ({ notes }: { notes: Notestype[] }) => {
  return (
    <ul className="flex flex-col gap-2">
      {notes.map((element: Notestype) => (
        <li
          className="bg-black bg-opacity-60 p-1 rounded-md w-full h-full"
          key={element.id}
        >
          <p className="">
            {element.name.charAt(0).toUpperCase() +
              element.name.slice(1).toLowerCase()}
          </p>
          <p className="p-2 w-full text-xs break-words">
            {element.description}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default Notes;
