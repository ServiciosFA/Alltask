import { Link } from "react-router-dom";
import Banner from "./Banner";
import Details from "./Details";
import { WiStars } from "react-icons/wi";
import cardTasks from "../../assets/cardtasks.png";

const Home = () => {
  return (
    <div className="bg-neutral-dark custom-scrollbar max-h-full overflow-y-scroll">
      <Banner />
      <Details />
      <div className="flex flex-col w-full">
        <ul className="bg-primary-dark py-4">
          <div className="flex justify-around py-6">
            <div className="flex flex-col gap-2">
              <li className="flex gap-2">
                <WiStars className="text-accent text-2xl" />
                <p>
                  Modern and intuitive interface with emerald tones for a
                  pleasant experience.
                </p>
              </li>
              <li className="flex gap-2">
                <WiStars className="text-accent text-2xl" />
                <p>
                  Efficient task management with role-based assignments and
                  advanced filters.
                </p>
              </li>
            </div>
            <div className="flex flex-col gap-2">
              <li className="flex gap-2">
                <WiStars className="text-accent text-2xl" />
                <p>Dashboard with insights to visualize team performance.</p>
              </li>
              <li className="flex gap-2">
                <WiStars className="text-accent text-2xl" />
                <p>Notifications and reminders so no task gets overlooked.</p>
              </li>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <img
              src={cardTasks}
              className="shadow-md m-4 rounded-xl w-3/4 h-3/4"
            ></img>
          </div>
        </ul>
        <div className="flex justify-between items-center bg-neutral-dark px-6 py-4">
          <h1 className="">
            Optimize your organization, enhance collaboration, and take your
            projects to the next level with this platform. It’s time to work
            smarter!
          </h1>
          <Link
            className="bg-neutral-light px-2 py-1 rounded-xl w-[5rem] text-primary-dark text-center cursor-pointer"
            to="/login"
          >
            {`Login >>`}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
