import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();

  const location = useLocation();

  useEffect(() => {
  }, [auth.logged]);

  if (auth.logged == null) {
    return;
  }

  return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.logged ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
