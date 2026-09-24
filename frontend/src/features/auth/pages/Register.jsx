import React, { useState } from 'react'
import { Link, useNavigate } from "react-router";
import { useAuth } from '../hooks/useAuth.jsx';

const Register = () => {

  const { loading, handleRegister } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({ name, email, password });
    navigate("/");
  }

  if (loading) {
    return (<main><h1>Loading...</h1></main>);
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input type="text" onChange={(e) => { setName(e.target.value) }} name="name" id="name" />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" onChange={(e) => { setEmail(e.target.value) }} name="email" id="email" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" onChange={(e) => { setPassword(e.target.value) }} name="password" id="password" />
          </div>
          <button className='button button-primary'>Register</button>
        </form>
        <p>Already have an account? <Link to={"/login"}>Login</Link></p>
      </div>
    </main>
  )
}

export default Register
