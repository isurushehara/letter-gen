import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Generator() {
  const { id } = useParams();
  const [template, setTemplate] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/templates`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((t: any) => t.id === id);
        setTemplate(found);
      });
  }, [id]);

  if (!template) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">{template.title}</h1>

      <textarea
        className="w-full h-96 p-4 border rounded"
        defaultValue={template.content}
      />
    </div>
  );
}
