// Modelo de usuario muy simple para MVP 2.0
import storage from "./storage";

export type User = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    major?: string;
    semester?: string;
  };
  
  const USER_KEY = "cc:user";
  const SESSION_KEY = "cc:session";
  
  export function getCurrentUser(): User | null {
    const session = storage.get<{ email: string } | null>(SESSION_KEY, null);
    if (!session) return null;
  
    const user = storage.get<User | null>(USER_KEY, null);
    if (user && user.email === session.email) return user;
    return null;
  }
  
  export function signIn(email: string, password: string): { ok: boolean; message?: string } {
    // Para MVP 2.0: validación mínima. Si no existe usuario guardado, "rechaza".
    void password; // Intentionally unused in MVP 2.0
    const user = storage.get<User | null>(USER_KEY, null);
    if (!user || user.email !== email) {
      return { ok: false, message: "Invalid email or user not registered." };
    }
    // En este MVP no encriptamos; asumimos "cualquier password" por ahora.
    storage.set(SESSION_KEY, { email });
    return { ok: true };
  }
  
  export function signUp(user: User) {
    storage.set(USER_KEY, user);
    storage.set(SESSION_KEY, { email: user.email });
  }
  
  export function signOut() {
    storage.remove(SESSION_KEY);
  }
  
  export function updateProfile(partial: Partial<User>) {
    const u = storage.get<User | null>(USER_KEY, null);
    if (!u) return;
    const merged = { ...u, ...partial };
    storage.set(USER_KEY, merged);
  }
  