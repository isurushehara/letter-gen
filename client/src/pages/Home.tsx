import { useEffect, useState } from "react";

interface Template {
  id: string;
  title: string;
  category: string;
  tone: string;
  audience: string;
}

function App() {
  const [templates, setTemplates] = useState<Template[]>([]);

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
            className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{template.title}</h2>
            <p className="text-gray-600">Category: {template.category}</p>
            <p className="text-gray-600">Tone: {template.tone}</p>
            <p className="text-gray-600">Audience: {template.audience}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
