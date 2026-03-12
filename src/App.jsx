import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {

  const token = localStorage.getItem("token");

  return (
    <Routes>

      {/* Default route */}
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" /> : <Login />}
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default App;