import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import GoogleButton from "../components/GoogleButton.jsx";

export default function LoginPage() {
  const { login, loginWithOAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      login({ email, password });
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOAuth(provider) {
    setError("");
    try {
      await loginWithOAuth(provider);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Link to="/" className="mb-8 flex items-center gap-1.5">
        <img src="/yeohaeng-buddy-logo.svg" alt="여행버디" className="h-7 w-7" />
        <span className="font-display text-xl font-semibold text-brand-primary">
          여행버디
        </span>
      </Link>

      <h1 className="mb-1 font-display text-2xl font-semibold text-brand-ink">
        로그인
      </h1>
      <p className="mb-6 text-sm text-brand-sub">
        여행버디에 로그인하고 나만의 로컬 가이드를 만나보세요.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-ink">
            이메일
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-ink">
            비밀번호
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-primary"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-primary py-3 text-sm font-semibold text-white hover:bg-brand-primaryDark disabled:opacity-60"
        >
          로그인
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-brand-faint">
        <span className="h-px flex-1 bg-brand-border" />간편 로그인<span className="h-px flex-1 bg-brand-border" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <GoogleButton onClick={() => handleOAuth("google")} label="Google" />
        <button type="button" onClick={() => handleOAuth("kakao")} className="rounded-xl bg-[#FEE500] py-3 text-sm font-semibold text-[#191919]">카카오</button>
      </div>

      <p className="mt-6 text-center text-sm text-brand-sub">
        아직 계정이 없으신가요?{" "}
        <Link to="/signup" className="font-semibold text-brand-primary">
          회원가입
        </Link>
      </p>
      <Link
        to="/"
        className="mt-4 text-center text-sm text-brand-sub hover:underline"
      >
        ← 홈으로
      </Link>
    </div>
  );
}
