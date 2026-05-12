import { useAuthStore } from "@/context/authStore";

export const useAuth = () => {
  return useAuthStore((state) => ({
    session: state.session,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login: state.login,
    logout: state.logout,
    checkAuth: state.checkAuth,
    clearError: state.clearError,
  }));
};

export const useAuthCheck = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Check auth on mount
  if (typeof window !== "undefined") {
    checkAuth();
  }

  return useAuthStore((state) => ({
    session: state.session,
    isAuthenticated: state.isAuthenticated,
  }));
};
