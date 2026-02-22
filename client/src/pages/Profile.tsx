import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { letters: number };
}

export default function ProfilePage() {
  const { userToken, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit name
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState("");

  // Change password
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [userToken]);

  const fetchProfile = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
      setNameInput(data.name);
    } else {
      logoutUser();
      navigate("/login");
    }
    setLoading(false);
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      setNameError("Name cannot be empty.");
      return;
    }
    setNameLoading(true);
    setNameError("");
    const res = await fetch("http://localhost:5000/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ name: nameInput }),
    });
    const data = await res.json();
    setNameLoading(false);
    if (res.ok) {
      setProfile((prev) => prev ? { ...prev, name: data.name } : prev);
      setEditingName(false);
    } else {
      setNameError(data.error || "Failed to update name.");
    }
  };

  const handleChangePassword = async () => {
    setPwError("");
    setPwSuccess("");
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setPwError("All fields are required.");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    setPwLoading(true);
    const res = await fetch("http://localhost:5000/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      }),
    });
    const data = await res.json();
    setPwLoading(false);
    if (res.ok) {
      setPwSuccess("Password changed successfully!");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setChangingPassword(false);
    } else {
      setPwError(data.error || "Failed to change password.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate('/')}
          className="mb-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
        >
          <span>←</span> Back to Home
        </button>
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 select-none">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 truncate">{profile.name}</h1>
            <p className="text-gray-500 text-sm truncate">{profile.email}</p>
            <span className="inline-block mt-2 text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-wide">
              {profile.role}
            </span>
          </div>

          {/* Stats */}
          <div className="text-center flex-shrink-0">
            <p className="text-3xl font-bold text-blue-600">{profile._count.letters}</p>
            <p className="text-xs text-gray-500 mt-1">Letters Saved</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h2>

          {/* Name row */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Full Name
            </label>
            {editingName ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditingName(false); }}
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  disabled={nameLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {nameLoading ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={() => { setEditingName(false); setNameInput(profile.name); setNameError(""); }}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{profile.name}</span>
                <button
                  onClick={() => { setEditingName(true); setNameError(""); }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
            )}
            {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
          </div>

          {/* Email row */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <p className="text-gray-900">{profile.email}</p>
          </div>

          {/* Member since */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Member Since
            </label>
            <p className="text-gray-900">{joinDate}</p>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Password</h2>
            {!changingPassword && (
              <button
                onClick={() => { setChangingPassword(true); setPwError(""); setPwSuccess(""); }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Change Password
              </button>
            )}
          </div>

          {pwSuccess && !changingPassword && (
            <p className="text-green-600 text-sm bg-green-50 px-3 py-2 rounded-lg">{pwSuccess}</p>
          )}

          {changingPassword && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {pwError && <p className="text-red-500 text-sm">{pwError}</p>}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleChangePassword}
                  disabled={pwLoading}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {pwLoading ? "Saving…" : "Save Password"}
                </button>
                <button
                  onClick={() => { setChangingPassword(false); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); setPwError(""); }}
                  className="text-gray-500 hover:text-gray-700 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700"
            >
              Browse Templates
            </button>
            <button
              onClick={() => navigate("/letters")}
              className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50"
            >
              My Letters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
