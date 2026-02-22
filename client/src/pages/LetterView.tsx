import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RichEditor from "../components/RichEditor";

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

  if (!letter) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => navigate('/letters')}
        className="mb-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
      >
        <span>←</span> Back to Letters
      </button>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-2xl font-bold mb-4">{letter.title}</h1>

        {template && placeholders.length > 0 ? (
          <>
            <h2 className="text-xl font-bold mb-4">Update Details</h2>

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
          </>
        ) : (
          <p className="text-sm text-gray-600 bg-white rounded border p-3">
            No template input fields found for this saved letter.
          </p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Live Preview</h2>
        <RichEditor content={content} onChange={setContent} />
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

      <div className="md:col-span-2">
        <button
          onClick={handleUpdate}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
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
          className="mt-4 ml-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>

        <button
          onClick={handleDelete}
          className="mt-4 ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Letter
        </button>
      </div>
      </div>
    </div>
  );
}
