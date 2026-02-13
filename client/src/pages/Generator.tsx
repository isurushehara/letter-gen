import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RichEditor from "../components/RichEditor";

export default function Generator() {
  const { id } = useParams();
  const [template, setTemplate] = useState<any>(null);

  const [formData, setFormData] = useState({
    sender_name: "",
    receiver_name: "",
    start_date: "",
    end_date: "",
  });

  const [generatedLetter, setGeneratedLetter] = useState("");

  // Fetch template
  useEffect(() => {
    fetch("http://localhost:5000/api/templates")
      .then(res => res.json())
      .then(data => {
        const found = data.find((t: any) => t.id === id);
        setTemplate(found);
      });
  }, [id]);

  // Replace placeholders dynamically
  useEffect(() => {
    if (!template) return;

    let content = template.content;

    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof typeof formData];
      const regex = new RegExp(`{{${key}}}`, "g");
      content = content.replace(regex, value);
    });

    // Convert line breaks to HTML
    const formattedContent = content
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br />");

    setGeneratedLetter(`<p>${formattedContent}</p>`);
  }, [formData, template]);

  if (!template) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 grid md:grid-cols-2 gap-8">

      {/* LEFT SIDE - FORM */}
      <div>
        <h2 className="text-xl font-bold mb-4">Fill Details</h2>

        <input
          type="text"
          placeholder="Sender Name"
          className="mb-3 p-2 border rounded w-full"
          onChange={(e) =>
            setFormData({ ...formData, sender_name: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Receiver Name"
          className="mb-3 p-2 border rounded w-full"
          onChange={(e) =>
            setFormData({ ...formData, receiver_name: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Start Date"
          className="mb-3 p-2 border rounded w-full"
          onChange={(e) =>
            setFormData({ ...formData, start_date: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="End Date"
          className="mb-3 p-2 border rounded w-full"
          onChange={(e) =>
            setFormData({ ...formData, end_date: e.target.value })
          }
        />
      </div>

      {/* RIGHT SIDE - LIVE PREVIEW */}
      <div>
        <h2 className="text-xl font-bold mb-4">Live Preview</h2>

        <RichEditor
          content={generatedLetter}
          onChange={(value) => setGeneratedLetter(value)}
        />
      </div>
    </div>
  );
}
