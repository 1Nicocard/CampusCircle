import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import * as localAuth from "./auth";

type AuthUser = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  major?: string;
  semester?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  signUp: (payload: { name: string; email: string; password: string; major?: string; semester?: string }) => Promise<{ ok: boolean; message?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Try local session first for compatibility
    const u = localAuth.getCurrentUser();
    return u ? { id: u.id, email: u.email, name: u.name, avatar: u.avatar, major: u.major, semester: u.semester } : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;

    // Get initial session
    async function init() {
      setLoading(true);
      try {
  const { data } = await (supabase as any).auth.getSession();
        const session = data.session;
        if (session && mounted) {
          const u = session.user;
          setUser({ id: u.id, email: u.email || "" });
          // fetch profile fields if present
          try { await refreshUser(); } catch { /* ignore */ }
        }
      } catch (_err) {
        // ignore — fallback to local
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    const { data: listener } = (supabase as any).auth.onAuthStateChange((_: any, session: any) => {
      if (session && session.user) {
        setUser({ id: session.user.id, email: session.user.email || "" });
        // refresh profile details on auth change
        try { refreshUser(); } catch { /* ignore */ }
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      // unsubscribe if present
      try {
        listener?.subscription.unsubscribe();
      } catch (_e) {
        /* ignore */
      }
    };
  }, []);

  async function signIn(email: string, password: string) {
    // If Supabase configured — use it; otherwise fallback to local auth
    if (supabase) {
      try {
  const res = await (supabase as any).auth.signInWithPassword({ email, password });
        if (res.error) return { ok: false, message: res.error.message };
        const u = res.data.user;
        if (u) {
          const authUser: AuthUser = { id: u.id, email: u.email || "" };
          setUser(authUser);
          try { await refreshUser(); } catch { /* ignore */ }
          // Keep local-storage compatibility for legacy code
          try {
            localAuth.setSessionUser({ id: authUser.id, email: authUser.email, name: (res.data.user.user_metadata as any)?.name, avatar: (res.data.user.user_metadata as any)?.avatar });
          } catch (_e) { /* ignore */ }
        }
        return { ok: true };
      } catch (err) {
        const msg = err && typeof err === "object" && (err as any).message ? (err as any).message : String(err);
        return { ok: false, message: msg };
      }
    }

    // fallback local
    const r = localAuth.signIn(email, password);
    if (r.ok) {
      const u = localAuth.getCurrentUser();
      setUser(u ? { id: u.id, email: u.email, name: u.name, avatar: u.avatar, major: u.major, semester: u.semester } : null);
    }
    return r;
  }

  async function signUp(payload: { name: string; email: string; password: string; major?: string; semester?: string }) {
    if (supabase) {
      try {
  const res = await (supabase as any).auth.signUp({ email: payload.email, password: payload.password, options: { data: { name: payload.name } } });
        if (res.error) return { ok: false, message: res.error.message };
        
        // create an initial profile row to keep profile table in sync (if user is returned)
        const u = res.data.user;
        if (u && u.id) {
          console.log('Creating profile for new user:', { 
            id: u.id, 
            username: payload.name, 
            career: payload.major, 
            term: payload.semester 
          });
          
          const defaultAvatar = '/src/Assets/defaultuser.png'; // Default avatar for all new users
          
          try {
            const { data: profileData, error: profileError } = await (supabase as any)
              .from('profiles')
              .upsert({
                id: u.id,
                username: payload.name,
                career: payload.major ?? '',
                term: payload.semester ?? '',
                bio: '',
                avatar: defaultAvatar, // Set default avatar
                created_at: new Date().toISOString(),
              })
              .select();
            
            if (profileError) {
              console.error('Profile creation error:', profileError);
            } else {
              console.log('Profile created successfully:', profileData);
            }
          } catch (profileErr) {
            console.error('Profile creation exception:', profileErr);
          }
        }
        
        // note: a confirmation email may be required depending on Supabase settings
        return { ok: true };
      } catch (err) {
        const msg = err && typeof err === "object" && (err as any).message ? (err as any).message : String(err);
        return { ok: false, message: msg };
      }
    }

    // fallback local
    const localUser: localAuth.User = {
      id: crypto?.randomUUID ? crypto.randomUUID() : `u_${Date.now()}`,
      name: payload.name,
      email: payload.email.toLowerCase(),
      major: payload.major,
      semester: payload.semester,
    };
    const r = localAuth.signUp(localUser, payload.password);
    if (r.ok) {
      const current = localAuth.getCurrentUser();
      setUser(current ? { id: current.id, email: current.email, name: current.name, avatar: current.avatar, major: current.major, semester: current.semester } : null);
    }
    return r;
  }

  async function signOut() {
    if (supabase) {
      try {
        await supabase.auth.signOut();
  } catch (_err) { /* ignore */ }
      setUser(null);
      return;
    }

    // fallback local
    localAuth.signOut();
    setUser(null);
  }

  // Refresh current user profile data from `profiles` table and update context
  async function refreshUser() {
    try {
      // prefer local session when supabase not configured
      if (!supabase) {
        const cur = localAuth.getCurrentUser();
        setUser(cur ? { id: cur.id, email: cur.email, name: cur.name, avatar: cur.avatar, major: cur.major, semester: cur.semester } : null);
        return;
      }

      // fetch session user id
      const { data: sessData } = await (supabase as any).auth.getSession();
      const session = sessData.session;
      const uid = session?.user?.id;
      if (!uid) return;
      // attempt to fetch existing profile (only existing columns)
      const { data: profData, error: profErr, status } = await (supabase as any)
        .from('profiles')
        .select('id, username, career, bio, term, avatar, created_at')
        .eq('id', uid)
        .maybeSingle();

      // If profile missing (status 406 or null data), create minimal row
      if ((!profData && status !== 406) && profErr) {
        console.warn('refreshUser: profile fetch error', profErr);
      }
      let profileRow = profData || null;
      if (!profileRow) {
        try {
          const metaName = (session!.user!.user_metadata as any)?.name || session!.user!.email || 'user';
          const defaultAvatar = '/src/Assets/defaultuser.png'; // Default avatar
          
          const upsertRes = await (supabase as any).from('profiles').upsert({
            id: uid,
            username: metaName,
            career: '',
            term: '',
            avatar: defaultAvatar, // Set default avatar for existing users without profile
            created_at: new Date().toISOString(),
          }).select('id, username, career, bio, term, avatar, created_at').eq('id', uid).maybeSingle();
          if (upsertRes.data) profileRow = upsertRes.data;
        } catch (e) { void e; }
      }

      if (profileRow) {
        console.log('refreshUser: Setting user with profile data:', {
          username: profileRow.username,
          career: profileRow.career,
          term: profileRow.term,
          avatar: profileRow.avatar
        });
        
        setUser({
          id: uid,
          email: session!.user!.email || '',
          name: profileRow.username,
          major: profileRow.career,
          semester: profileRow.term,
          avatar: profileRow.avatar || undefined,
        });
        try {
          localAuth.setSessionUser({ 
            id: uid, 
            email: session!.user!.email || '', 
            name: profileRow.username, 
            major: profileRow.career, 
            semester: profileRow.term,
            avatar: profileRow.avatar || undefined,
          });
        } catch { /* ignore */ }
      }
    } catch (e) {
      void e;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
