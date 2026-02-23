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

interface Letter {
  id: string;
  title: string;
  content: string;
  language: string;
  templateId?: string | null;
  inputValues?: Record<string, string> | null;
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

export default function LetterView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [letter, setLetter] = useState<Letter | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [content, setContent] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      return;
    }

    fetch(`http://localhost:5000/api/letters/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: Letter) => {
        setLetter(data);
        setContent(data.content);

        if (!data.templateId) {
          setFormData((data.inputValues as Record<string, string>) || {});
          return;
        }

        fetch("http://localhost:5000/api/templates")
          .then((res) => res.json())
          .then((templates: Template[]) => {
            const matchedTemplate = templates.find((t) => t.id === data.templateId);

            if (!matchedTemplate) {
              return;
            }

            setTemplate(matchedTemplate);
            const detectedPlaceholders = extractBracketPlaceholders(
              matchedTemplate.content
            );
            setPlaceholders(detectedPlaceholders);

            const savedValues =
              (data.inputValues as Record<string, string> | null) || {};

            const nextFormData: Record<string, string> = {};
            detectedPlaceholders.forEach((placeholder) => {
              nextFormData[placeholder] = savedValues[placeholder] || "";
            });

            setFormData(nextFormData);
          });
      });
  }, [id]);

  useEffect(() => {
    if (!template) return;

    let templateContent = template.content;

    placeholders.forEach((placeholder) => {
      const value = formData[placeholder]?.trim();
      const regex = new RegExp(`\\[${escapeRegExp(placeholder)}\\]`, "g");
      templateContent = templateContent.replace(regex, value || `[${placeholder}]`);
    });

    const formattedContent = templateContent
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br />");

    setContent(`<p>${formattedContent}</p>`);
  }, [formData, placeholders, template]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      alert("Please login first!");
      return;
    }

    await fetch(`http://localhost:5000/api/letters/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, inputValues: formData }),
    });

    alert("Letter updated successfully!");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this letter? This action cannot be undone.")) {
      return;
    }

    const token = localStorage.getItem("userToken");

    if (!token) {
      alert("Please login first!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/letters/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Letter deleted successfully!");
        navigate("/letters");
      } else {
        alert("Failed to delete letter");
      }
    } catch (error) {
      alert("Error deleting letter");
    }
  };

  if (!letter) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-4">Loading letter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/letters')}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Letters
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{letter.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {letter.language.toUpperCase()}
            </span>
            {template && placeholders.length > 0 && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {placeholders.length} editable field{placeholders.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="lg:sticky lg:top-24 lg:self-start">

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              {template && placeholders.length > 0 ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Update Details
                  </h2>

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
                </>
              ) : (
                <div className="text-center py-8 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
                  <svg className="w-12 h-12 text-blue-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-blue-700 font-medium">No Editable Fields</p>
                  <p className="text-blue-600 text-sm mt-1">This letter has no template fields</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Letter Preview
              </h2>

              <RichEditor content={content} onChange={setContent} />

              {/* Action Buttons */}
              <div className="space-y-3 mt-6">
                <button
                  onClick={handleUpdate}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Update Letter
                </button>

                <button
                  onClick={async () => {
                    const response = await fetch(
                      "http://localhost:5000/api/letters/generate-pdf",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          content,
                          title: letter.title,
                        }),
                      }
                    );

                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${letter.title}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>

                <button
                  onClick={handleDelete}
                  className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Letter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Clean Export Layout */}
        <div
          id="pdf-export"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "0",
          }}
        >
          <div
            style={{
              width: "794px",
              minHeight: "1123px",
              padding: "96px",
              fontFamily: "Times New Roman, serif",
              fontSize: "16px",
              lineHeight: "1.8",
              backgroundColor: "white",
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
