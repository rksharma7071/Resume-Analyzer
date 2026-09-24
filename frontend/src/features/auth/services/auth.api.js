import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
})

export const register = async ({ name, email, password }) => {
  try {
    const response = await api.post("/api/auth/register",
      { name, email, password }
    )

    return response.data;

  } catch (error) {
    console.log("Register Error: ", error);
  }
}

export const login = async ({ email, password }) => {
  try {
    const response = await api.post("http://localhost:3000/api/auth/login",
      { email, password }
    )
    return response.data;

  } catch (error) {
    console.log("Login Error: ", error);
  }
}

export const logout = async () => {
  try {
    const response = await api.get("http://localhost:3000/api/auth/logout")

    return response.data;

  } catch (error) {
    console.log("Logout Error: ", error);
  }
}

export const getMe = async () => {
  try {
    const response = await api.get("http://localhost:3000/api/auth/me")

    return response.data;

  } catch (error) {
    console.log("Get Me Error: ", error);
  }
}