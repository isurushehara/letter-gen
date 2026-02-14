import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Letter {
  id: string;
  title: string;
  createdAt: string;
}

export default function Letters() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/letters")
      .then((res) => res.json())
      .then((data) => setLetters(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Saved Letters</h1>

      <div className="grid gap-4">
        {letters.map((letter) => (
          <div
            key={letter.id}
            className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer"
            onClick={() => navigate(`/letter/${letter.id}`)}
          >
            <h2 className="text-xl font-semibold">{letter.title}</h2>
            <p className="text-gray-500">
              {new Date(letter.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
