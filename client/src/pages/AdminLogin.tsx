import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login, role, token } = useAuth();

  useEffect(() => {
    if (token && role === "ADMIN") {
      navigate("/admin", { replace: true });
    }
  }, [token, role, navigate]);

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      login(data.token);
      alert("Admin login successful!");
      navigate("/admin");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Admin Login</h1>

      <input
        placeholder="Email"
        className="block mb-2 p-2 border"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="block mb-2 p-2 border"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button
        onClick={handleLogin}
        className="bg-green-600 text-white px-4 py-2"
      >
        Login as Admin
      </button>
    </div>
  );
}
