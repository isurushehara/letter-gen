import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RichEditor from "../components/RichEditor";

export default function LetterView() {
  const { id } = useParams();
  const [letter, setLetter] = useState<any>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    fetch(`http://localhost:5000/api/letters/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setLetter(data);
        setContent(data.content);
      });
  }, [id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

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

    </div>
  );
}
