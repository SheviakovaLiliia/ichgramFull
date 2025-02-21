import { Navigate, Outlet } from "react-router-dom";
import { useAuthCheckQuery } from "../services/api";
import SidebarSkeleton from "../components/Skeletons/SidebarSkeleton";

export const ProtectedRoute = () => {
  const { data, isLoading, isFetching } = useAuthCheckQuery();

  if (isLoading || isFetching) return <SidebarSkeleton />;

  if (!data?.authenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};
