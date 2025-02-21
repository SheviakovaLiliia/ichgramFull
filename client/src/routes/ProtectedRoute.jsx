import { Navigate, Outlet } from "react-router-dom";
import { useAuthCheckQuery } from "../services/api";

export const ProtectedRoute = () => {
  const { data, isLoading, isFetching } = useAuthCheckQuery();

  if (isLoading || isFetching)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="loaderS"></div>
      </div>
    );

  if (!data?.authenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};
