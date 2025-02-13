import { Dashboard } from "../types/dashboard";

const NavbarDash = ({ currentDash }: { currentDash: Dashboard | null }) => {
  const members = [
    { id: "1", name: "Fernando" },
    { id: "2", name: "Lucia" },
    { id: "3", name: "Yutumaru" },
  ];
  return (
    <div className="flex justify-between items-center bg-neutral-dark bg-opacity-60 p-2 w-full">
      <div>
        <h1>{currentDash?.name}</h1>
      </div>
      <div className="flex items-center gap-5">
        <p>Filters</p>

        <ul className="flex justify-center items-center">
          {members.map((elem) => (
            <li key={elem.id}>
              <div className="bg-neutral-light -ml-2 border-2 border-neutral-dark rounded-full w-[2rem] h-[2rem] text-primary-dark text-center">
                <p className="text-lg">{elem.name.charAt(0).toUpperCase()}</p>
              </div>
              <></>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavbarDash;
