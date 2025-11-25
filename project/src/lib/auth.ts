// src/lib/auth.ts
// Sistema de autenticación ampliado para MVP 2.1
import storage from "./storage";
import usersSeed from "../Data/users.json";

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // solo para desarrollo
  avatar?: string;
  bio?: string;
  major?: string;
  semester?: string;
  institution?: string;
};

const USERS_KEY = "cc:users";       // lista de usuarios
const SESSION_KEY = "cc:session";   // sesión activa
const TOKEN_KEY = "token";          // compatibilidad con App.tsx

// Carga los usuarios: primero localStorage, si no hay usa el seed
function loadUsers(): User[] {
  const users = storage.get<User[]>(USERS_KEY, []) || [];
  if (users.length > 0) return users;

  // Primera carga: sembrar con los del JSON inicial
  type SeedShape = { users?: User[] };
  const seed = usersSeed as SeedShape | undefined;
  const seeded = seed && Array.isArray(seed.users) ? (seed.users as User[]) : [];
  storage.set(USERS_KEY, seeded);
  return seeded;
}

function saveUsers(users: User[]) {
  storage.set(USERS_KEY, users);
}

function setSession(user: User) {
  storage.set(SESSION_KEY, { email: user.email });
  try {
    localStorage.setItem(TOKEN_KEY, "ok");
  } catch (err) { void err; }
}

// Obtiene usuario actual
export function getCurrentUser(): User | null {
  const session = storage.get<{ email: string } | null>(SESSION_KEY, null);
  if (!session) return null;
  const users = loadUsers();
  return users.find(u => u.email === session.email) || null;
}

// For compatibility with external auth providers (Supabase), allow setting
// the current session/user from outside this module. This will ensure
// legacy code that relies on `getCurrentUser()` continues to work.
export function setSessionUser(user: Partial<User>) {
  if (!user || !user.email) return;
  const users = loadUsers();
  const existing = users.find(u => u.email.toLowerCase() === user.email!.toLowerCase());
  const merged: User = existing
    ? { ...existing, ...user }
    : ({ id: user.id || `u_${Date.now()}`, name: (user.name as string) || (user.email as string), email: user.email as string, avatar: user.avatar, major: user.major, semester: user.semester } as User);

  // upsert
  const updated = [merged, ...users.filter(u => u.email.toLowerCase() !== user.email!.toLowerCase())];
  saveUsers(updated);
  setSession(merged);
}

// Inicia sesión con email + contraseña
export function signIn(email: string, password: string): { ok: boolean; message?: string } {
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) return { ok: false, message: "User not found" };
  if (user.password && user.password !== password)
    return { ok: false, message: "Incorrect password" };

  setSession(user);
  return { ok: true };
}

// Registra un nuevo usuario
export function signUp(user: User, password?: string): { ok: boolean; message?: string } {
  const users = loadUsers();

  if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase()))
    return { ok: false, message: "Email already registered" };

  const newUser: User = {
    ...user,
    id: user.id || `u_${Date.now()}`,
  ...(password ? { password } : {}),
  };

  users.unshift(newUser);
  saveUsers(users);
  setSession(newUser);
  return { ok: true };
}

// Cierra sesión
export function signOut() {
  storage.remove(SESSION_KEY);
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) { void err; }
}

// Actualiza perfil actual
export function updateProfile(partial: Partial<User>) {
  const users = loadUsers();
  const current = getCurrentUser();
  if (!current) return;

  const updated = users.map(u =>
    u.email === current.email ? { ...u, ...partial } : u
  );
  saveUsers(updated);
  setSession({ ...current, ...partial });
}

  