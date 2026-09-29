import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth.jsx";
import PageLoader from "../../interview/components/PageLoader.jsx";

const GuestOnly = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (user) return <Navigate to={location.state?.from?.pathname || "/"} replace />;

  return children;
};

export default GuestOnly;