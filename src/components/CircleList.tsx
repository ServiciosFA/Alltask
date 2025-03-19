import CircleUser from "./CircleUser";

interface Userinterface {
  id: string;
  nickname: string;
}

const CircleList = ({
  members,
  type,
}: {
  members: Userinterface[] | undefined;
  type: string;
}) => {
  return (
    <ul
      className={
        type === "small" ? "flex items-center pl-2" : "flex items-center"
      }
    >
      {members?.map((elem: Userinterface, i) => (
        <li className="cursor-pointer" key={elem.id + i}>
          <div className={type === "small" ? "-ml-2" : "-ml-2"}>
            <CircleUser word={elem.nickname} type={type} />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CircleList;
