import { useApp } from "../context/AppContext.jsx";
import { SearchIcon } from "../icons/Icons.jsx";

export default function SearchBox() {
  const { query, setQuery, t } = useApp();

  return (
    <div className="hidden flex-1 items-center gap-2 rounded-full border border-brand-border bg-white py-1.5 pl-5 pr-1.5 shadow-search transition-colors focus-within:border-brand-primary sm:flex sm:max-w-[520px]">
      <div className="flex min-w-0 flex-1 flex-col">
        <label className="text-[11px] font-bold text-brand-ink">어디로</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full border-none bg-transparent p-0 text-[13px] text-brand-ink outline-none placeholder:text-brand-faint"
        />
      </div>
      <button
        type="button"
        aria-label="검색"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white transition-colors hover:bg-brand-primaryDark"
      >
        <SearchIcon className="text-white" />
      </button>
    </div>
  );
}
