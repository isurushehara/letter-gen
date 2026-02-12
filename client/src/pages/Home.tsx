import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Template {
  id: string;
  title: string;
  category: string;
  tone: string;
  audience: string;
}

export default function Home() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/templates")
      .then((res) => res.json())
      .then((data) => setTemplates(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Letter Templates</h1>

      <div className="grid gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white p-5 rounded shadow"
          >
            <h2 className="text-xl font-semibold">{template.title}</h2>
            <p>Category: {template.category}</p>
            <p>Tone: {template.tone}</p>

            <button
              onClick={() => navigate(`/generator/${template.id}`)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
