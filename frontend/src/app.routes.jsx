import { createBrowserRouter, Navigate } from "react-router";
import Protected from "./features/auth/components/Protected.jsx";
import GuestOnly from "./features/auth/components/GuestOnly.jsx";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import Home from "./features/interview/pages/Home.jsx";
import Interview from "./features/interview/pages/Interview.jsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <GuestOnly><Login /></GuestOnly>
  },
  {
    path: "/register",
    element: <GuestOnly><Register /></GuestOnly>
  },
  {
    path: "/",
    element: <Protected><Home /></Protected>
  },
  {
    path: "/interview/:id",
    element: <Protected><Interview /></Protected>
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  },
]);