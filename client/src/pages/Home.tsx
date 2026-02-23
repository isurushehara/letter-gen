import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const PAGE_SIZE = 24; // 4 columns × 6 rows

interface Template {
    id: string;
    title: string;
    category: string;
    tone: string;
    audience: string;
    language?: string;
    content?: string;
}

export default function Home() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [page, setPage] = useState(1);
    const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

    const token = localStorage.getItem("userToken");

    useEffect(() => {
        fetch("http://localhost:5000/api/templates")
            .then((res) => res.json())
            .then((data) => setTemplates(data));
    }, []);

    // Derive unique sorted categories from whatever templates exist
    const categories = useMemo(() => {
        return Array.from(
            new Set(templates.map((t) => t.category?.trim()).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b));
    }, [templates]);

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

    const handleTemplateClick = async (template: Template) => {
        if (token) {
            navigate(`/generator/${template.id}`);
        } else {
            // Fetch full template details for preview
            const res = await fetch(`http://localhost:5000/api/templates`);
            const allTemplates = await res.json();
            const fullTemplate = allTemplates.find((t: Template) => t.id === template.id);
            setPreviewTemplate(fullTemplate || template);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
                <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Create Professional Letters in Minutes
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                            Choose from our extensive library of letter templates for any occasion. 
                            Generate personalized, well-formatted letters effortlessly.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => {
                                    if (token) {
                                        // Scroll to templates section
                                        document.getElementById('templates-section')?.scrollIntoView({ 
                                            behavior: 'smooth' 
                                        });
                                    } else {
                                        navigate('/register');
                                    }
                                }}
                                className="px-8 py-4 bg-white text-blue-700 rounded-lg font-semibold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all shadow-lg"
                            >
                                {token ? 'Browse Templates' : 'Get Started Free'}
                            </button>
                            
                            {!token && (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-700 transform hover:scale-105 transition-all"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>

                        {/* Features highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">100+ Templates</h3>
                                <p className="text-blue-100 text-sm">Professional templates for every need</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Instant Generation</h3>
                                <p className="text-blue-100 text-sm">Create letters in seconds, not hours</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Save & Manage</h3>
                                <p className="text-blue-100 text-sm">Keep all your letters organized</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Templates Section */}
            <div id="templates-section" className="max-w-7xl mx-auto px-6 py-12">
                {/* Header row */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Letter Templates</h2>
                    <p className="text-gray-600">Choose a template to get started</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search templates..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <svg 
                            className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <select
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* 4-column grid */}
                {paginated.length === 0 ? (
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500 text-lg">No templates found.</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {paginated.map((template) => (
                            <div
                                key={template.id}
                                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between border border-gray-100 hover:border-blue-200"
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-semibold text-gray-800 leading-tight">{template.title}</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            {template.category}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                            {template.tone}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleTemplateClick(template)}
                                    className={`mt-5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        token
                                            ? "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
                                    }`}
                                >
                                    {token ? "Use Template" : "Preview Template"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
                        >
                            ← Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                                    p === page
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            {/* Template Preview Panel - Right Side (for guest users) */}
            {previewTemplate && (
                <>
                    {/* Backdrop overlay */}
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                        onClick={() => setPreviewTemplate(null)}
                    />
                    
                    {/* Preview Panel */}
                    <div className="fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl z-50 overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg z-10">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{previewTemplate.title}</h2>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                                            {previewTemplate.category}
                                        </span>
                                        <span className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                                            {previewTemplate.tone}
                                        </span>
                                        {previewTemplate.language && (
                                            <span className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                                                {previewTemplate.language.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPreviewTemplate(null)}
                                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-blue-700">
                                        This is a preview only. <strong>Sign in or create an account</strong> to customize and save this template.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Template Preview
                                </h3>
                                <div className="bg-white p-6 rounded border border-gray-300 whitespace-pre-wrap text-gray-800 leading-relaxed">
                                    {previewTemplate.content || "No content available for this template."}
                                </div>
                            </div>

                            {/* Call to Action */}
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => navigate('/register')}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Sign Up to Use Template
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign In
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
