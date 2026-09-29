import { Link } from "react-router";
import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

const FIELDS = [
  { name: "name", label: "Name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "At least 8 characters",
  },
];

const Register = () => {
  const { handleRegister } = useAuth();

  return (
    <AuthForm
      title="Create account"
      fields={FIELDS}
      submitLabel="Create account"
      onSubmit={handleRegister}
      footer={<>Already have an account? <Link to="/login">Log in</Link></>}
    />
  );
};

export default Register;