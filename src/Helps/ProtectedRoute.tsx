import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

interface RootState {
  login: {
    isLogin: boolean;
  };
}

const ProtectedRoute = () => {
  const isLogin = useSelector((state: RootState) => state.login.isLogin);

  return isLogin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
