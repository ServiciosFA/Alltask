import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearNotification } from "../store/notifiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Notification = () => {
  const { message, type } = useSelector(
    (state: RootState) =>
      state.notify as {
        message: string;
        type: "success" | "error" | "info" | "warning";
      }
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      const toastId = `notification-${type}`; // Un ID único por tipo

      // Evita que se repitan notificaciones del mismo tipo
      if (!toast.isActive(toastId)) {
        if (type !== null)
          toast[type](message, {
            toastId, // Usa el ID para evitar duplicados
            autoClose: 3000,
            onClose: () => dispatch(clearNotification()), // Limpia la notificación al cerrar
          });
      }
    }
  }, [message, type, dispatch]);

  return null;
};

export default Notification;
