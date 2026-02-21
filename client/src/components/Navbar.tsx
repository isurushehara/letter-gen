import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, isAdminLoggedIn, logoutUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine context: admin pages vs user pages
  const isAdminContext = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    if (isAdminContext) {
      logoutAdmin();
    } else {
      logoutUser();
    }
    navigate("/");
  };

  // Show logout only for the relevant session in the current context
  const showLogout = isAdminContext ? isAdminLoggedIn : isLoggedIn;
  const showUserLinks = !isAdminContext && !isLoggedIn;

  return (
    <div className="flex justify-between p-4 bg-gray-800 text-white">
      <Link to="/">LetterGen</Link>

      <div className="space-x-4">
        {showUserLinks && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {showLogout && (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </div>
  );
}
