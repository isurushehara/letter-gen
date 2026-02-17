import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RichEditor from "../components/RichEditor";
import html2pdf from "html2pdf.js";

export default function LetterView() {
  const { id } = useParams();
  const [letter, setLetter] = useState<any>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/letters/${id}`)
      .then(res => res.json())
      .then(data => {
        setLetter(data);
        setContent(data.content);
      });
  }, [id]);

  const handleUpdate = async () => {
    await fetch(`http://localhost:5000/api/letters/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    alert("Letter updated successfully!");
  };

  if (!letter) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">{letter.title}</h1>

      <RichEditor content={content} onChange={setContent} />
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



      <button
        onClick={handleUpdate}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update Letter
      </button>

      <button
        onClick={() => {
          const element = document.createElement("div");

          element.innerHTML = `
    <div style="
      width: 794px;
      min-height: 1123px;
      padding: 96px;
      font-family: 'Times New Roman', serif;
      font-size: 16px;
      line-height: 1.8;
      background: white;
    ">
      ${content}
    </div>
  `;

          document.body.appendChild(element);

          const opt: any = {
            margin: 0,
            filename: `${letter.title}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
          };

          html2pdf()
            .set(opt)
            .from(element)
            .save()
            .then(() => {
              document.body.removeChild(element);
            });
        }}

        className="mt-4 ml-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>

    </div>
  );
}
