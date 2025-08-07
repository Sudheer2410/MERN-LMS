import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  async function handleRegisterUser(event) {
    event.preventDefault();
    setAuthError(""); // Clear previous error
    try {
      await registerService(signUpFormData);
      // Optionally, redirect or show success
    } catch (error) {
      setAuthError(error?.response?.data?.message || "Registration failed");
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    setAuthError(""); // Clear previous error
    try {
      const data = await loginService(signInFormData);
      if (data.success) {
        localStorage.setItem("token", data.data.accessToken);
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setAuthError(data.message || "Login failed");
      }
    } catch (error) {
      setAuthError(error?.response?.data?.message || "Login failed");
    }
  }

  //check auth user with timeout
  async function checkAuthUser() {
    // Check if there's a stored token first
    const storedToken = localStorage.getItem("token");
    
    if (!storedToken) {
      setAuth({
        authenticate: false,
        user: null,
      });
      setLoading(false);
      return;
    }

    // Set a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Auth check timeout')), 5000); // 5 second timeout
    });

    try {
      const dataPromise = checkAuthService();
      const data = await Promise.race([dataPromise, timeoutPromise]);
      
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("token");
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      // Handle different types of errors
      if (error?.response?.status === 401) {
        // 401 is expected when user is not logged in - remove invalid token
        localStorage.removeItem("token");
        setAuth({
          authenticate: false,
          user: null,
        });
      } else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
        // Connection timeout - set auth to false but don't show error
        setAuth({
          authenticate: false,
          user: null,
        });
      } else if (error?.response?.status >= 500) {
        // Server error - set auth to false but don't show error
        setAuth({
          authenticate: false,
          user: null,
        });
      } else {
        // Log other errors for debugging but don't break the app
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } finally {
      // Always set loading to false
      setLoading(false);
    }
  }

  function resetCredentials() {
    localStorage.removeItem("token");
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);



  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
        authError,
        setAuthError,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
