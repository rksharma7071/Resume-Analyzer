import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth.jsx";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default Protected;