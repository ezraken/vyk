import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGOUT" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const login = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        email,
        password,
      });
      const data = await response.json();
      dispatch({ type: "SET_USER", payload: data.user });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  const register = async (userData: any) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await apiRequest("POST", "/api/auth/register", userData);
      const data = await response.json();
      dispatch({ type: "SET_USER", payload: data.user });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  };

  const refetchUser = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await apiRequest("GET", "/api/auth/me");
      const data = await response.json();
      dispatch({ type: "SET_USER", payload: data.user });
    } catch (error) {
      dispatch({ type: "LOGOUT" });
    }
  };

  useEffect(() => {
    refetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
