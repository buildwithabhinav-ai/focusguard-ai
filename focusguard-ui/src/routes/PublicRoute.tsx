import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import type { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({
  children,
}: PublicRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">
          Loading...
        </p>
      </div>
    );
  }

  if (user) {
    switch (user.role) {
      case "SUPER_ADMIN":
        return (
          <Navigate
            to="/superadmin/dashboard"
            replace
          />
        );

      case "SUB_ADMIN":
        return (
          <Navigate
            to="/subadmin/dashboard"
            replace
          />
        );

      case "USER":
        return (
          <Navigate
            to="/user/dashboard"
            replace
          />
        );

      default:
        return (
          <Navigate
            to="/login"
            replace
          />
        );
    }
  }

  return <>{children}</>;
};

export default PublicRoute;