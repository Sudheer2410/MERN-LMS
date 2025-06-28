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

  async function handleRegisterUser(event) {
    event.preventDefault();
    await registerService(signUpFormData);
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    const data = await loginService(signInFormData);
    console.log(data, "datadatadatadatadata");

    if (data.success) {
      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(data.data.accessToken)
      );
      setAuth({
        authenticate: true,
        user: data.data.user,
      });
    } else {
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  }

  //check auth user with timeout
  async function checkAuthUser() {
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
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      // Handle different types of errors
      if (error?.response?.status === 401) {
        // 401 is expected when user is not logged in
        setAuth({
          authenticate: false,
          user: null,
        });
      } else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
        // Connection timeout - set auth to false but don't show error
        console.warn("Connection timeout during auth check");
        setAuth({
          authenticate: false,
          user: null,
        });
      } else if (error?.response?.status >= 500) {
        // Server error - set auth to false but don't show error
        console.warn("Server error during auth check:", error.response?.status);
        setAuth({
          authenticate: false,
          user: null,
        });
      } else {
        // Log other errors for debugging but don't break the app
        console.error("Auth check error:", error);
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
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  console.log(auth, "gf");

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
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
