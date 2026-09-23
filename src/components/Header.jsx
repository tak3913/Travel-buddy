import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import SearchBox from "./SearchBox.jsx";
import LangSwitcher from "./LangSwitcher.jsx";
import FilterChips from "./FilterChips.jsx";
import UserMenu from "./UserMenu.jsx";

export default function Header() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleHostClick = () => {
    navigate(currentUser ? "/guides/new" : "/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-brand-borderSoft bg-white shadow-header">
      <div className="mx-auto flex max-w-wrap items-center gap-5 px-5 py-4 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img
            src="/yeohaeng-buddy-logo.svg"
            alt="여행버디"
            className="block h-[30px] w-[30px]"
          />
          <span className="font-display text-[19px] font-extrabold tracking-tightest text-brand-ink">
            이음
          </span>
        </Link>

        <SearchBox />

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleHostClick}
            className="hidden rounded-full px-3.5 py-2.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-tint sm:block"
          >
            가이드 등록하기
          </button>
          <LangSwitcher />
          <UserMenu />
        </div>
      </div>

      <FilterChips />
    </header>
  );
}
