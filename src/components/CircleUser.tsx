const CircleUser = ({
  word,
  type,
}: {
  word: string | undefined;
  type: string;
}) => {
  return (
    <div
      className={
        type === "small"
          ? "flex items-center justify-center bg-neutral-light border-2 border-neutral-dark rounded-full w-[1.5rem] h-[1.5rem] text-primary-dark text-center"
          : "bg-neutral-light border-2 border-neutral-dark rounded-full w-[2rem] h-[2rem] text-primary-dark text-center"
      }
    >
      <p className={type === "small" ? "text-xs" : "text-xl"}>
        {word?.charAt(0).toUpperCase()}
      </p>
    </div>
  );
};

export default CircleUser;
