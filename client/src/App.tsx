import { ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Generator from "./pages/Generator";
import Letters from "./pages/Letters";
import LetterView from "./pages/LetterView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";

function AdminRoute({ children }: { children: ReactElement }): ReactElement {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generator/:id" element={<Generator />} />
      <Route path="/letters" element={<Letters />} />
      <Route path="/letter/:id" element={<LetterView />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
