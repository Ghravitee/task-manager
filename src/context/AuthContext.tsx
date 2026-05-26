import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Profile } from "../types";

// ─── Types ────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    avatarFile?: File,
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isAuthenticated: false,
  isAuthInitialized: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

// ─── Provider ─────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  // ─── Fetch profile from our profiles table ───────────────────

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setProfile(data as Profile);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  // ─── Initialize auth on mount ────────────────────────────────

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // ✅ Set initialized immediately — we know auth state now
      // Don't wait for profile fetch
      if (
        [
          "INITIAL_SESSION",
          "SIGNED_IN",
          "SIGNED_OUT",
          "TOKEN_REFRESHED",
        ].includes(event)
      ) {
        setIsAuthInitialized(true);
      }

      // Profile fetch runs separately — doesn't block the app
      if (session?.user) {
        fetchProfile(session.user.id); // ← no await intentionally
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ─── Auth methods ─────────────────────────────────────────────

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      avatarFile?: File,
    ) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) throw new Error(error.message);

      // Upload avatar if provided — profile row already exists via trigger
      if (avatarFile && data.user) {
        const { uploadAvatar } = await import("../lib/storage");
        const avatarUrl = await uploadAvatar(avatarFile, data.user.id);
        await supabase
          .from("profiles")
          .update({ avatar_url: avatarUrl })
          .eq("id", data.user.id);
      }
    },
    [],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isAuthenticated: !!user,
        isAuthInitialized,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
