import { ReactNode } from "react";

const Modal = ({ children }: { children: ReactNode }) => {
  return (
    <div className="z-20 fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 w-screen h-screen cursor-auto">
      {children}
    </div>
  );
};

export default Modal;
