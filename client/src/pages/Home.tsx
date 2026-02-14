import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Template {
    id: string;
    title: string;
    category: string;
    tone: string;
    audience: string;
}

export default function Home() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/templates")
            .then((res) => res.json())
            .then((data) => setTemplates(data));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <button
                onClick={() => navigate("/letters")}
                className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
            >
                View Saved Letters
            </button>

            <h1 className="text-3xl font-bold mb-6">Letter Templates</h1>

            <input
                type="text"
                placeholder="Search templates..."
                className="mb-4 p-2 border rounded w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <select
                className="mb-4 p-2 border rounded w-full"
                onChange={(e) => setCategoryFilter(e.target.value)}
            >
                <option value="">All Categories</option>
                <option value="Formal">Formal</option>
                <option value="Business">Business</option>
                <option value="Academic">Academic</option>
            </select>
            <div className="grid gap-4">
                {templates
                    .filter(t =>
                        (categoryFilter === "" || t.category === categoryFilter) &&
                        t.title.toLowerCase().includes(search.toLowerCase())
                    )
                    .map(template => (
                        <div
                            key={template.id}
                            className="bg-white p-5 rounded shadow"
                        >
                            <h2 className="text-xl font-semibold">{template.title}</h2>
                            <p>Category: {template.category}</p>
                            <p>Tone: {template.tone}</p>

                            <button
                                onClick={() => navigate(`/generator/${template.id}`)}
                                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Use Template
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
