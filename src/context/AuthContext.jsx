import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { requireSupabase } from "../lib/supabase.js";

const AuthContext = createContext(null);

function toPublicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0],
  };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    let subscription;

    async function restoreSession() {
      try {
        const client = requireSupabase();
        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        if (mounted) setCurrentUser(toPublicUser(data.session?.user));
        ({ data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
          if (mounted) setCurrentUser(toPublicUser(session?.user));
        }));
      } catch (error) {
        console.warn(error.message);
      } finally {
        if (mounted) setReady(true);
      }
    }

    restoreSession();
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signup = useCallback(async ({ email, password, fullName, phone, postalCode, address, addressDetail }) => {
    if (!email.trim() || !password) {
      throw new Error("이메일과 비밀번호를 모두 입력해주세요.");
    }
    if (password.length < 6) {
      throw new Error("비밀번호는 6자 이상이어야 해요.");
    }
    const { data, error } = await requireSupabase().auth.signUp({
      email: email.trim().toLowerCase(), password,
      options: { data: {
        full_name: fullName.trim(), phone: phone.trim(), postal_code: postalCode.trim(),
        address: address.trim(), address_detail: addressDetail.trim(),
        terms_agreed_at: new Date().toISOString(), privacy_agreed_at: new Date().toISOString(),
      } },
    });
    if (error) throw error;
    return { requiresEmailConfirmation: !data.session };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { error } = await requireSupabase().auth.signInWithPassword({
      email: email.trim().toLowerCase(), password,
    });
    if (error) throw error;
  }, []);

  const loginWithOAuth = useCallback(async (provider) => {
    const { error } = await requireSupabase().auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  }, []);

  const updateProfile = useCallback(async ({ fullName, phone, postalCode, address, addressDetail }) => {
    const client = requireSupabase();
    const { data: { user } } = await client.auth.getUser();
    if (!user) throw new Error("로그인이 필요해요.");
    const now = new Date().toISOString();
    const { error } = await client.from("profiles").update({
      full_name: fullName.trim(), phone: phone.trim(), postal_code: postalCode.trim(),
      address: address.trim(), address_detail: addressDetail.trim() || null,
      terms_agreed_at: now, privacy_agreed_at: now, updated_at: now,
    }).eq("id", user.id);
    if (error) throw error;
    await client.auth.updateUser({ data: { full_name: fullName.trim() } });
  }, []);

  const logout = useCallback(async () => {
    const { error } = await requireSupabase().auth.signOut();
    if (error) throw error;
  }, []);

  const value = { currentUser, ready, signup, login, loginWithOAuth, updateProfile, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  return ctx;
}
