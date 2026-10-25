import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({
  children,
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">
          Loading...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const path =
    location.pathname;

  if (
    user.role === "SUPER_ADMIN" &&
    !path.startsWith("/superadmin")
  ) {
    return (
      <Navigate
        to="/superadmin/dashboard"
        replace
      />
    );
  }

  if (
    user.role === "SUB_ADMIN" &&
    !path.startsWith("/subadmin")
  ) {
    return (
      <Navigate
        to="/subadmin/dashboard"
        replace
      />
    );
  }

  if (
    user.role === "USER" &&
    !path.startsWith("/user")
  ) {
    return (
      <Navigate
        to="/user/dashboard"
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;