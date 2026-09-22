import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function UserMenu() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 로그아웃 상태: 로그인 / 회원가입 버튼 (흰 헤더 위)
  if (!currentUser) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <Link
          to="/login"
          className="rounded-full px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-tint"
        >
          로그인
        </Link>
        <Link
          to="/signup"
          className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-primaryDark"
        >
          회원가입
        </Link>
      </div>
    );
  }

  const initial = currentUser.name?.[0]?.toUpperCase() || "U";

  return (
    <div className="relative shrink-0" ref={wrapRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-brand-border bg-white py-1 pl-1 pr-3 transition-colors hover:border-brand-primary"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primarySoft text-sm font-bold text-brand-primaryDark">
          {initial}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-48 overflow-hidden rounded-xl border border-brand-border bg-white shadow-dropdown">
          <div className="border-b border-brand-border px-4 py-3">
            <p className="truncate text-sm font-semibold text-brand-ink">
              {currentUser.name}
            </p>
            <p className="truncate text-xs text-brand-sub">{currentUser.email}</p>
          </div>
          <Link
            to="/guides/new"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-left text-sm text-brand-ink hover:bg-brand-primaryLight"
          >
            내 가이드 카드 등록하기
          </Link>
          <Link
            to="/my-guides"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-left text-sm text-brand-ink hover:bg-brand-primaryLight"
          >
            내 가이드 관리
          </Link>
          {currentUser.role === "admin" && (
            <Link
              to="/admin/moderation"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-left text-sm font-semibold text-brand-primary hover:bg-brand-primaryLight"
            >
              가이드 운영 관리
            </Link>
          )}
          <button
            onClick={async () => {
              setOpen(false);
              try {
                await logout();
                navigate("/");
              } catch (error) {
                console.error("로그아웃에 실패했습니다.", error);
              }
            }}
            className="block w-full px-4 py-2.5 text-left text-sm text-brand-ink hover:bg-gray-50"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
