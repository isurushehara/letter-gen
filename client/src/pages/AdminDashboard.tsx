import { useState } from "react";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    tone: "",
    audience: "",
    language: "EN",
    content: "",
  });

  const handleCreateTemplate = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login as admin");
      return;
    }

    const res = await fetch("http://localhost:5000/api/templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Template created successfully");
      setForm({
        title: "",
        category: "",
        tone: "",
        audience: "",
        language: "EN",
        content: "",
      });
      return;
    }

    alert(data.error || "Failed to create template");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="bg-white rounded shadow p-6 space-y-4">
          <input
            value={form.title}
            placeholder="Template title"
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            value={form.category}
            placeholder="Category"
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            value={form.tone}
            placeholder="Tone"
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, tone: e.target.value })}
          />

          <input
            value={form.audience}
            placeholder="Audience"
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, audience: e.target.value })}
          />

          <input
            value={form.language}
            placeholder="Language"
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, language: e.target.value })}
          />

          <textarea
            value={form.content}
            placeholder="Template content"
            rows={10}
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          <button
            onClick={handleCreateTemplate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Template
          </button>
        </div>
      </div>
    </div>
  );
}
