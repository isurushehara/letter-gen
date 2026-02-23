import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  userToken: string | null;
  adminToken: string | null;
  isLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  loginUser: (token: string) => void;
  loginAdmin: (token: string) => void;
  logoutUser: () => void;
  logoutAdmin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUserToken = localStorage.getItem("userToken");
    const storedAdminToken = localStorage.getItem("adminToken");

    if (storedUserToken) {
      setUserToken(storedUserToken);
    }

    if (storedAdminToken) {
      setAdminToken(storedAdminToken);
    }

    const legacyToken = localStorage.getItem("token");
    if (legacyToken && !storedUserToken && !storedAdminToken) {
      try {
        const decoded: any = jwtDecode(legacyToken);
        if (decoded.role === "ADMIN") {
          localStorage.setItem("adminToken", legacyToken);
          setAdminToken(legacyToken);
        } else {
          localStorage.setItem("userToken", legacyToken);
          setUserToken(legacyToken);
        }
      } finally {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const loginUser = (newToken: string) => {
    localStorage.setItem("userToken", newToken);
    setUserToken(newToken);
  };

  const loginAdmin = (newToken: string) => {
    localStorage.setItem("adminToken", newToken);
    setAdminToken(newToken);
  };

  const logoutUser = () => {
    localStorage.removeItem("userToken");
    setUserToken(null);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    setUserToken(null);
    setAdminToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        adminToken,
        isLoggedIn: Boolean(userToken),
        isAdminLoggedIn: Boolean(adminToken),
        loginUser,
        loginAdmin,
        logoutUser,
        logoutAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext)!;
};
