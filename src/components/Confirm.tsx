import { RxCross1 } from "react-icons/rx";

const Confirm = ({
  message,
  onClose,
  onConfirm,
}: {
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <div className="relative flex justify-center bg-neutral-dark p-4 rounded-lg w-[16rem] h-[9rem]">
      <RxCross1
        onClick={onClose}
        className="top-1 right-1 absolute hover:bg-secondary-light p-1 rounded-full w-[1.5rem] h-[1.5rem] cursor-pointer"
      />
      <p className="py-2">{message}</p>
      <div className="right-2 bottom-0 absolute flex gap-2 py-2">
        <button
          onClick={onConfirm}
          className="bg-primary-dark px-2 rounded-lg text-neutral"
        >
          Delete
        </button>
        <button
          onClick={onClose}
          className="bg-neutral-light px-2 rounded-lg text-neutral-dark"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Confirm;
