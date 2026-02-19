import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const PAGE_SIZE = 24; // 4 columns × 6 rows

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
    const [page, setPage] = useState(1);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("http://localhost:5000/api/templates")
            .then((res) => res.json())
            .then((data) => setTemplates(data));
    }, []);

    // Reset to first page whenever filters change
    useEffect(() => {
        setPage(1);
    }, [search, categoryFilter]);

    const filtered = templates.filter(
        (t) =>
            (categoryFilter === "" || t.category === categoryFilter) &&
            t.title.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header row */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Letter Templates</h1>
                    {token && (
                        <button
                            onClick={() => navigate("/letters")}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            View Saved Letters
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search templates..."
                        className="flex-1 p-2 border rounded"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="p-2 border rounded"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Formal">Formal</option>
                        <option value="Business">Business</option>
                        <option value="Academic">Academic</option>
                    </select>
                </div>

                {/* 4-column grid */}
                {paginated.length === 0 ? (
                    <p className="text-gray-500 text-center py-16">No templates found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {paginated.map((template) => (
                            <div
                                key={template.id}
                                className="bg-white p-5 rounded shadow flex flex-col justify-between"
                            >
                                <div>
                                    <h2 className="text-lg font-semibold mb-1">{template.title}</h2>
                                    <p className="text-sm text-gray-500">Category: {template.category}</p>
                                    <p className="text-sm text-gray-500">Tone: {template.tone}</p>
                                </div>

                                <button
                                    disabled={!token}
                                    onClick={() => {
                                        if (!token) {
                                            alert("Please login to use this feature");
                                            return;
                                        }
                                        navigate(`/generator/${template.id}`);
                                    }}
                                    className={`mt-4 px-4 py-2 rounded text-sm ${
                                        token
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    }`}
                                >
                                    {token ? "Use Template" : "Login to Use"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 rounded border bg-white disabled:opacity-40"
                        >
                            ← Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-3 py-1 rounded border ${
                                    p === page
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white hover:bg-gray-50"
                                }`}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1 rounded border bg-white disabled:opacity-40"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
