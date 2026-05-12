import { UserSession } from "@/types/models";

// Mock users database
const USERS = {
  admin: {
    password: "admin123",
    username: "admin",
    role: "admin" as const,
  },
};

// Simulated delay for API calls
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
  async login(username: string, password: string): Promise<UserSession> {
    await delay();

    const user = USERS[username as keyof typeof USERS];
    if (!user || user.password !== password) {
      throw new Error("Invalid username or password");
    }

    const session: UserSession = {
      id: "user-" + Date.now(),
      username: user.username,
      role: user.role,
      loginAt: new Date(),
    };

    // Store in localStorage
    localStorage.setItem("userSession", JSON.stringify(session));
    return session;
  },

  async logout(): Promise<void> {
    await delay(200);
    localStorage.removeItem("userSession");
  },

  getSession(): UserSession | null {
    const stored = localStorage.getItem("userSession");
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },
};
