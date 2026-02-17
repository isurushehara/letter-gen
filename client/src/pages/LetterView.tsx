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

      <div id="letter-content">
        <RichEditor content={content} onChange={setContent} />
      </div>

      <button
        onClick={handleUpdate}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update Letter
      </button>

      <button
        onClick={() => {
          const element = document.getElementById("letter-content");
          if (!element) return;

          const opt: any = {
            margin: 0.5,
            filename: `${letter.title}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
          };


          html2pdf().set(opt).from(element).save();
        }}
        className="mt-4 ml-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>

    </div>
  );
}
