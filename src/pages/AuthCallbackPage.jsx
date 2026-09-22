import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { requireSupabase } from "../lib/supabase.js";

export default function AuthCallbackPage() {
  const { currentUser, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function continueAfterOAuth() {
      if (!ready || !currentUser) return;
      const { data, error } = await requireSupabase()
        .from("profiles")
        .select("full_name, phone, postal_code, address")
        .eq("id", currentUser.id)
        .maybeSingle();
      if (error || !data?.full_name || !data.phone || !data.postal_code || !data.address) {
        navigate("/signup?completeProfile=1", { replace: true });
        return;
      }
      navigate("/", { replace: true });
    }
    continueAfterOAuth();
  }, [currentUser, navigate, ready]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-center text-sm text-brand-sub">
      로그인 정보를 확인하고 있어요…
    </div>
  );
}
