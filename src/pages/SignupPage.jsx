import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import GoogleButton from "../components/GoogleButton.jsx";

export default function SignupPage() {
  const { signup, loginWithOAuth, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const completingProfile = searchParams.get("completeProfile") === "1";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!completingProfile && password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않아요.");
      return;
    }

    setSubmitting(true);
    try {
      if (completingProfile) {
        await updateProfile({ fullName, phone, postalCode, address, addressDetail });
      } else {
        const result = await signup({ email, password, fullName, phone, postalCode, address, addressDetail });
        if (result.requiresEmailConfirmation) {
          setNotice("인증 이메일을 보냈어요. 메일의 링크를 열어 가입을 완료해주세요.");
          return;
        }
      }
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
        {completingProfile ? "추가 정보 입력" : "회원가입"}
      </h1>
      <p className="mb-6 text-sm text-brand-sub">
        {completingProfile ? "서비스 이용에 필요한 정보를 입력해주세요." : "가입하면 나만의 가이드 카드를 등록할 수 있어요."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-ink">
            이름
          </label>
          <input
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="실명을 입력해주세요"
            className="w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-primary"
          />
        </div>
        {!completingProfile && <div>
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
        </div>}
        {!completingProfile && <div>
          <label className="mb-1 block text-sm font-medium text-brand-ink">
            비밀번호
          </label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6자 이상"
            className="w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-primary"
          />
        </div>}
        {!completingProfile && <div>
          <label className="mb-1 block text-sm font-medium text-brand-ink">
            비밀번호 확인
          </label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-primary"
          />
        </div>}
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-ink">휴대전화</label>
          <input type="tel" required autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" className="w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-primary" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-ink">우편번호</label>
          <input type="text" required autoComplete="postal-code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="우편번호" className="w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-primary" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-ink">주소</label>
          <input type="text" required autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="기본 주소" className="w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-primary" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-ink">상세 주소 (선택)</label>
          <input type="text" autoComplete="address-line2" value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} placeholder="동·호수 등" className="w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-primary" />
        </div>
        <label className="flex items-start gap-2 text-sm text-brand-ink">
          <input type="checkbox" required className="mt-1" />
          <span>서비스 이용약관 및 개인정보 수집·이용에 동의합니다. (필수)</span>
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {notice && <p className="text-sm text-brand-primary">{notice}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-primary py-3 text-sm font-semibold text-white hover:bg-brand-primaryDark disabled:opacity-60"
        >
          {completingProfile ? "정보 저장하고 시작하기" : "가입하기"}
        </button>
      </form>

      {!completingProfile && <>
        <div className="my-6 flex items-center gap-3 text-xs text-brand-faint"><span className="h-px flex-1 bg-brand-border" />간편 가입<span className="h-px flex-1 bg-brand-border" /></div>
        <div className="grid grid-cols-2 gap-3">
          <GoogleButton onClick={() => handleOAuth("google")} label="Google" />
          <button type="button" onClick={() => handleOAuth("kakao")} className="rounded-xl bg-[#FEE500] py-3 text-sm font-semibold text-[#191919]">카카오</button>
        </div>
      </>}

      <p className="mt-6 text-center text-sm text-brand-sub">
        이미 계정이 있으신가요?{" "}
        <Link to="/login" className="font-semibold text-brand-primary">
          로그인
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
