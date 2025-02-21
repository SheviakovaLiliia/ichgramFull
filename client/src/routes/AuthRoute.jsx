import { Navigate, Outlet } from "react-router-dom";

export const AuthRoute = () => {
  const loggedIn = localStorage.getItem("isLoggedIn");

  if (loggedIn === "t") return <Navigate to="/" replace />;

  return <Outlet />;
};
