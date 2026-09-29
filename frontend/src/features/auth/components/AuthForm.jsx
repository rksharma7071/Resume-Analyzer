import { useState } from "react";
import "../auth-form.scss";
import "../../../styles/button.scss";

const AuthForm = ({ title, fields, submitLabel, onSubmit, footer }) => {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.name, ""])));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await onSubmit(values);

    if (!result.success) {
      setError(result.message);
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="form-container">
        <h1>{title}</h1>

        <form onSubmit={handleSubmit}>
          {fields.map(({ name, label, type = "text", autoComplete, placeholder }) => (
            <div className="input-group" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                name={name}
                type={type}
                autoComplete={autoComplete}
                placeholder={placeholder}
                value={values[name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {error && <div className="form-error" role="alert">{error}</div>}

          <button type="submit" className="button button-primary" disabled={submitting}>
            {submitting ? "Please wait..." : submitLabel}
          </button>
        </form>

        <p>{footer}</p>
      </div>
    </main>
  );
};

export default AuthForm;