import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex justify-between p-4 bg-gray-800 text-white">
      <Link to="/">LetterGen</Link>

      <div className="space-x-4">
        {!token && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {token && (
          <>
            <Link to="/letters">My Letters</Link>

            {role === "ADMIN" && (
              <Link to="/admin">Admin Panel</Link>
            )}

            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}
