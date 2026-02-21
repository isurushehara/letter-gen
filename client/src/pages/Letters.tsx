import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

interface Letter {
  id: string;
  title: string;
  language: string;
  createdAt: string;
  template: { category: string; title: string } | null;
}

export default function Letters() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch letters and template categories in parallel
    Promise.all([
      fetch("http://localhost:5000/api/letters", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch("http://localhost:5000/api/templates").then((r) => r.json()),
    ]).then(([letterData, templateData]) => {
      setLetters(Array.isArray(letterData) ? letterData : []);

      // Build unique, sorted category list from admin-created templates
      const cats: string[] = Array.from(
        new Set(
          (templateData as { category: string }[])
            .map((t) => t.category?.trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b));
      setCategories(cats);
      setLoading(false);
    });
  }, [navigate]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return letters.filter((l) => {
      const matchCat =
        selectedCategory === "all" ||
        l.template?.category === selectedCategory;
      const matchSearch = !q || l.title.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [letters, selectedCategory, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Letters</h1>
            <p className="text-gray-500 text-sm mt-1">
              {letters.length} letter{letters.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 shadow"
          >
            + New Letter
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search letters…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[180px]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Letters list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="mx-auto w-14 h-14 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 font-medium">No letters found.</p>
            {(selectedCategory !== "all" || search) && (
              <button
                onClick={() => { setSelectedCategory("all"); setSearch(""); }}
                className="mt-3 text-blue-600 text-sm hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((letter) => (
              <div
                key={letter.id}
                onClick={() => navigate(`/letter/${letter.id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900 truncate">
                      {letter.title}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(letter.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {letter.template?.category && (
                      <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        {letter.template.category}
                      </span>
                    )}
                    {letter.language && (
                      <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase">
                        {letter.language}
                      </span>
                    )}
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {letter.template?.title && (
                  <p className="text-xs text-gray-400 mt-2 truncate">
                    Template: {letter.template.title}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
