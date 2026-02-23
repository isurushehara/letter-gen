import { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "../components/Navbar";

type MenuTab = "users" | "create-template" | "templates";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Template {
  id: string;
  title: string;
  category: string;
  tone: string;
  audience: string;
  language: string;
  content: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<MenuTab>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategory, setTemplateCategory] = useState("all");
  const [templateSort, setTemplateSort] = useState<"newest" | "oldest">(
    "newest"
  );
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "",
    tone: "",
    audience: "",
    language: "EN",
    content: "",
  });

  const token = localStorage.getItem("adminToken");

  const fetchUsers = useCallback(async () => {
    const res = await fetch("http://localhost:5000/api/auth/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  }, [token]);

  const fetchTemplates = useCallback(async () => {
    const res = await fetch("http://localhost:5000/api/templates");
    if (res.ok) {
      const data = await res.json();
      setTemplates(data);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "templates") {
      fetchTemplates();
    }
  }, [activeTab, fetchUsers, fetchTemplates]);

  const handleSearchUsers = async () => {
    if (!searchEmail.trim()) {
      fetchUsers();
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/auth/users/search?email=${searchEmail}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      alert("User deleted successfully");
      fetchUsers();
    } else {
      alert("Failed to delete user");
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    const res = await fetch(
      `http://localhost:5000/api/auth/users/${editingUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
        }),
      }
    );

    if (res.ok) {
      alert("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } else {
      alert("Failed to update user");
    }
  };

  const handleCreateTemplate = async () => {
    if (!token) {
      alert("Please login as admin");
      return;
    }

    const res = await fetch("http://localhost:5000/api/templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Template created successfully");
      setForm({
        title: "",
        category: "",
        tone: "",
        audience: "",
        language: "EN",
        content: "",
      });
      return;
    }

    alert(data.error || "Failed to create template");
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;

    const res = await fetch(`http://localhost:5000/api/templates/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      alert("Template deleted successfully");
      fetchTemplates();
    } else {
      alert("Failed to delete template");
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;

    const res = await fetch(
      `http://localhost:5000/api/templates/${editingTemplate.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editingTemplate.title,
          category: editingTemplate.category,
          tone: editingTemplate.tone,
          audience: editingTemplate.audience,
          language: editingTemplate.language,
          content: editingTemplate.content,
        }),
      }
    );

    if (res.ok) {
      alert("Template updated successfully");
      setEditingTemplate(null);
      fetchTemplates();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update template");
    }
  };

  const templateCategories = useMemo(() => {
    const categories = templates
      .map((template) => template.category?.trim())
      .filter(Boolean) as string[];

    return Array.from(new Set(categories)).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const query = templateSearch.trim().toLowerCase();

    return [...templates]
      .filter((template) => {
        const matchesSearch =
          !query || template.title.toLowerCase().includes(query);
        const matchesCategory =
          templateCategory === "all" || template.category === templateCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const first = new Date(a.createdAt).getTime();
        const second = new Date(b.createdAt).getTime();

        return templateSort === "newest" ? second - first : first - second;
      });
  }, [templateCategory, templateSearch, templateSort, templates]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar */}
        <div className="w-64 bg-gradient-to-b from-indigo-700 to-purple-700 text-white shadow-2xl">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-1">Admin Panel</h2>
            <p className="text-indigo-200 text-sm">Management Dashboard</p>
          </div>

          <nav className="mt-6">
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full px-6 py-4 flex items-center space-x-3 transition-all duration-200 border-l-4 ${
                activeTab === "users"
                  ? "bg-white/20 border-white shadow-lg"
                  : "border-transparent hover:bg-white/10"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="font-medium">User Management</span>
            </button>

            <button
              onClick={() => setActiveTab("create-template")}
              className={`w-full px-6 py-4 flex items-center space-x-3 transition-all duration-200 border-l-4 ${
                activeTab === "create-template"
                  ? "bg-white/20 border-white shadow-lg"
                  : "border-transparent hover:bg-white/10"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="font-medium">Create Template</span>
            </button>

            <button
              onClick={() => setActiveTab("templates")}
              className={`w-full px-6 py-4 flex items-center space-x-3 transition-all duration-200 border-l-4 ${
                activeTab === "templates"
                  ? "bg-white/20 border-white shadow-lg"
                  : "border-transparent hover:bg-white/10"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-medium">All Templates</span>
            </button>
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-8">
            {/* User Management Tab */}
            {activeTab === "users" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                  User Management
                </h1>

                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Search by Email
                      </label>
                      <input
                        type="email"
                        placeholder="user@example.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSearchUsers()
                        }
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        onClick={handleSearchUsers}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md"
                      >
                        Search
                      </button>
                      <button
                        onClick={() => {
                          setSearchEmail("");
                          fetchUsers();
                        }}
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Name
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Role
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {user.email}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  user.role === "ADMIN"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingUser(user)}
                                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {users.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No users found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Create Template Tab */}
            {activeTab === "create-template" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                  Create Letter Template
                </h1>

                <div className="bg-white rounded-xl shadow-md p-8">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Template Title
                      </label>
                      <input
                        value={form.title}
                        placeholder="Enter template title"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Category
                        </label>
                        <input
                          value={form.category}
                          placeholder="e.g., Business, Personal"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                          onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tone
                        </label>
                        <input
                          value={form.tone}
                          placeholder="e.g., Formal, Casual"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                          onChange={(e) =>
                            setForm({ ...form, tone: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Audience
                        </label>
                        <input
                          value={form.audience}
                          placeholder="e.g., Clients, Employees"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                          onChange={(e) =>
                            setForm({ ...form, audience: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Language
                        </label>
                        <input
                          value={form.language}
                          placeholder="e.g., EN, ES"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                          onChange={(e) =>
                            setForm({ ...form, language: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Template Content
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Use placeholders like [Your Name], [Date], [Company Name].
                        Users will get matching input fields automatically.
                      </p>
                      <textarea
                        value={form.content}
                        placeholder="Enter template content..."
                        rows={12}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors resize-none"
                        onChange={(e) =>
                          setForm({ ...form, content: e.target.value })
                        }
                      />
                    </div>

                    <button
                      onClick={handleCreateTemplate}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                    >
                      Create Template
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* All Templates Tab */}
            {activeTab === "templates" && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                  All Templates
                </h1>

                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Search by Letter Name
                      </label>
                      <input
                        type="text"
                        placeholder="Type template name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                        value={templateSearch}
                        onChange={(e) => setTemplateSearch(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                        value={templateCategory}
                        onChange={(e) => setTemplateCategory(e.target.value)}
                      >
                        <option value="all">All Categories</option>
                        {templateCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sort by Date
                      </label>
                      <select
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                        value={templateSort}
                        onChange={(e) =>
                          setTemplateSort(e.target.value as "newest" | "oldest")
                        }
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {template.title}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              <span className="font-semibold text-gray-700">
                                Category:
                              </span>{" "}
                              {template.category || "Uncategorized"}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-700">
                                Date:
                              </span>{" "}
                              {new Date(template.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingTemplate(template)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredTemplates.length === 0 && (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
                      No templates found for current filters.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Edit User
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  value={editingUser.name}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  value={editingUser.email}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={editingUser.role}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateUser}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Edit Template
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  value={editingTemplate.title}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, title: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    value={editingTemplate.category}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, category: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tone
                  </label>
                  <input
                    value={editingTemplate.tone}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, tone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Audience
                  </label>
                  <input
                    value={editingTemplate.audience}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, audience: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Language
                  </label>
                  <input
                    value={editingTemplate.language}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, language: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Keep placeholders in square brackets, for example [Your Address]
                  or [Company/Manager Name].
                </p>
                <textarea
                  value={editingTemplate.content}
                  rows={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors resize-none"
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, content: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateTemplate}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingTemplate(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
