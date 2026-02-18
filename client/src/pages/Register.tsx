import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Registered successfully!");
      navigate("/login");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Register</h1>

      <input
        placeholder="Name"
        className="block mb-2 p-2 border"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
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
        onClick={handleRegister}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Register
      </button>
    </div>
  );
}
