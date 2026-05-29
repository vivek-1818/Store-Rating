import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../state/AuthContext";
import { UserRole } from "../types";

export default function ProtectedRoute({
  children,
  role
}: {
  children: ReactElement;
  role: UserRole;
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

