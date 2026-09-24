import { useState } from 'react';
import './App.css';
import { router } from './app.routes.jsx';
import { RouterProvider } from "react-router";
import { AuthProvider } from './features/auth/auth.context.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
