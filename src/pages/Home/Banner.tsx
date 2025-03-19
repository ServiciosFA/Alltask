import welcome from "../../assets/welcome.png";
const Banner = () => {
  return (
    <div className="flex gap-2 bg-gradient-to-tr from-secondary-light to-primary-dark">
      <div className="relative w-1/2">
        <img className="z-0 w-full h-full" src={welcome}></img>
        <div className="z-10 absolute inset-0 bg-secondary bg-opacity-30"></div>
      </div>

      <div className="flex flex-col self-center p-4 w-1/2 text-neutral">
        <h1 className="font-semibold text-neutral-light text-4xl">
          Welcome to AllTask
        </h1>
        <p className="mt-4 text-xl">
          This dashboard is designed for work teams, enabling efficient task
          management with different roles and responsibilities.
        </p>
        <br></br>
        <p className="text-lg">
          Is your team struggling with lost tasks and missed deadlines? Are
          responsibilities unclear and progress hard to track?
        </p>
        <p className="text-lg">
          This dashboard is the tool you need to efficiently manage group
          projects with clarity, structure, and ease.
        </p>
      </div>
    </div>
  );
};

export default Banner;
