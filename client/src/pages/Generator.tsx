import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RichEditor from "../components/RichEditor";

interface Template {
  id: string;
  title: string;
  language: string;
  content: string;
}

const extractBracketPlaceholders = (content: string) => {
  const matches = Array.from(content.matchAll(/\[([^\[\]\n]+)\]/g), (match) =>
    match[1].trim()
  ).filter(Boolean);

  return matches.filter((item, index) => matches.indexOf(item) === index);
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getInputType = (label: string) => {
  const normalized = label.toLowerCase();

  if (normalized.includes("email")) return "email";
  if (normalized.includes("date")) return "date";
  if (
    normalized.includes("phone") ||
    normalized.includes("mobile") ||
    normalized.includes("tel")
  ) {
    return "tel";
  }

  return "text";
};

export default function Generator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const [generatedLetter, setGeneratedLetter] = useState("");

  // Fetch template
  useEffect(() => {
    fetch("http://localhost:5000/api/templates")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((t: Template) => t.id === id);
        setTemplate(found);
      });
  }, [id]);

  useEffect(() => {
    if (!template) return;

    const detectedPlaceholders = extractBracketPlaceholders(template.content);
    setPlaceholders(detectedPlaceholders);

    setFormData((prev) => {
      const next: Record<string, string> = {};
      detectedPlaceholders.forEach((placeholder) => {
        next[placeholder] = prev[placeholder] || "";
      });
      return next;
    });
  }, [template]);

  // Replace placeholders dynamically
  useEffect(() => {
    if (!template) return;

    let content = template.content;

    placeholders.forEach((placeholder) => {
      const value = formData[placeholder]?.trim();
      const regex = new RegExp(`\\[${escapeRegExp(placeholder)}\\]`, "g");
      content = content.replace(regex, value || `[${placeholder}]`);
    });

    // Convert line breaks to HTML
    const formattedContent = content
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br />");

    setGeneratedLetter(`<p>${formattedContent}</p>`);
  }, [formData, placeholders, template]);

  const handleReset = () => {
    const emptyForm: Record<string, string> = {};
    placeholders.forEach((placeholder) => {
      emptyForm[placeholder] = "";
    });
    setFormData(emptyForm);
  };

  if (!template) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
      >
        <span>←</span> Back to Home
      </button>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT SIDE - FORM */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Fill Details</h2>
            {placeholders.length > 0 && (
              <button
                onClick={handleReset}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
              >
                Reset
              </button>
            )}
          </div>

        {placeholders.length === 0 && (
          <p className="text-sm text-gray-600 bg-white rounded border p-3">
            This template has no dynamic input fields.
          </p>
        )}

        {placeholders.map((placeholder) => (
          <div key={placeholder} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {placeholder}
            </label>
            <input
              type={getInputType(placeholder)}
              placeholder={placeholder}
              value={formData[placeholder] || ""}
              className="p-2 border rounded w-full"
              onChange={(e) =>
                setFormData({ ...formData, [placeholder]: e.target.value })
              }
            />
          </div>
        ))}
      </div>

      {/* RIGHT SIDE - LIVE PREVIEW */}
      <div>
        <h2 className="text-xl font-bold mb-4">Live Preview</h2>

        <RichEditor
          content={generatedLetter}
          onChange={(value) => setGeneratedLetter(value)}
        />
      </div>

      <button
        onClick={async () => {
          const token = localStorage.getItem("userToken");

          if (!token) {
            alert("Please login first!");
            return;
          }

          const response = await fetch("http://localhost:5000/api/letters", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: template.title,
              content: generatedLetter,
              language: template.language,
              templateId: template.id,
              inputValues: formData,
            }),
          });

          if (response.ok) {
            alert("Letter saved successfully!");
          } else {
            alert("Failed to save letter");
          }
        }}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Letter
      </button>
      </div>
    </div>
  );
}
