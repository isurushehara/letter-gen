import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RichEditor from "../components/RichEditor";
import Navbar from "../components/Navbar";

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

  const API = process.env.REACT_APP_API_URL;

  // Fetch template
  useEffect(() => {
    fetch(`${API}/api/templates`)
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

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-4">Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Templates
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{template.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {template.language.toUpperCase()}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              {placeholders.length} field{placeholders.length !== 1 ? 's' : ''} to fill
            </span>
          </div>
        </div>
      
        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT SIDE - FORM */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Fill Details
                </h2>
                {placeholders.length > 0 && (
                  <button
                    onClick={handleReset}
                    className="text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

              {placeholders.length === 0 ? (
                <div className="text-center py-8 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
                  <svg className="w-12 h-12 text-blue-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-blue-700 font-medium">No Input Fields Required</p>
                  <p className="text-blue-600 text-sm mt-1">This template is ready to use</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {placeholders.map((placeholder) => (
                    <div key={placeholder}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {placeholder}
                      </label>
                      <input
                        type={getInputType(placeholder)}
                        placeholder={`Enter ${placeholder.toLowerCase()}`}
                        value={formData[placeholder] || ""}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        onChange={(e) =>
                          setFormData({ ...formData, [placeholder]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE - LIVE PREVIEW */}
          <div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Live Preview
              </h2>

              <RichEditor
                content={generatedLetter}
                onChange={(value) => setGeneratedLetter(value)}
              />

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={async () => {
                    const token = localStorage.getItem("userToken");

                    if (!token) {
                      alert("Please login first!");
                      return;
                    }

                    const response = await fetch(`${API}/api/letters`, {
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
                      navigate("/letters");
                    } else {
                      alert("Failed to save letter");
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Letter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
