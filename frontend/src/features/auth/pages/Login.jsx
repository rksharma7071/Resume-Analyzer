import { Link } from "react-router";
import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

const FIELDS = [
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
];

const Login = () => {
  const { handleLogin } = useAuth();

  return (
    <AuthForm
      title="Log in"
      fields={FIELDS}
      submitLabel="Log in"
      onSubmit={handleLogin}
      footer={<>Don't have an account? <Link to="/register">Create one</Link></>}
    />
  );
};

export default Login;