import { Navigate, useLocation } from "react-router-dom";

import { getCookie } from "@/middleware/getCookie";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const userRole = getCookie("role_name");
  const location = useLocation();

  if (!userRole) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
