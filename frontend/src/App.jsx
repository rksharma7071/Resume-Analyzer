import { useState } from 'react';
import './App.css';
import { router } from './app.routes.jsx';
import { RouterProvider } from "react-router";

function App() {
  const [count, setCount] = useState(0)

  return (
    <RouterProvider router={router} />
  )
}

export default App
