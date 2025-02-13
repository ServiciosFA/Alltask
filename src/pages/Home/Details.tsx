import { FaRegCircleCheck } from "react-icons/fa6";

const Details = () => {
  return (
    <div className="flex bg-neutral-dark py-10">
      <div className="flex flex-col bg-neutral-dark p-4 w-1/2 h-full text-neutral-light items">
        <h1 className="font-semibold text-primary text-2xl">
          Who Is This Platform For?
        </h1>
        <ul className="flex flex-col justify-around gap-2 mt-2 ml-2 h-[12rem] text-sm">
          <li className="flex gap-2">
            <FaRegCircleCheck className="text-primary text-lg"></FaRegCircleCheck>
            <p>
              <span className="pr-1 text-primary-light">Work teams</span>
              Companies, startups, and freelancers managing multiple projects.
            </p>
          </li>
          <li className="flex gap-2">
            <FaRegCircleCheck className="text-primary text-lg"></FaRegCircleCheck>
            <p>
              <span className="pr-1 text-primary-light">Study groups</span>
              Plan assignments, deadlines, and responsibilities efficiently.
            </p>
          </li>
          <li className="flex items-start gap-2">
            <FaRegCircleCheck className="text-primary text-lg"></FaRegCircleCheck>
            <p>
              <span className="pr-1 text-primary-light">
                Communities & organizations
              </span>
              Manage events, meetings, and activities with a structured system.
            </p>
          </li>
          <li className="flex items-center gap-2">
            <FaRegCircleCheck className="text-primary text-lg"></FaRegCircleCheck>
            <p>
              <span className="pr-1 text-primary-light">
                Developers & designers
              </span>
              Keep track of every project phase with well-defined tasks.
            </p>
          </li>
        </ul>
      </div>
      <div className="flex flex-col bg-neutral-dark p-4 w-1/2 text-neutral-light">
        <h1 className="font-semibold text-primary text-2xl">
          What Problems Does It Solve?
        </h1>
        <ul className="flex flex-col justify-around gap-2 mt-2 ml-2 h-[12rem] text-sm">
          <li className="flex gap-2">
            <FaRegCircleCheck className="text-primary text-lg"></FaRegCircleCheck>
            <p>
              <span className="pr-1 text-primary-light">
                Lack of clarity in projects
              </span>
              Assign tasks to each member with specific roles, ensuring everyone
              knows their responsibilities.
            </p>
          </li>
          <li className="flex gap-2">
            <FaRegCircleCheck className="text-primary text-lg"></FaRegCircleCheck>
            <p>
              <span className="pr-1 text-primary-light">
                Task management chaos
              </span>
              Organize everything into groups with clear lists of pending and
              completed tasks.
            </p>
          </li>
          <li className="flex items-start gap-2">
            <FaRegCircleCheck className="text-primary text-lg"></FaRegCircleCheck>
            <p>
              <span className="pr-1 text-primary-light">
                Difficulty tracking progress
              </span>
              Monitor the status of each task with real-time notifications and
              detailed statistics.
            </p>
          </li>
          <li className="flex items-center gap-2">
            <FaRegCircleCheck className="text-primary text-lg"></FaRegCircleCheck>
            <p>
              <span className="pr-1 text-primary-light">
                Communication issues
              </span>
              Teams can comment and update task statuses without relying on
              multiple external tools.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Details;
